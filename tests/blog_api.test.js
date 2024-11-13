const { test, describe, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../src/app');
const Blog = require('../src/models/blog');
const User = require('../src/models/user');
const helper = require('./helper');

const api = supertest(app);

beforeEach(async () => {
	await User.deleteMany({});

	await Promise.all(
		helper.initialUsers.map(async (user) => {
			return new User(user).save();
		})
	);
});

beforeEach(async () => {
	await Blog.deleteMany({});

	const promiseArray = helper.initialBlogs.map((blog) => {
		const randomIndex = Math.floor(Math.random() * helper.initialUsers.length);
		const userId = helper.initialUsers[randomIndex]._id;
		const newBlog = new Blog({ ...blog, user: userId });
		return newBlog
			.save()
			.then(() => (User.findById(userId)))
			.then(user => {
				user.blogs.push(newBlog._id);
				return user.save();
			});
	});

	await Promise.all(promiseArray);
});


describe('GET /api/blogs/', async () => {
	describe('when db is empty', async () => {
		beforeEach(async () => {
			await Blog.deleteMany({});
		});

		test('when db is empty, returns an empty list', async () => {
			const response = await api.get('/api/blogs/');

			assert.strictEqual(response.body.length, 0);
		});
	});

	describe('when db has mublitple blogs', async () => {
		test('returns blogs in json format', async () => {
			await api
				.get('/api/blogs/')
				.expect(200)
				.expect('Content-Type', /application\/json/);
		});

		test('when db has multiple blogs, returns a list of the blogs', async () => {
			const response = await api.get('/api/blogs/');

			assert.strictEqual(response.body.length, helper.initialBlogs.length);
		});

		test('returned blogs have \'id\' property and not \'_id\'', async () => {
			const response = await api.get('/api/blogs/');

			response.body.forEach(x => {
				assert.strictEqual(typeof x.id, 'string');
				assert.strictEqual(typeof x._id, 'undefined');
			});
		});

		test('returns user information with the blogs', async () => {
			const response = await api.get('/api/blogs/');

			response.body.forEach(b => {
				assert.strictEqual(typeof b.user, 'object');
				assert.strictEqual(typeof b.user.username, 'string');
				assert.strictEqual(typeof b.user.name, 'string');
				assert.strictEqual(typeof b.user.id, 'string');
				assert.strictEqual(typeof b.user.blogs, 'undefined');
			});
		});
	});
});

describe('POST /api/blogs/', async () => {
	beforeEach(async () => {
		await Blog.deleteMany({});
	});

	const newBlog = {
		title: 'How to hack NASA using HTML',
		author: 'Chad Wazowski',
		url: 'http://blog.wazowski.com/hack_nasa.html',
		likes: 69,
	};

	test('actually creates a blog in the database', async () => {
		await api
			.post('/api/blogs/')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const count = await Blog.countDocuments();
		assert.strictEqual(count, 1);

		const blog = await Blog.findOne({}, { _id: 0, __v: 0, user: 0 }).lean();
		assert.deepStrictEqual(blog, newBlog);
	});

	test('missing \'likes\' property in request body defaults to 0', async () => {
		const { likes, ...newBlogWithoutLikes } = newBlog;
		await api
			.post('/api/blogs/')
			.send(newBlogWithoutLikes)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blog = await Blog.findOne({ title: newBlog.title }).lean();
		assert.deepStrictEqual(blog.likes, 0);
	});

	test('missing \'title\' property returns bad request', async () => {
		const { title, ...newBlogWithoutTitle } = newBlog;

		await api
			.post('/api/blogs/')
			.send(newBlogWithoutTitle)
			.expect(400)
			.expect('Content-Type', /application\/json/);
	});

	test('missing \'url\' property returns bad request', async () => {
		const { url, ...newBlogWithoutUrl } = newBlog;

		await api
			.post('/api/blogs/')
			.send(newBlogWithoutUrl)
			.expect(400)
			.expect('Content-Type', /application\/json/);
	});

	test('\'user\' property is added on created blog', async () => {
		const response = await api
			.post('/api/blogs/')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		assert.notStrictEqual(response.body.user, undefined);
	});
});

describe('DELETE /api/blogs/:id', async () => {
	const blogIdToDelete = helper.initialBlogs[0]._id;

	test('deletes the blog with given id from the database', async () => {
		await api
			.delete(`/api/blogs/${blogIdToDelete}`)
			.expect(204);

		const blog = await Blog.findById(blogIdToDelete);
		assert.strictEqual(blog, null);
	});

	test('returns 404 if a blog with the given id is not found', async () => {
		await Blog.findByIdAndDelete(blogIdToDelete);

		await api
			.delete(`/api/blogs/${blogIdToDelete}`)
			.expect(404);
	});
});

describe('PUT /api/blogs/:id', async () => {
	const blogIdToUpdate = helper.initialBlogs[2]._id;

	test('updates the blog with the given id in the database', async () => {
		const update = {
			...helper.initialBlogs[2],
			likes: 420
		};

		await api
			.put(`/api/blogs/${blogIdToUpdate}`)
			.send(update)
			.expect(200);

		const updatedBlog = await Blog.findById(blogIdToUpdate);

		assert.strictEqual(updatedBlog.likes, update.likes);
	});

	test('returns 404 if a blog with the given id is not found', async () => {
		await Blog.findByIdAndDelete(blogIdToUpdate);

		const update = {
			...helper.initialBlogs[2],
			likes: 420
		};

		await api
			.put(`/api/blogs/${blogIdToUpdate}`)
			.send(update)
			.expect(404);
	});
});

after(async () => {
	await mongoose.connection.close();
});
