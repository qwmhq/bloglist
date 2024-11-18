const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
const config = require('../utils/config');

loginRouter.post('/', async (request, response) => {
	const { username, password } = request.body;
	if (!username || !password) {
		return response.status(400).json({ error: 'username and password are required!' });
	}

	const user = await User.findOne({ username });

	const passwordValid = user === null
		? false
		: await bcrypt.compare(password, user.passwordHash);

	if (!passwordValid) {
		return response.status(401).json({ error: 'invalid credentials!' });
	}

	const tokenPayload = {
		username,
		id: user._id
	};

	const token = jwt.sign(tokenPayload, config.JWT_SECRET);

	response
		.status(200)
		.send({
			username: user.username,
			name: user.name,
			id: user._id,
			token
		});
});

module.exports = loginRouter;
