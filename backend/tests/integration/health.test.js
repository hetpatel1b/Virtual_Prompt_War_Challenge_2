/**
 * Health Endpoint Integration Tests
 */

require('../setup');

const request = require('supertest');
const app = require('../../server');

describe('GET /api/health', () => {
  it('should return 200 with health status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.data.service).toBe('electionguide-api');
  });

  it('should include uptime and version', async () => {
    const res = await request(app).get('/api/health');

    expect(res.body.data).toHaveProperty('uptime');
    expect(res.body.data).toHaveProperty('version');
    expect(res.body.data).toHaveProperty('timestamp');
    expect(typeof res.body.data.uptime).toBe('number');
  });

  it('should include cache statistics', async () => {
    const res = await request(app).get('/api/health');

    expect(res.body.data).toHaveProperty('cache');
    expect(res.body.data.cache).toHaveProperty('hits');
    expect(res.body.data.cache).toHaveProperty('misses');
    expect(res.body.data.cache).toHaveProperty('hitRate');
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
