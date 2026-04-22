/**
 * User Controller
 *
 * Handles user profile and learning progress operations:
 *   - getProfile: Returns user's profile and learning progress
 *   - updateProgress: Updates completed voting guide steps / knowledge cards
 */

const firebaseService = require('../services/firebase.service');
const logger = require('../config/logger');

/**
 * GET /api/user/profile
 * Returns the authenticated user's profile and learning progress.
 */
async function getProfile(req, res, next) {
  try {
    const { uid, email, name, picture } = req.user;
    const reqLogger = logger.withRequestId(req.id);

    reqLogger.info('Profile requested', { userId: uid });

    const profile = await firebaseService.getUserProfile(uid);
    const quizHistory = await firebaseService.getUserQuizHistory(uid, 5);

    res.json({
      success: true,
      data: {
        user: {
          uid,
          email,
          name,
          picture,
        },
        progress: profile.progress || {
          votingGuideSteps: [],
          knowledgeCards: [],
          completedAt: null,
        },
        quizSummary: {
          totalAttempts: quizHistory.length,
          bestScore: quizHistory.length > 0
            ? Math.max(...quizHistory.map((h) => h.percentage))
            : 0,
          averageScore: quizHistory.length > 0
            ? Math.round(quizHistory.reduce((sum, h) => sum + h.percentage, 0) / quizHistory.length)
            : 0,
          recentAttempts: quizHistory.slice(0, 3),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/user/progress
 * Updates the user's learning progress.
 *
 * Body:
 *   { votingGuideSteps?: string[], knowledgeCards?: string[] }
 */
async function updateProgress(req, res, next) {
  try {
    const { uid } = req.user;
    const { votingGuideSteps, knowledgeCards } = req.body;
    const reqLogger = logger.withRequestId(req.id);

    reqLogger.info('Progress update requested', { userId: uid });

    const progress = {};

    if (Array.isArray(votingGuideSteps)) {
      progress.votingGuideSteps = votingGuideSteps;
    }

    if (Array.isArray(knowledgeCards)) {
      progress.knowledgeCards = knowledgeCards;
    }

    // Check if all modules are complete
    const allGuideSteps = ['step_1', 'step_2', 'step_3', 'step_4', 'step_5', 'step_6'];
    const allKnowledgeCards = ['democracy', 'election', 'voting', 'types', 'fair_elections', 'election_commission'];

    const guideComplete = allGuideSteps.every((s) =>
      (progress.votingGuideSteps || []).includes(s)
    );
    const knowledgeComplete = allKnowledgeCards.every((c) =>
      (progress.knowledgeCards || []).includes(c)
    );

    if (guideComplete && knowledgeComplete) {
      progress.completedAt = new Date().toISOString();
    }

    await firebaseService.updateUserProgress(uid, progress);

    res.json({
      success: true,
      data: {
        progress,
        isComplete: guideComplete && knowledgeComplete,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProgress };
