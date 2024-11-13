const { test, describe, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../src/app');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../src/models/user.js');
const helper = require('./helper.js');

const api = supertest(app);

describe('POST /api/users', async () => {
	describe('when there is one user in the database', async () => {
		beforeEach(async () => {
			await User.deleteMany({});

			const passwordHash = await bcrypt.hash('sekret', 10);
			await new User({ username: 'root', passwordHash }).save();
		});

		test('creates a user with a fresh username', async () => {
			const newUser = {
				username: 'jdoe',
				name: 'John Doe',
				password: 'anonymous'
			};

			const response = await api
				.post('/api/users')
				.send(newUser)
				.expect(201);

			const user = await User.findById(response.body.id);
			assert.notStrictEqual(user, null);
			assert.strictEqual(user.username, newUser.username);
		});

		test('fails when the username is not unique', async () => {
			const usersBefore = await helper.usersInDb();

			const newUser = {
				username: 'root',
				name: 'Admin',
				password: 'superuser'
			};

			await api
				.post('/api/users')
				.send(newUser)
				.expect(400);

			const usersAfter = await helper.usersInDb();

			assert.strictEqual(usersBefore.length, usersAfter.length);
		});

		test('fails when the username is missing from the request', async () => {
			const usersBefore = await helper.usersInDb();

			const newUser = {
				name: 'John Doe',
				password: 'anonymous'
			};

			await api
				.post('/api/users')
				.send(newUser)
				.expect(400);

			const usersAfter = await helper.usersInDb();

			assert.strictEqual(usersBefore.length, usersAfter.length);
		});

		test('fails when the username is less than 3 characters long', async () => {
			const usersBefore = await helper.usersInDb();

			const newUser = {
				username: 'jd',
				name: 'John Doe',
				password: 'anonymous'
			};

			await api
				.post('/api/users')
				.send(newUser)
				.expect(400);

			const usersAfter = await helper.usersInDb();

			assert.strictEqual(usersBefore.length, usersAfter.length);
		});

		test('fails when the password is missing from the request', async () => {
			const usersBefore = await helper.usersInDb();

			const newUser = {
				username: 'jdoe',
				name: 'John Doe',
			};

			await api
				.post('/api/users')
				.send(newUser)
				.expect(400);

			const usersAfter = await helper.usersInDb();

			assert.strictEqual(usersBefore.length, usersAfter.length);
		});

		test('fails when the password is less than 3 characters long', async () => {
			const usersBefore = await helper.usersInDb();

			const newUser = {
				username: 'jdoe',
				name: 'John Doe',
				password: 'an'
			};

			await api
				.post('/api/users')
				.send(newUser)
				.expect(400);

			const usersAfter = await helper.usersInDb();

			assert.strictEqual(usersBefore.length, usersAfter.length);
		});
	});
});

describe('GET /api/users', async () => {
	beforeEach(async () => {
		await User.deleteMany({});

		await Promise.all(
			helper.initialUsers.map(async (user) => {
				return new User({
					...user,
					passwordHash: await bcrypt.hash(user.password, 10)
				}).save();
			})
		);
	});

	test('returns all users in the database', async () => {
		const usersBefore = await helper.usersInDb();

		const response = await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		assert.strictEqual(response.body.length, usersBefore.length);
		response.body.forEach(user => {
			assert.strictEqual(usersBefore.filter(u => u.username === user.username).length, 1);
		});
	});
});

after(async () => {
	await mongoose.connection.close();
});
