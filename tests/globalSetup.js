const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  // Start a single in-memory MongoDB instance for the entire test run
  const mongod = await MongoMemoryServer.create({
    binary: {
      // Speeds up startup if cached; keeps defaults otherwise
    },
    instance: {
      dbName: 'jest',
      // Allow more time for Windows/CI environments
      spawnTimeout: 20000,
    },
  });
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  // Expose the instance across tests via global, and store reference on process for teardown
  global.__MONGOD__ = mongod;
};
