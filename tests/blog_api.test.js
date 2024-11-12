const { test, describe, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../src/app');
const Blog = require('../src/models/blog');

const api = supertest(app);

const initialBlogs = [
	{
		_id: '5a422a851b54a676234d17f7',
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
		__v: 0
	},
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		__v: 0
	},
	{
		_id: '5a422b3a1b54a676234d17f9',
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
		__v: 0
	},
	{
		_id: '5a422b891b54a676234d17fa',
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
		__v: 0
	},
	{
		_id: '5a422ba71b54a676234d17fb',
		title: 'TDD harms architecture',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		likes: 0,
		__v: 0
	},
	{
		_id: '5a422bc61b54a676234d17fc',
		title: 'Type wars',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		likes: 2,
		__v: 0
	}
];

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
		beforeEach(async () => {
			await Blog.deleteMany({});

			const promiseArray = initialBlogs.map((blog) => {
				return new Blog(blog).save();
			});

			await Promise.all(promiseArray);
		});

		test('returns blogs in json format', async () => {
			await api
				.get('/api/blogs/')
				.expect(200)
				.expect('Content-Type', /application\/json/);
		});

		test('when db has multiple blogs, returns a list of the blogs', async () => {
			const response = await api.get('/api/blogs/');

			assert.strictEqual(response.body.length, initialBlogs.length);
		});

		test('returned blogs have \'id\' property and not \'_id\'', async () => {
			const response = await api.get('/api/blogs/');

			response.body.forEach(x => {
				assert.strictEqual(typeof x.id, 'string');
				assert.strictEqual(typeof x._id, 'undefined');
			});
		});
	});
});

describe('POST /api/blogs', async () => {
	beforeEach(async () => {
		await Blog.deleteMany({});
	});

	test('actually creates a blog in the database', async () => {
		const newBlog = {
			title: 'How to hack NASA using HTML',
			author: 'Chad Wazowski',
			url: 'http://blog.wazowski.com/hack_nasa.html',
			likes: 69,
		};

		await api
			.post('/api/blogs/')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const count = await Blog.countDocuments();
		assert.strictEqual(count, 1);

		const blog = await Blog.findOne({ title: newBlog.title }, { _id: 0, __v: 0 }).lean();
		assert.deepStrictEqual(newBlog, blog);
	});

	test('missing \'likes\' property in request body defaults to 0', async () => {
		const newBlog = {
			title: 'How to hack NASA using HTML',
			author: 'Chad Wazowski',
			url: 'http://blog.wazowski.com/hack_nasa.html',
		};

		await api
			.post('/api/blogs/')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blog = await Blog.findOne({ title: newBlog.title }).lean();
		assert.deepStrictEqual(blog.likes, 0);
	});

	test('missing \'title\' property returns bad request', async () => {
		const newBlog = {
			author: 'Chad Wazowski',
			url: 'http://blog.wazowski.com/hack_nasa.html',
			likes: 69,
		};

		await api
			.post('/api/blogs/')
			.send(newBlog)
			.expect(400)
			.expect('Content-Type', /application\/json/);
	});

	test('missing \'url\' property returns bad request', async () => {
		const newBlog = {
			title: 'How to hack NASA using HTML',
			author: 'Chad Wazowski',
			likes: 69,
		};

		await api
			.post('/api/blogs/')
			.send(newBlog)
			.expect(400)
			.expect('Content-Type', /application\/json/);
	});
});

describe('DELETE /api/blogs/:id', async () => {
	beforeEach(async () => {
		await Blog.deleteMany({});

		const promiseArray = initialBlogs.map((blog) => {
			return new Blog(blog).save();
		});

		await Promise.all(promiseArray);
	});

	const blogIdToDelete = initialBlogs[0]._id;

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
	beforeEach(async () => {
		await Blog.deleteMany({});

		const promiseArray = initialBlogs.map((blog) => {
			return new Blog(blog).save();
		});

		await Promise.all(promiseArray);
	});

	const blogIdToUpdate = initialBlogs[2]._id;

	test('updates the blog with the given id in the database', async () => {
		const update = {
			...initialBlogs[2],
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
			...initialBlogs[2],
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
