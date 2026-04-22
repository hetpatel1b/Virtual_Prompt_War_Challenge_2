/**
 * User Routes
 *
 * GET /api/user/profile    — Get user profile and progress
 * PUT /api/user/progress   — Update learning progress
 */

const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/auth');

const router = Router();

// All user routes require authentication
router.use(requireAuth);

// Get user profile
router.get('/profile', userController.getProfile);

// Update learning progress
router.put('/progress', userController.updateProgress);

module.exports = router;
