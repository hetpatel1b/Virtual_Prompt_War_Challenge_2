/**
 * ElectionGuide AI — Express Server (Cloud Run Safe)
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

const app = express();

// ─── SECURITY ───────────────────────────────────────────

// Helmet
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

// ─── SAFE CORS (NO CRASH) ───────────────────────────────

const allowedOrigins = [
  config.frontendUrl,
  config.frontendUrl?.replace('.web.app', '.firebaseapp.com'),
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    credentials: true,
    maxAge: 86400,
  })
);

// ─── GENERAL MIDDLEWARE ─────────────────────────────────

app.set('trust proxy', 1);

app.use(requestId);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

if (!config.isTest) {
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: logger.stream,
    })
  );
}

app.use(generalLimiter);

// ─── HEALTH CHECK (VERY IMPORTANT) ──────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'electionguide-api',
    timestamp: new Date().toISOString(),
  });
});

// ─── ROUTES ─────────────────────────────────────────────

app.use('/api', routes);

// ─── ERROR HANDLING ─────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

// ─── SERVER START (CLOUD RUN SAFE) ──────────────────────

if (require.main === module) {
  const PORT = process.env.PORT || config.port || 8080;

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

    logger.info('ElectionGuide Backend started', {
      port: PORT,
      env: config.env,
      frontend: config.frontendUrl,
      gemini: process.env.GEMINI_MODEL,
    });
  });

  // ─── GRACEFUL SHUTDOWN ───────────────────────────────

  const shutdown = (signal) => {
    logger.info(`${signal} received — shutting down`);
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Force shutdown');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection', {
      message: err?.message,
      stack: err?.stack,
    });
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });
}

// Export for testing
module.exports = app;