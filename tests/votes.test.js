const request = require('supertest');
const mongoose = require('mongoose');
let app;

jest.setTimeout(30000);

describe('Voting', () => {
  let token;
  let threadId, commentId;

  beforeAll(async () => {
    // MONGO_URI is set by globalSetup
    app = require('../index');
    await request(app).post('/auth/signup').send({ name: 'v', email: 'v@v.com', password: 'p' });
    const login = await request(app).post('/auth/login').send({ email: 'v@v.com', password: 'p' });
    token = login.body.token;

    const t = await request(app)
      .post('/threads')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'vote t', body: 'b' });
    threadId = t.body._id;

    const c = await request(app)
      .post(`/threads/${threadId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'first' });
    commentId = c.body._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('thread: upvote, double-upvote ignored, switch to downvote, clear', async () => {
    let res = await request(app)
      .post(`/threads/${threadId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ vote: 'up' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ upvotes: 1, downvotes: 0, score: 1 });

    res = await request(app)
      .post(`/threads/${threadId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ vote: 'up' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ upvotes: 1, downvotes: 0, score: 1 });

    res = await request(app)
      .post(`/threads/${threadId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ vote: 'down' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ upvotes: 0, downvotes: 1, score: -1 });

    res = await request(app)
      .post(`/threads/${threadId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ vote: 'clear' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ upvotes: 0, downvotes: 0, score: 0 });
  });

  test('comment: upvote and clear', async () => {
    let res = await request(app)
      .post(`/threads/comments/${commentId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ vote: 'up' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ upvotes: 1, downvotes: 0, score: 1 });

    res = await request(app)
      .post(`/threads/comments/${commentId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ vote: 'clear' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ upvotes: 0, downvotes: 0, score: 0 });
  });
});
