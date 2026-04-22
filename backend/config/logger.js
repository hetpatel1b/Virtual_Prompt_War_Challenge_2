/**
 * ElectionGuide AI — Winston Logger Configuration
 *
 * Structured logging with:
 * - Console transport (colorized, human-readable in dev)
 * - File transports in production (error.log + combined.log)
 * - Request correlation ID support
 */

const winston = require('winston');
const path = require('path');

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

/**
 * Custom format for console output in development.
 */
const devFormat = printf(({ level, message, timestamp: ts, requestId, ...meta }) => {
  const reqId = requestId ? ` [${requestId}]` : '';
  const metaStr = Object.keys(meta).length && meta.stack === undefined
    ? ` ${JSON.stringify(meta)}`
    : '';
  const stack = meta.stack ? `\n${meta.stack}` : '';
  return `${ts} ${level}${reqId}: ${message}${metaStr}${stack}`;
});

/**
 * Create the Winston logger instance.
 */
function createLogger() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';

  const transports = [];

  // Console transport — always enabled (silent in test)
  transports.push(
    new winston.transports.Console({
      silent: isTest,
      format: isProduction
        ? combine(timestamp(), errors({ stack: true }), json())
        : combine(
            colorize(),
            timestamp({ format: 'HH:mm:ss.SSS' }),
            errors({ stack: true }),
            devFormat
          ),
    })
  );

  // File transports — production only
  if (isProduction) {
    const logDir = path.resolve(__dirname, '..', 'logs');

    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        maxsize: 5 * 1024 * 1024, // 5MB
        maxFiles: 5,
        format: combine(timestamp(), errors({ stack: true }), json()),
      })
    );

    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, 'combined.log'),
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
        format: combine(timestamp(), errors({ stack: true }), json()),
      })
    );
  }

  return winston.createLogger({
    level: isProduction ? 'info' : 'debug',
    defaultMeta: { service: 'electionguide-api' },
    transports,
  });
}

const logger = createLogger();

/**
 * Create a child logger with request correlation ID.
 * @param {string} requestId - The unique request identifier
 * @returns {winston.Logger} Child logger with requestId metadata
 */
logger.withRequestId = function (requestId) {
  return this.child({ requestId });
};

/**
 * Morgan stream adapter — pipes HTTP logs through Winston.
 */
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

module.exports = logger;
