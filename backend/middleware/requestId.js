/**
 * Request ID Middleware
 *
 * Generates a unique correlation ID for every incoming request.
 * Attaches it to req.id and the x-request-id response header
 * for distributed tracing and log correlation.
 */

const { v4: uuidv4 } = require('uuid');

function requestIdMiddleware(req, res, next) {
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.id = requestId;
  res.setHeader('x-request-id', requestId);
  next();
}

module.exports = requestIdMiddleware;
