const mongoose = require('mongoose');

// Prefer env var; fall back to a local default suitable for dev.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/forum';

// Minimal connect helper with a small retry to handle race during tests
async function connectDB(retries = 3, delayMs = 500) {
	let lastErr;
	for (let i = 0; i < retries; i++) {
		try {
			return await mongoose.connect(MONGO_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
		} catch (err) {
			lastErr = err;
			if (i < retries - 1) {
				await new Promise(r => setTimeout(r, delayMs));
			}
		}
	}
	throw lastErr;
}

module.exports = { MONGO_URI, connectDB, mongoose };
