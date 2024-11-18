const logger = require('./logger');
const jwt = require('jsonwebtoken');
const config = require('./config');

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
	logger.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	} else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
		return response.status(400).json({ error: 'expected `username` to be unique' });
	}

	next(error);
};

const authenticator = (request, response, next) => {
	const authorization = request.get('authorization');
	if (authorization) {
		request.token = authorization.replace('Bearer ', '');
		try {
			const payload = jwt.verify(request.token, config.JWT_SECRET);
			request.user = { id: payload.id, username: payload.username };
		} catch {
			request.user = null;
		}
	}
	next();
};

const authorizer = (request, response, next) => {
	if (!request.user) {
		response.status(401).end();
	}
	next();
};

module.exports = {
	unknownEndpoint,
	errorHandler,
	authenticator,
	authorizer
};