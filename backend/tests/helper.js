const mongoose = require("mongoose");
const Blog = require("../src/models/blog");
const User = require("../src/models/user");

const initialBlogs = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0,
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		__v: 0,
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		__v: 0,
	},
	{
		_id: "5a422b891b54a676234d17fa",
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
		__v: 0,
	},
	{
		_id: "5a422ba71b54a676234d17fb",
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		likes: 0,
		__v: 0,
	},
	{
		_id: "5a422bc61b54a676234d17fc",
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 2,
		__v: 0,
	},
];

const initialUsers = [
	{
		_id: "673473da506969edcf54460b",
		username: "root",
		name: "admin",
		passwordHash:
			"$2b$10$EVp2p6boigvRMLu3rMVvSuInj4.tbBK.pfkLg.kXJ1/BD7.FUGoX2",
		__v: 0,
	},
	{
		_id: "673473da506969edcf54460d",
		username: "johndoe",
		name: "John Doe",
		passwordHash:
			"$2b$10$ui6sseNX/VGWYPqHP54bbO9sXxJaJGBfp7/6WN2CI6kyuic4t1VH.",
		__v: 0,
	},
];

const nonExistingId = () => {
	return new mongoose.Types.ObjectId().toString();
};

const initializeUsersDb = async () => {
	await User.deleteMany({});

	await Promise.all(
		initialUsers.map(async (user) => {
			return new User(user).save();
		}),
	);
};

const initializeBlogsDb = async () => {
	await Blog.deleteMany({});

	const promiseArray = initialBlogs.map((blog) => {
		const randomIndex = Math.floor(Math.random() * initialUsers.length);
		const userId = initialUsers[randomIndex]._id;
		const newBlog = new Blog({ ...blog, user: userId });
		return newBlog
			.save()
			.then(() => User.findById(userId))
			.then((user) => {
				user.blogs.push(newBlog._id);
				return user.save();
			});
	});

	await Promise.all(promiseArray);
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((user) => user.toJSON());
};

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((note) => note.toJSON());
};

module.exports = {
	initialBlogs,
	nonExistingId,
	blogsInDb,
	initialUsers,
	usersInDb,
	initializeUsersDb,
	initializeBlogsDb,
};
