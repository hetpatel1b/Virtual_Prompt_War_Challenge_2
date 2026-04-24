/**
 * Quiz Routes
 *
 * GET  /api/quiz/questions    — Get quiz questions
 * POST /api/quiz/submit       — Submit quiz answers (auth required)
 * GET  /api/quiz/leaderboard  — Get top scores
 * GET  /api/quiz/history      — Get user's quiz history (auth required)
 */

const { Router } = require('express');
const quizController = require('../controllers/quiz.controller');
const { requireAuth } = require('../middleware/auth');
const { validateQuizSubmission, validateQuizQuery } = require('../middleware/validator');

const router = Router();

// Get questions — public
router.get('/questions', validateQuizQuery, quizController.getQuestions);

// FIX START — Added requireAuth so req.user.uid is available in controller
router.post(
  '/submit',
  requireAuth,
  validateQuizSubmission,
  quizController.submitQuiz
);
// FIX END

// Leaderboard — public
router.get('/leaderboard', quizController.getLeaderboard);

// User's quiz history — requires authentication
router.get('/history', requireAuth, quizController.getUserHistory);

module.exports = router;
