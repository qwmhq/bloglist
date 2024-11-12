const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body);
	const result = await blog.save();
	response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
	const blog = await Blog.findByIdAndDelete(request.params.id);

	blog
		? response.status(204).end()
		: response.status(404).end();
});

blogsRouter.put('/:id', async (request, response) => {
	const body = request.body;
	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	};

	const updatedBlog = await Blog.findByIdAndUpdate(
		request.params.id,
		blog,
		{
			new: true,
			runValidators: true
		}
	);

	updatedBlog
		? response.json(updatedBlog)
		: response.status(404).end();
});

module.exports = blogsRouter;
