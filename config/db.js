const mongoose = require('mongoose');

// Simple connection string: prefer env var, fall back to localhost for development.
const MONGO_URI = process.env.MONGO_URI 

// Minimal connect helper — returns the mongoose.connect() promise.
function connectDB() {
	return mongoose.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}

module.exports = { MONGO_URI, connectDB, mongoose };
