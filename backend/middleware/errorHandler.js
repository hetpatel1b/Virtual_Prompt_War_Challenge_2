/**
 * Global Error Handler Middleware
 *
 * Catches all unhandled errors and returns consistent JSON responses.
 * Classifies errors by type and maps to HTTP status codes.
 * Logs full error details via Winston (never exposes internals to client).
 */

const logger = require('../config/logger');
const config = require('../config');

/**
 * Custom application error class.
 * Use this in controllers/services for predictable error handling.
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code
   * @param {string} code - Machine-readable error code
   * @param {object} [details] - Additional error details
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Map known error types to HTTP status codes and error codes.
 */
function classifyError(err) {
  // Already classified (AppError)
  if (err.isOperational) {
    return {
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
      details: err.details,
    };
  }

  // Firebase Auth errors
  if (err.code && err.code.startsWith('auth/')) {
    return {
      statusCode: 401,
      code: 'AUTH_ERROR',
      message: 'Authentication error. Please sign in again.',
      details: null,
    };
  }

  // Firebase Firestore errors
  if (err.code && (err.code.startsWith('firestore/') || err.code === 'permission-denied')) {
    return {
      statusCode: 403,
      code: 'DATABASE_ERROR',
      message: 'Database operation failed.',
      details: null,
    };
  }

  // Google Generative AI errors
  if (err.message && err.message.includes('GoogleGenerativeAI')) {
    return {
      statusCode: 503,
      code: 'AI_SERVICE_ERROR',
      message: 'The AI service is temporarily unavailable. Please try again.',
      details: null,
    };
  }

  // JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return {
      statusCode: 400,
      code: 'INVALID_JSON',
      message: 'Invalid JSON in request body.',
      details: null,
    };
  }

  // Payload too large
  if (err.type === 'entity.too.large') {
    return {
      statusCode: 413,
      code: 'PAYLOAD_TOO_LARGE',
      message: 'Request body is too large.',
      details: null,
    };
  }

  // Default: Internal Server Error
  return {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred. Please try again later.',
    details: null,
  };
}

/**
 * Express error-handling middleware (4 arguments).
 */
function errorHandler(err, req, res, _next) {
  const classified = classifyError(err);

  // Log the full error
  const reqLogger = req.id ? logger.withRequestId(req.id) : logger;

  if (classified.statusCode >= 500) {
    reqLogger.error('Unhandled server error', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      statusCode: classified.statusCode,
    });
  } else {
    reqLogger.warn('Client error', {
      error: err.message,
      code: classified.code,
      path: req.path,
      method: req.method,
      statusCode: classified.statusCode,
    });
  }

  // Send response (never expose stack traces in production)
  const response = {
    success: false,
    error: {
      code: classified.code,
      message: classified.message,
    },
  };

  if (classified.details) {
    response.error.details = classified.details;
  }

  // Include stack trace in development for debugging
  if (!config.isProduction && err.stack) {
    response.error.stack = err.stack;
  }

  res.status(classified.statusCode).json(response);
}

/**
 * 404 Not Found handler — place after all route definitions.
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found.`,
    },
  });
}

module.exports = { errorHandler, notFoundHandler, AppError };
