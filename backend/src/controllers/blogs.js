const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { authorizer } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", { blogs: 0 });
	response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
	const blog = await Blog.findById(request.params.id);
	response.json(blog);
});

blogsRouter.post("/", authorizer, async (request, response) => {
	const user = await User.findById(request.user.id);
	const blog = new Blog({ user: user._id, ...request.body });

	const result = await blog.save();

	user.blogs.push(result._id);
	await user.save();

	await result.populate("user", { blogs: 0 });

	response.status(201).json(result);
});

blogsRouter.delete("/:id", authorizer, async (request, response) => {
	const blog = await Blog.findById(request.params.id);

	if (!blog) {
		return response.status(404).end();
	} else if (blog.user.toString() !== request.user.id) {
		return response
			.status(403)
			.json({ error: "blog can only be deleted by its creator!" });
	}

	await blog.deleteOne();

	const user = await User.findById(blog.user);
	user.blogs.pop(blog._id);

	await user.save();

	response.status(204).end();
});

blogsRouter.put("/:id", authorizer, async (request, response) => {
	const body = request.body;

	const blogUpdate = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
	};

	const blog = await Blog.findById(request.params.id);
	if (!blog) {
		return response.status(404).end();
	}
	// else if (blog.user.toString() !== request.user.id) {
	// 	return response.status(403).json({ error: 'blog can only be updated by its creator!' });
	// }

	await blog.updateOne(blogUpdate, {
		new: true,
		runValidators: true,
	});

	response.status(204).end();
});

blogsRouter.get("/:id/comments", async (request, response) => {
	const blog = await Blog.findById(request.params.id);

	if (!blog) {
		return response.status(404).end();
	}

	response.status(200).json(blog.comments);
});

blogsRouter.post("/:id/comments", async (request, response) => {
	const body = request.body;

	const blog = await Blog.findById(request.params.id);

	if (!blog) {
		return response.status(404).end();
	}

	blog.comments.push({ content: body.comment });
	await blog.save();

	response.status(200).json(blog);
});

module.exports = blogsRouter;
