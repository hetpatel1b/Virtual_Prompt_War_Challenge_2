/**
 * ElectionGuide AI — Backend Configuration
 *
 * Centralized configuration module that loads from environment variables
 * and provides typed, validated config with sensible defaults.
 */

const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 8080,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  gemini: {
    apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '',
  },

  cache: {
    ttl: parseInt(process.env.CACHE_TTL_SECONDS, 10) || 3600,
    maxKeys: parseInt(process.env.CACHE_MAX_KEYS, 10) || 500,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
    maxGeneral: parseInt(process.env.RATE_LIMIT_MAX_GENERAL, 10) || 100,
    maxAI: parseInt(process.env.RATE_LIMIT_MAX_AI, 10) || 20,
  },

  get isDemoMode() {
    return process.env.DEMO_MODE === 'true' || !this.gemini.apiKey;
  },

  get isProduction() {
    return this.env === 'production';
  },

  get isTest() {
    return this.env === 'test';
  },
};

/**
 * Validate critical configuration in production.
 * Throws if required values are missing.
 */
function validateConfig() {
  if (config.isProduction && !config.isDemoMode) {
    const required = [
      ['GOOGLE_GEMINI_API_KEY', config.gemini.apiKey],
    ];

    const missing = required.filter(([, value]) => !value).map(([key]) => key);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables in production: ${missing.join(', ')}`
      );
    }
  }
}

// Validate on load (skip during tests)
if (!config.isTest) {
  validateConfig();
}

module.exports = config;
