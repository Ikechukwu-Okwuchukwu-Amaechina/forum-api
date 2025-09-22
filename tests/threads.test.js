const request = require('supertest');
const mongoose = require('mongoose');
let app;

jest.setTimeout(30000);

describe('Threads and comments', () => {
  let token, userId;
  beforeAll(async () => {
    // MONGO_URI is set by globalSetup
    app = require('../index');
    await request(app).post('/auth/signup').send({ name: 'u', email: 'u@u.com', password: 'p' });
    const login = await request(app).post('/auth/login').send({ email: 'u@u.com', password: 'p' });
    token = login.body.token;
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('create thread, add comment, reply and view nested', async () => {
    const t = await request(app).post('/threads').set('Authorization', `Bearer ${token}`).send({ title: 't', body: 'b' });
    expect(t.status).toBe(201);
    const threadId = t.body._id;
    const c = await request(app).post(`/threads/${threadId}/comments`).set('Authorization', `Bearer ${token}`).send({ body: 'first' });
    expect(c.status).toBe(201);
    const reply = await request(app).post(`/threads/comments/${c.body._id}/reply`).set('Authorization', `Bearer ${token}`).send({ body: 'reply' });
    expect(reply.status).toBe(201);
    const view = await request(app).get(`/threads/${threadId}`);
    expect(view.status).toBe(200);
    expect(view.body.comments.length).toBeGreaterThan(0);
    expect(view.body.comments[0].replies.length).toBeGreaterThan(0);
  });
});
