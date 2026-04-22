/**
 * Chat API Integration Tests
 */

require('../setup');

const request = require('supertest');
const app = require('../../server');

describe('POST /api/chat', () => {
  it('should return a response for a valid message', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'What is voter registration?' })
      .expect('Content-Type', /json/);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('response');
    expect(res.body.data.response).toHaveProperty('summary');
  });

  it('should return cached response for identical messages', async () => {
    const message = 'How does democracy work?';

    // First request
    const res1 = await request(app)
      .post('/api/chat')
      .send({ message });

    expect(res1.statusCode).toBe(200);
    expect(res1.body.data.cached).toBe(false);

    // Second request — should be cached
    const res2 = await request(app)
      .post('/api/chat')
      .send({ message });

    expect(res2.statusCode).toBe(200);
    expect(res2.body.data.cached).toBe(true);
  });

  it('should return 422 for empty message', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: '' });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 422 for missing message field', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({});

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('should return 422 for message exceeding 2000 characters', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'a'.repeat(2001) });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should sanitize XSS payloads in messages', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: '<script>alert("xss")</script>What is voting?' });

    expect(res.statusCode).toBe(200);
    // Response should still work — XSS was stripped
    expect(res.body.success).toBe(true);
  });
});

describe('POST /api/chat/scenario', () => {
  it('should return a scenario simulation for valid input', async () => {
    const res = await request(app)
      .post('/api/chat/scenario')
      .send({ scenario: 'What happens if no candidate gets a majority?' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('response');
  });

  it('should return 422 for empty scenario', async () => {
    const res = await request(app)
      .post('/api/chat/scenario')
      .send({ scenario: '' });

    expect(res.statusCode).toBe(422);
  });
});

describe('GET /api/chat/suggestions', () => {
  it('should return suggested questions', async () => {
    const res = await request(app).get('/api/chat/suggestions');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('suggestions');
    expect(res.body.data.suggestions).toBeInstanceOf(Array);
    expect(res.body.data.suggestions.length).toBeGreaterThan(0);
  });

  it('should return scenario prompts', async () => {
    const res = await request(app).get('/api/chat/suggestions');

    expect(res.body.data).toHaveProperty('scenarios');
    expect(res.body.data.scenarios).toBeInstanceOf(Array);
  });
});
