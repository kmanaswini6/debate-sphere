import request from 'supertest';
import { app } from '../src/server';

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

describe('Auth Routes', () => {
  it('should return 400 without firebase token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({});
    expect(response.status).toBe(400);
  });

  it('should return 401 with invalid token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ firebaseToken: 'invalid-token' });
    expect(response.status).toBe(401);
  });
});

describe('Debate Routes', () => {
  it('should return 401 without auth token', async () => {
    const response = await request(app)
      .post('/api/debate')
      .send({ topic: 'Test topic', mode: 'user-vs-ai' });
    expect(response.status).toBe(401);
  });
});

describe('Vote Routes', () => {
  it('should return 401 without auth token', async () => {
    const response = await request(app)
      .post('/api/vote')
      .send({ debateId: '507f1f77bcf86cd799439011', selectedSide: 'pro' });
    expect(response.status).toBe(401);
  });

  it('should return vote counts for invalid debate', async () => {
    const response = await request(app)
      .get('/api/vote/507f1f77bcf86cd799439011');
    expect(response.status).toBe(200);
  });
});
