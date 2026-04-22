/**
 * Quiz Controller
 *
 * Handles election knowledge quiz operations:
 *   - getQuestions: Returns quiz questions (without answers for integrity)
 *   - submitQuiz: Scores answers and provides feedback
 *   - getLeaderboard: Returns top quiz scores
 *   - getUserHistory: Returns a user's past quiz attempts
 */

const quizData = require('../data/quizQuestions');
const firebaseService = require('../services/firebase.service');
const logger = require('../config/logger');

/**
 * GET /api/quiz/questions
 * Returns quiz questions WITHOUT correct answers (anti-cheating).
 */
function getQuestions(req, res) {
  const { category, difficulty, count } = req.query;
  const reqLogger = logger.withRequestId(req.id);

  const questions = quizData.getFilteredQuestions({
    category,
    difficulty,
    count: count ? parseInt(count, 10) : 10,
  });

  // Strip correct answers and explanations before sending to client
  const safeQuestions = questions.map((q) => ({
    id: q.id,
    category: q.category,
    difficulty: q.difficulty,
    question: q.question,
    options: q.options,
  }));

  reqLogger.info('Quiz questions served', {
    count: safeQuestions.length,
    category: category || 'all',
    difficulty: difficulty || 'all',
  });

  res.json({
    success: true,
    data: {
      questions: safeQuestions,
      total: safeQuestions.length,
      categories: quizData.getCategories(),
    },
  });
}

/**
 * POST /api/quiz/submit
 * Score the user's quiz answers and provide per-question feedback.
 */
async function submitQuiz(req, res, next) {
  try {
    const { answers } = req.body;
    const userId = req.user.uid;
    const reqLogger = logger.withRequestId(req.id);

    reqLogger.info('Quiz submission received', { userId, answerCount: answers.length });

    let correct = 0;
    const breakdown = [];

    for (const answer of answers) {
      const question = quizData.getQuestionById(answer.questionId);

      if (!question) {
        breakdown.push({
          questionId: answer.questionId,
          status: 'invalid',
          message: 'Question not found.',
        });
        continue;
      }

      const isCorrect = question.correctIndex === answer.selectedOption;

      if (isCorrect) correct++;

      breakdown.push({
        questionId: question.id,
        question: question.question,
        selectedOption: answer.selectedOption,
        selectedAnswer: question.options[answer.selectedOption],
        correctOption: question.correctIndex,
        correctAnswer: question.options[question.correctIndex],
        isCorrect,
        explanation: question.explanation,
        source: question.source,
        category: question.category,
        difficulty: question.difficulty,
      });
    }

    const total = answers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Generate performance-based recommendations
    const recommendations = generateRecommendations(breakdown);

    // Generate feedback message
    const feedback = generateFeedback(percentage);

    // Save score to Firestore (quizAttempts collection)
    const attemptId = await firebaseService.saveQuizScore(
      userId,
      correct,
      total,
      percentage,
      breakdown.map((b) => ({
        questionId: b.questionId,
        selectedOption: b.selectedOption,
        isCorrect: b.isCorrect,
      }))
    );

    // Non-blocking: also store in 'scores' collection for Google integration
    firebaseService.storeQuizScore(userId, correct, total, percentage).catch(() => {});

    reqLogger.info('Quiz scored', { userId, correct, total, percentage, attemptId });

    res.json({
      success: true,
      data: {
        attemptId,
        score: correct,
        total,
        percentage,
        feedback,
        breakdown,
        recommendations,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/quiz/leaderboard
 * Returns the top quiz scores.
 */
async function getLeaderboard(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const leaderboard = await firebaseService.getLeaderboard(limit);

    res.json({
      success: true,
      data: {
        entries: leaderboard,
        total: leaderboard.length,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/quiz/history
 * Returns the authenticated user's quiz attempt history.
 */
async function getUserHistory(req, res, next) {
  try {
    const userId = req.user.uid;
    const history = await firebaseService.getUserQuizHistory(userId);

    // Calculate trend
    let trend = 'stable';
    if (history.length >= 2) {
      const recent = history[0].percentage;
      const previous = history[1].percentage;
      trend = recent > previous ? 'improving' : recent < previous ? 'declining' : 'stable';
    }

    res.json({
      success: true,
      data: {
        attempts: history,
        total: history.length,
        trend,
        averageScore: history.length > 0
          ? Math.round(history.reduce((sum, a) => sum + a.percentage, 0) / history.length)
          : 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Generate study recommendations based on incorrect answers.
 *
 * @param {Array} breakdown - Per-question breakdown
 * @returns {Array<string>} Recommendations
 */
function generateRecommendations(breakdown) {
  const weakCategories = {};

  breakdown.forEach((item) => {
    if (!item.isCorrect && item.category) {
      weakCategories[item.category] = (weakCategories[item.category] || 0) + 1;
    }
  });

  const categoryLabels = {
    voter_eligibility: 'Voter Eligibility & Requirements',
    registration: 'Voter Registration Process',
    polling_process: 'Polling Process & Voting Technology',
    vote_counting: 'Vote Counting & Results',
    election_commission: 'Election Commission of India',
    democracy_rights: 'Democracy & Civic Rights',
  };

  const recommendations = Object.entries(weakCategories)
    .sort(([, a], [, b]) => b - a)
    .map(([category]) => {
      const label = categoryLabels[category] || category;
      return `Review: ${label} — Use the Knowledge Cards section for detailed explanations.`;
    });

  if (recommendations.length === 0) {
    recommendations.push('Excellent work! You have strong knowledge across all topics. Try the harder questions next!');
  }

  return recommendations;
}

/**
 * Generate overall feedback message based on score percentage.
 *
 * @param {number} percentage
 * @returns {object} Feedback with message and emoji
 */
function generateFeedback(percentage) {
  if (percentage === 100) {
    return { emoji: '🏆', title: 'Perfect Score!', message: 'You\'re an election expert! Consider sharing your knowledge with others.' };
  } else if (percentage >= 80) {
    return { emoji: '🌟', title: 'Excellent!', message: 'Great knowledge of the election process. A few more topics to master!' };
  } else if (percentage >= 60) {
    return { emoji: '👍', title: 'Good Job!', message: 'Solid understanding! Review the topics you missed to become an expert.' };
  } else if (percentage >= 40) {
    return { emoji: '📖', title: 'Keep Learning!', message: 'You\'re on the right track. Check out the Voting Guide and Knowledge Cards for deeper understanding.' };
  } else {
    return { emoji: '🌱', title: 'Getting Started', message: 'Every expert was once a beginner! Explore the learning modules and try again.' };
  }
}

module.exports = {
  getQuestions,
  submitQuiz,
  getLeaderboard,
  getUserHistory,
  generateRecommendations,
  generateFeedback,
};
