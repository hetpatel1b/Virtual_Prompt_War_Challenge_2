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

const router = Router();

/**
 * GET /api/health
 * Health check endpoint for load balancers and monitoring.
 */
router.get('/health', (req, res) => {
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
    },
  });
});

// Mount sub-routers
router.use('/chat', chatRoutes);
router.use('/quiz', quizRoutes);
router.use('/user', userRoutes);

module.exports = router;
