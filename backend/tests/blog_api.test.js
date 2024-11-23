const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/app");
const Blog = require("../src/models/blog");
const User = require("../src/models/user");
const helper = require("./helper");

const api = supertest(app);

let user = {
	username: "john",
	name: "john cena",
	password: "password",
};
const altUser = { ...user, username: "altJohn" };

const newBlog = {
	title: "How to hack NASA using HTML",
	author: "Chad Wazowski",
	url: "http://blog.wazowski.com/hack_nasa.html",
	likes: 69,
};

let token = "";
let altToken = "";

beforeEach(async () => {
	await User.findOneAndDelete({ username: user.username });
	await api.post("/api/users").send(user);

	let loginResponse = await api.post("/api/login").send({
		username: user.username,
		password: user.password,
	});
	token = loginResponse.body.token;

	await User.findOneAndDelete({ username: altUser.username });
	await api.post("/api/users").send(altUser);
	loginResponse = await api.post("/api/login").send({
		username: altUser.username,
		password: altUser.password,
	});
	altToken = loginResponse.body.token;
});

describe("GET /api/blogs/", async () => {
	describe("when db is empty", async () => {
		beforeEach(async () => {
			await Blog.deleteMany({});
		});

		test("when db is empty, returns an empty list", async () => {
			const response = await api.get("/api/blogs/");

			assert.strictEqual(response.body.length, 0);
		});
	});

	describe("when db has mublitple blogs", async () => {
		beforeEach(helper.initializeUsersDb);
		beforeEach(helper.initializeBlogsDb);

		test("returns blogs in json format", async () => {
			await api
				.get("/api/blogs/")
				.expect(200)
				.expect("Content-Type", /application\/json/);
		});

		test("when db has multiple blogs, returns a list of the blogs", async () => {
			const response = await api.get("/api/blogs/");

			assert.strictEqual(response.body.length, helper.initialBlogs.length);
		});

		test("returned blogs have 'id' property and not '_id'", async () => {
			const response = await api.get("/api/blogs/");

			response.body.forEach((x) => {
				assert.strictEqual(typeof x.id, "string");
				assert.strictEqual(typeof x._id, "undefined");
			});
		});

		test("returns user information with the blogs", async () => {
			const response = await api.get("/api/blogs/");

			response.body.forEach((b) => {
				assert.strictEqual(typeof b.user, "object");
				assert.strictEqual(typeof b.user.username, "string");
				assert.strictEqual(typeof b.user.name, "string");
				assert.strictEqual(typeof b.user.id, "string");
				assert.strictEqual(typeof b.user.blogs, "undefined");
			});
		});
	});
});

describe("POST /api/blogs/", async () => {
	beforeEach(async () => {
		await Blog.deleteMany({});
	});

	test("returns 401 if no token is provided", async () => {
		await api.post("/api/blogs/").send(newBlog).expect(401);
	});

	test("actually creates a blog in the database", async () => {
		await api
			.post("/api/blogs/")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const count = await Blog.countDocuments();
		assert.strictEqual(count, 1);

		const blog = await Blog.findOne(
			{},
			{ _id: 0, __v: 0, user: 0, comments: 0 },
		).lean();
		assert.deepStrictEqual(blog, newBlog);
	});

	test("missing 'likes' property in request body defaults to 0", async () => {
		const { likes, ...newBlogWithoutLikes } = newBlog;
		await api
			.post("/api/blogs/")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlogWithoutLikes)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blog = await Blog.findOne({ title: newBlog.title }).lean();
		assert.deepStrictEqual(blog.likes, 0);
	});

	test("missing 'title' property returns bad request", async () => {
		const { title, ...newBlogWithoutTitle } = newBlog;

		await api
			.post("/api/blogs/")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlogWithoutTitle)
			.expect(400)
			.expect("Content-Type", /application\/json/);
	});

	test("missing 'url' property returns bad request", async () => {
		const { url, ...newBlogWithoutUrl } = newBlog;

		await api
			.post("/api/blogs/")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlogWithoutUrl)
			.expect(400)
			.expect("Content-Type", /application\/json/);
	});

	test("the correct 'user' property is added to created blog", async () => {
		const userInDb = await User.findOne({ username: user.username });

		const response = await api
			.post("/api/blogs/")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		assert.notStrictEqual(response.body.user, undefined);
		assert.strictEqual(response.body.user.id, userInDb._id.toString());
		assert.strictEqual(response.body.user.username, userInDb.username);
		assert.strictEqual(response.body.user.name, userInDb.name);
	});
});

describe("DELETE /api/blogs/:id", async () => {
	let blogIdToDelete = "";
	beforeEach(async () => {
		await Blog.deleteMany({});
		const response = await api
			.post("/api/blogs/")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog);
		blogIdToDelete = response.body.id;
	});

	test("blog can only be deleted by an authorized user", async () => {
		await api.delete(`/api/blogs/${blogIdToDelete}`).expect(401);
	});

	test("blog can only be deleted by the user who added it", async () => {
		await api
			.delete(`/api/blogs/${blogIdToDelete}`)
			.set("Authorization", `Bearer ${altToken}`)
			.expect(403);
	});

	test("deletes the blog with given id from the database, and removes its id from the user's blogs", async () => {
		await api
			.delete(`/api/blogs/${blogIdToDelete}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(204);

		const blog = await Blog.findById(blogIdToDelete);
		assert.strictEqual(blog, null);

		const userInDb = await User.findOne({ username: user.username });
		assert.strictEqual(userInDb.blogs.includes(blogIdToDelete), false);
	});

	test("returns 404 if a blog with the given id is not found", async () => {
		await api
			.delete(`/api/blogs/${helper.nonExistingId()}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(404);
	});
});

