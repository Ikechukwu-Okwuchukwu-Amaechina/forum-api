module.exports = async () => {
  if (global.__MONGOD__) {
    try {
      await global.__MONGOD__.stop();
    } catch (e) {
      // ignore
    }
  }
};
