const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { blogs: 0 });
	response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
	const user = await User.findOne({});
	const blog = new Blog({ user: user._id, ...request.body });

	const result = await blog.save();

	user.blogs.push(result._id);
	await user.save();

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
