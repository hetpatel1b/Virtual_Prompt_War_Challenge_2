/**
 * ElectionGuide AI — Express Server
 *
 * Production-grade Express application with:
 *   - Helmet security headers (CSP)
 *   - CORS with origin whitelist
 *   - Morgan HTTP logging via Winston
 *   - Request ID correlation
 *   - Rate limiting
 *   - Structured error handling
 *   - Graceful shutdown
 *
 * App factory pattern: exports the app for testing.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config');
const logger = require('./config/logger');
const requestId = require('./middleware/requestId');
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

// ─── Create Express App ────────────────────────────────

const app = express();

// ─── Security Middleware ────────────────────────────────

// Helmet — secure HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://generativelanguage.googleapis.com'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS — restrict to frontend origin
app.use(
  cors({
    origin: config.isProduction
      ? [
          config.frontendUrl,
          config.frontendUrl.replace('.web.app', '.firebaseapp.com'),
        ]
      : [config.frontendUrl, 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    credentials: true,
    maxAge: 86400, // 24 hours preflight cache
  })
);

// ─── General Middleware ─────────────────────────────────

// Request ID for tracing
app.use(requestId);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// HTTP request logging via Winston
if (!config.isTest) {
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: logger.stream,
    })
  );
}

// General rate limiter
app.use(generalLimiter);

// Trust proxy (for Cloud Run / reverse proxies)
app.set('trust proxy', 1);

// ─── Routes ─────────────────────────────────────────────

app.use('/api', routes);

// ─── Error Handling ─────────────────────────────────────

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ─── Server Start ───────────────────────────────────────

// Only start listening if this file is run directly (not imported for testing)
if (require.main === module) {
  const server = app.listen(config.port, () => {
    logger.info('ElectionGuide AI Backend started', {
      port: config.port,
      environment: config.env,
      demoMode: config.isDemoMode,
      frontendUrl: config.frontendUrl,
    });

    if (config.isDemoMode) {
      logger.warn(
        'Running in DEMO MODE — AI responses use pre-built data. Set GOOGLE_GEMINI_API_KEY for live AI.'
      );
    }
  });

  // ─── Graceful Shutdown ──────────────────────────────────

  function gracefulShutdown(signal) {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after 10s timeout');
      process.exit(1);
    }, 10000);
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection', {
      reason: reason?.message || reason,
      stack: reason?.stack,
    });
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
    process.exit(1);
  });
}

// Export app for testing
module.exports = app;
