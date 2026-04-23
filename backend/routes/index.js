/**
 * Route Registry
 *
 * Central module that mounts all sub-routers under /api.
 * Also provides the health check endpoint.
 */

const { Router } = require('express');
const chatRoutes = require('./chat.routes');
const quizRoutes = require('./quiz.routes');
const userRoutes = require('./user.routes');
const cacheService = require('../services/cache.service');
const firebaseService = require('../services/firebase.service');
const config = require('../config');

const router = Router();

/**
 * GET /api/health
 * Health check endpoint for load balancers and monitoring.
 * Reports Gemini API and Firestore integration status.
 */
router.get('/health', async (req, res) => {
  // Determine Gemini API status
  const geminiStatus = config.gemini.apiKey ? 'active' : 'missing_key';

  // Check Firestore connectivity (non-blocking, with timeout)
  let firestoreStatus;
  try {
    firestoreStatus = await Promise.race([
      firebaseService.getConnectionStatus(),
      new Promise((resolve) => setTimeout(() => resolve('timeout'), 3000)),
    ]);
  } catch {
    firestoreStatus = 'error';
  }

  res.json({
    success: true,
    data: {
      status: 'healthy',
      service: 'electionguide-api',
      version: '1.0.0',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      cache: cacheService.getStats(),
      integrations: {
        gemini: geminiStatus,
        firestore: firestoreStatus,
        firestoreActivelyUsed: firestoreStatus === 'connected',
        model: config.gemini.model,
      },
    },
  });
});

// Mount sub-routers
router.use('/chat', chatRoutes);
router.use('/quiz', quizRoutes);
router.use('/user', userRoutes);

module.exports = router;
