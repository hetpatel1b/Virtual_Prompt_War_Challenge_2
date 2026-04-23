/**
 * Chat Routes
 *
 * POST /api/chat              — Send message to AI assistant
 * POST /api/chat/scenario     — Simulate an election scenario
 * GET  /api/chat/suggestions   — Get suggested questions
 */

const { Router } = require('express');
const chatController = require('../controllers/chat.controller');
const { optionalAuth } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { validateChatMessage, validateScenario } = require('../middleware/validator');

const router = Router();

// AI chat — optional auth (saves history if authenticated)
router.post(
  '/',
  aiLimiter,
  optionalAuth,
  validateChatMessage,
  chatController.sendMessage
);

// Scenario simulation — optional auth, AI rate limited
router.post(
  '/scenario',
  aiLimiter,
  optionalAuth,
  chatController.simulateScenario
);
// Suggested questions — public, no rate limit
router.get('/suggestions', chatController.getSuggestions);

// Chat history — optional auth
router.get('/history', optionalAuth, chatController.getHistory);

module.exports = router;
