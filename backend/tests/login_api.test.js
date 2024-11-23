const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../src/models/user");
const helper = require("./helper");

const api = supertest(app);

beforeEach(async () => {
	await User.deleteMany({});
	const newUser = {
		username: "sherlock",
		name: "sherlock holmes",
		passwordHash: await bcrypt.hash("sleuth001", 10),
	};
	await new User(newUser).save();
});

after(async () => {
	await mongoose.connection.close();
});

describe("POST /api/login", async () => {
	test("returns Bad request if username is not given", async () => {
		const credentials = {
			password: "sleuth001",
		};

		await api
			.post("/api/login")
			.send(credentials)
			.expect(400)
			.expect("Content-Type", /application\/json/);
	});

	test("returns Bad request if password is not given", async () => {
		const credentials = {
			username: "sherlock",
		};

		await api
			.post("/api/login")
			.send(credentials)
			.expect(400)
			.expect("Content-Type", /application\/json/);
	});

	test("returns unauthorised when invalid credentials are supplied", async () => {
		const credentials = {
			username: "sherlock",
			password: "wrong-password",
		};

		await api
			.post("/api/login")
			.send(credentials)
			.expect(401)
			.expect("Content-Type", /application\/json/);
	});

	test("returns valid jwt when valid credentials are supplied", async () => {
		const credentials = {
			username: "sherlock",
			password: "sleuth001",
		};

		const response = await api
			.post("/api/login")
			.send(credentials)
			.expect(200)
			.expect("Content-Type", /application\/json/);

		const token = response.body.token;
		assert.strictEqual(typeof token, "string");

		const decodedToken = jwt.decode(token);
		assert.notStrictEqual(decodedToken, null);
		assert.strictEqual(typeof decodedToken.username, "string");
		assert.strictEqual(typeof decodedToken.id, "string");
	});
});
