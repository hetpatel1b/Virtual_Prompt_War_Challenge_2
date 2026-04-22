/**
 * Firebase Authentication Middleware
 *
 * Verifies Firebase ID tokens from the Authorization header.
 * Two modes:
 *   - requireAuth: blocks unauthenticated requests (401)
 *   - optionalAuth: attaches user if present, continues regardless
 */

const logger = require('../config/logger');

let adminAuth = null;

/**
 * Lazily initialize Firebase Admin Auth reference.
 * This avoids circular dependency issues with firebase.service.js.
 */
function getAdminAuth() {
  if (!adminAuth) {
    try {
      const firebaseService = require('../services/firebase.service');
      adminAuth = firebaseService.getAuth();
    } catch (err) {
      logger.warn('Firebase Admin Auth not available — auth middleware will reject all tokens');
      adminAuth = null;
    }
  }
  return adminAuth;
}

/**
 * Extract the Bearer token from the Authorization header.
 * @param {import('express').Request} req
 * @returns {string|null}
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7).trim();
}

/**
 * Verify a Firebase ID token and return the decoded claims.
 * @param {string} token
 * @returns {Promise<object|null>}
 */
async function verifyToken(token) {
  const auth = getAdminAuth();
  if (!auth) {
    return null;
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || null,
      picture: decoded.picture || null,
      emailVerified: decoded.email_verified || false,
      provider: decoded.firebase?.sign_in_provider || 'unknown',
    };
  } catch (err) {
    logger.debug('Token verification failed', { error: err.message });
    return null;
  }
}

/**
 * Middleware that REQUIRES a valid Firebase auth token.
 * Returns 401 if missing or invalid.
 */
async function requireAuth(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_TOKEN_MISSING',
        message: 'Authentication required. Please sign in.',
      },
    });
  }

  const user = await verifyToken(token);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_TOKEN_INVALID',
        message: 'Invalid or expired authentication token.',
      },
    });
  }

  req.user = user;
  next();
}

/**
 * Middleware that OPTIONALLY attaches user info.
 * If a valid token is present, attaches req.user.
 * If not, continues without user info (req.user = null).
 */
async function optionalAuth(req, res, next) {
  const token = extractToken(req);

  if (token) {
    req.user = await verifyToken(token);
  } else {
    req.user = null;
  }

  next();
}

module.exports = { requireAuth, optionalAuth };