describe("PUT /api/blogs/:id", async () => {
	let blogIdToUpdate = helper.initialBlogs[2]._id;
	beforeEach(async () => {
		await Blog.deleteMany({});
		const response = await api
			.post("/api/blogs/")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog);
		blogIdToUpdate = response.body.id;
	});

	const update = {
		...newBlog,
		likes: 420,
	};

	test("blog can only be updated by an authorized user", async () => {
		await api.put(`/api/blogs/${blogIdToUpdate}`).send(update).expect(401);
	});

	// test("blog can only be updated by its creator", async () => {
	// 	await api
	// 		.put(`/api/blogs/${blogIdToUpdate}`)
	// 		.send(update)
	// 		.set("Authorization", `Bearer ${altToken}`)
	// 		.expect(403);
	// });

	test("updates the blog with the given id in the database", async () => {
		await api
			.put(`/api/blogs/${blogIdToUpdate}`)
			.set("Authorization", `Bearer ${token}`)
			.send(update)
			.expect(204);

		const updatedBlog = await Blog.findById(blogIdToUpdate);

		assert.strictEqual(updatedBlog.likes, update.likes);
	});

	test("updates are validated before applying", async () => {
		const invalidUpdate = {
			...update,
			title: "u",
			url: "aa",
		};

		await api
			.put(`/api/blogs/${blogIdToUpdate}`)
			.set("Authorization", `Bearer ${token}`)
			.send(invalidUpdate)
			.expect(400);

		const blogInDb = await Blog.findById(blogIdToUpdate);
		assert(blogInDb.title !== invalidUpdate.title);
		assert(blogInDb.url !== invalidUpdate.url);
	});

	test("returns 404 if a blog with the given id is not found", async () => {
		await api
			.put(`/api/blogs/${helper.nonExistingId()}`)
			.set("Authorization", `Bearer ${token}`)
			.send(update)
			.expect(404);
	});
});

const newComment = "nice article";

const existingComments = [
	"awesome article",
	"a must read for every developer",
	"really insightful",
];

describe("POST /api/blogs/:id/comments", async () => {
	let blogId = "";
	beforeEach(async () => {
		await Blog.deleteMany({});
		const response = await api
			.post("/api/blogs/")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog);
		blogId = response.body.id;
	});

	test("when the blog does not exist, return 404", async () => {
		await api
			.post(`/api/blogs/${helper.nonExistingId()}/comments`)
			.send({ comment: newComment })
			.expect(404);
	});

	describe("when the blog has no previous comments", async () => {
		test("adds the comment to the blog", async () => {
			await api
				.post(`/api/blogs/${blogId}/comments`)
				.send({ comment: newComment })
				.expect(200);

			const blogInDb = await Blog.findById(blogId);
			const blogComments = blogInDb.toJSON().comments.map((c) => c.content);
			assert.deepStrictEqual(blogComments, [newComment]);
		});
	});

	describe("when the blog has some previous comments", async () => {
		beforeEach(async () => {
			const blogInDb = await Blog.findById(blogId);
			const commentObjects = existingComments.map((c) => {
				return { content: c };
			});
			blogInDb.comments.push(...commentObjects);
			await blogInDb.save();
		});

		test("adds the comment to the existing comments", async () => {
			await api
				.post(`/api/blogs/${blogId}/comments`)
				.send({ comment: newComment })
				.expect(200);

			const blogInDb = await Blog.findById(blogId);
			const blogComments = blogInDb.toJSON().comments.map((c) => c.content);
			assert.deepStrictEqual(blogComments, [...existingComments, newComment]);
		});
	});
});

describe("GET /api/blogs/:id/comments", async () => {
	let blogId = "";
	beforeEach(async () => {
		await Blog.deleteMany({});
		const response = await api
			.post("/api/blogs/")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog);
		blogId = response.body.id;
	});

	test("when the blog has no comments, returns an empty string", async () => {
		const response = await api.get(`/api/blogs/${blogId}/comments`).expect(200);

		assert.deepStrictEqual(response.body, []);
	});

	test("when the blog has existing comments, returns a list of the comments", async () => {
		const blogInDb = await Blog.findById(blogId);
		const commentObjects = existingComments.map((c) => {
			return { content: c };
		});
		blogInDb.comments.push(...commentObjects);
		await blogInDb.save();

		const response = await api.get(`/api/blogs/${blogId}/comments`).expect(200);

		assert.deepStrictEqual(
			response.body.map((c) => c.content),
			existingComments,
		);
	});

	test("when the blog does not exist, return 404", async () => {
		await api.get(`/api/blogs/${helper.nonExistingId()}/comments`).expect(404);
	});
});

after(async () => {
	await mongoose.connection.close();
});
