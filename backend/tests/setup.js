/**
 * Test Setup
 *
 * Sets up environment variables and mocks for testing.
 * Runs before all test suites.
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.DEMO_MODE = 'true';
process.env.GOOGLE_GEMINI_API_KEY = '';
process.env.FIREBASE_PROJECT_ID = '';
process.env.CACHE_TTL_SECONDS = '60';
process.env.CACHE_MAX_KEYS = '100';
process.env.RATE_LIMIT_WINDOW_MS = '60000';
process.env.RATE_LIMIT_MAX_GENERAL = '1000';
process.env.RATE_LIMIT_MAX_AI = '100';

// Suppress Winston console output during tests
jest.mock('../config/logger', () => {
  const noop = () => {};
  const noopLogger = {
    info: noop,
    warn: noop,
    error: noop,
    debug: noop,
    http: noop,
    withRequestId: () => noopLogger,
    child: () => noopLogger,
    stream: { write: noop },
  };
  return noopLogger;
});
