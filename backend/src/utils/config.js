require("dotenv").config();

const PORT = process.env.PORT;

let MONGODB_URI;

switch (process.env.NODE_ENV) {
	case "test":
		MONGODB_URI = process.env.TEST_MONGODB_URI;
		break;
	case "development":
		MONGODB_URI = process.env.DEV_MONGODB_URI;
		break;
	default:
		MONGODB_URI = process.env.MONGODB_URI;
}

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
	PORT,
	MONGODB_URI,
	JWT_SECRET,
};
