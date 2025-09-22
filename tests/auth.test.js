const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let app;

describe('Auth', () => {
  let mongod;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri();
    app = require('../index');
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  test('signup and login', async () => {
    const res = await request(app).post('/auth/signup').send({ name: 'a', email: 'a@a.com', password: 'pass' });
    expect(res.status).toBe(201);
    const login = await request(app).post('/auth/login').send({ email: 'a@a.com', password: 'pass' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });
});
