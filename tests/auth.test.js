const request = require('supertest');
const mongoose = require('mongoose');
let app;

describe('Auth', () => {
  beforeAll(async () => {
    // MONGO_URI is set by globalSetup before tests run
    app = require('../index');
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('signup and login', async () => {
    const res = await request(app).post('/auth/signup').send({ name: 'a', email: 'a@a.com', password: 'pass' });
    expect(res.status).toBe(201);
    const login = await request(app).post('/auth/login').send({ email: 'a@a.com', password: 'pass' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });
});
