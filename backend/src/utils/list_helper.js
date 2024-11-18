const _ = require('lodash');

const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
	if (blogs.length < 1) {
		return undefined;
	}
	return blogs.reduce((fav, blog) => blog.likes > fav.likes ? blog : fav);
};

const mostBlogs = (blogs) => {
	if (blogs.length < 1) {
		return undefined;
	}
	let authors = _.countBy(blogs, 'author');

	let mostBlogs = {
		author: '',
		blogs: 0
	};

	for (const [author, blogs] of Object.entries(authors)) {
		if (blogs > mostBlogs.blogs) {
			mostBlogs.author = author;
			mostBlogs.blogs = blogs;
		}
	}

	return mostBlogs;
};

const mostLikes = (blogs) => {
	if (blogs.length < 1) {
		return undefined;
	}

	const likesReducer = (acc, curr) => acc + curr.likes;
	const authors = _.groupBy(blogs, 'author');

	for (const [key, value] of Object.entries(authors)) {
		authors[key] = value.reduce(likesReducer, 0);
	}

	let mostLikes = {
		author: '',
		likes: 0
	};

	for (const [author, likes] of Object.entries(authors)) {
		if (likes > mostLikes.likes) {
			mostLikes.author = author;
			mostLikes.likes = likes;
		}
	}

	return mostLikes;
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
};
