/**
 * Rate Limiting Middleware
 *
 * Three-tier rate limiting:
 *   - generalLimiter:  100 req/min — all routes
 *   - aiLimiter:        20 req/min — AI endpoints (Gemini calls)
 *   - authLimiter:      10 req/15min — authentication endpoints
 */

const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * Standard JSON response for rate limit exceeded.
 */
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime - Date.now()) / 1000,
    },
  });
};

/**
 * General rate limiter — applied to all routes.
 * 100 requests per minute per IP.
 */
const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxGeneral,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: () => config.isTest,
  keyGenerator: (req) => req.ip,
});

/**
 * AI endpoint rate limiter — stricter for Gemini API calls.
 * 20 requests per minute per IP.
 */
const aiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxAI,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: () => config.isTest,
  keyGenerator: (req) => req.ip,
  message: 'AI request limit exceeded. Please wait before sending more questions.',
});

/**
 * Auth endpoint rate limiter — prevents brute-force.
 * 10 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: () => config.isTest,
  keyGenerator: (req) => req.ip,
});

module.exports = { generalLimiter, aiLimiter, authLimiter };
