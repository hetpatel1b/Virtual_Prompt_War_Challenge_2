/**
 * Quiz API Integration Tests
 */

require('../setup');

const request = require('supertest');
const app = require('../../server');

describe('GET /api/quiz/questions', () => {
  it('should return quiz questions', async () => {
    const res = await request(app).get('/api/quiz/questions');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('questions');
    expect(res.body.data.questions).toBeInstanceOf(Array);
    expect(res.body.data.questions.length).toBeGreaterThan(0);
  });

  it('should NOT include correct answers in response', async () => {
    const res = await request(app).get('/api/quiz/questions');

    res.body.data.questions.forEach((q) => {
      expect(q).not.toHaveProperty('correctIndex');
      expect(q).not.toHaveProperty('explanation');
      expect(q).not.toHaveProperty('source');
    });
  });

  it('should include question ID, text, options, category, and difficulty', async () => {
    const res = await request(app).get('/api/quiz/questions');

    res.body.data.questions.forEach((q) => {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('category');
      expect(q).toHaveProperty('difficulty');
      expect(q.options).toHaveLength(4);
    });
  });

  it('should respect count query parameter', async () => {
    const res = await request(app).get('/api/quiz/questions?count=5');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.questions.length).toBeLessThanOrEqual(5);
  });

  it('should filter by difficulty', async () => {
    const res = await request(app).get('/api/quiz/questions?difficulty=easy');

    expect(res.statusCode).toBe(200);
    res.body.data.questions.forEach((q) => {
      expect(q.difficulty).toBe('easy');
    });
  });

  it('should return 422 for invalid difficulty value', async () => {
    const res = await request(app).get('/api/quiz/questions?difficulty=impossible');

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should include available categories', async () => {
    const res = await request(app).get('/api/quiz/questions');

    expect(res.body.data).toHaveProperty('categories');
    expect(res.body.data.categories).toBeInstanceOf(Array);
    expect(res.body.data.categories.length).toBeGreaterThan(0);
  });
});

describe('POST /api/quiz/submit', () => {
  it('should return 401 without authentication', async () => {
    const res = await request(app)
      .post('/api/quiz/submit')
      .send({
        answers: [{ questionId: 'q_001', selectedOption: 1 }],
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error.code).toBe('AUTH_TOKEN_MISSING');
  });

  it('should return 401 for invalid answer format without auth', async () => {
    // Auth middleware runs before validation, so unauthenticated requests get 401
    const res = await request(app)
      .post('/api/quiz/submit')
      .send({ answers: 'not-an-array' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error.code).toBe('AUTH_TOKEN_MISSING');
  });

  it('should return 401 for empty answers array without auth', async () => {
    const res = await request(app)
      .post('/api/quiz/submit')
      .send({ answers: [] });

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for invalid selectedOption without auth', async () => {
    const res = await request(app)
      .post('/api/quiz/submit')
      .send({
        answers: [{ questionId: 'q_001', selectedOption: 5 }],
      });

    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/quiz/leaderboard', () => {
  it('should return leaderboard entries', async () => {
    const res = await request(app).get('/api/quiz/leaderboard');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('entries');
    expect(res.body.data.entries).toBeInstanceOf(Array);
  });

  it('should return entries with rank, score, and percentage', async () => {
    const res = await request(app).get('/api/quiz/leaderboard');

    if (res.body.data.entries.length > 0) {
      const entry = res.body.data.entries[0];
      expect(entry).toHaveProperty('rank');
      expect(entry).toHaveProperty('score');
      expect(entry).toHaveProperty('percentage');
    }
  });
});

describe('GET /api/quiz/history', () => {
  it('should return 401 without authentication', async () => {
    const res = await request(app).get('/api/quiz/history');

    expect(res.statusCode).toBe(401);
  });
});
