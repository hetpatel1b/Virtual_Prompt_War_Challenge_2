/**
 * Firebase Admin Service
 *
 * Handles Firebase Admin SDK initialization and Firestore operations.
 * Conditionally initializes — skips if no service account / project ID.
 * Provides demo mode fallbacks when Firebase is not configured.
 */

const admin = require('firebase-admin');
const config = require('../config');
const logger = require('../config/logger');

let app = null;
let db = null;
let auth = null;
let initialized = false;

/**
 * Initialize Firebase Admin SDK.
 * Called once on first use (lazy initialization).
 */
function initialize() {
  if (initialized) return;
  initialized = true;

  if (!config.firebase.projectId) {
    logger.warn('Firebase project ID not configured — running without Firebase');
    return;
  }

  try {
    const initOptions = { projectId: config.firebase.projectId };

    // Try to use service account file if available
    if (config.firebase.serviceAccountPath) {
      try {
        const serviceAccount = require(
          require('path').resolve(config.firebase.serviceAccountPath)
        );
        initOptions.credential = admin.credential.cert(serviceAccount);
        logger.info('Firebase Admin initialized with service account');
      } catch (err) {
        // Fall back to application default credentials
        initOptions.credential = admin.credential.applicationDefault();
        logger.info('Firebase Admin initialized with application default credentials');
      }
    } else {
      initOptions.credential = admin.credential.applicationDefault();
      logger.info('Firebase Admin initialized with application default credentials');
    }

    app = admin.initializeApp(initOptions);
    db = admin.firestore();
    auth = admin.auth();

    // Firestore settings
    db.settings({ ignoreUndefinedProperties: true });

    logger.info('Firestore connected', { projectId: config.firebase.projectId });
  } catch (err) {
    logger.error('Firebase Admin initialization failed', { error: err.message });
    app = null;
    db = null;
    auth = null;
  }
}

/**
 * Get the Firebase Auth instance for token verification.
 * @returns {admin.auth.Auth|null}
 */
function getAuth() {
  initialize();
  return auth;
}

/**
 * Get the Firestore database instance.
 * @returns {admin.firestore.Firestore|null}
 */
function getDb() {
  initialize();
  return db;
}

/**
 * Check if Firebase is available.
 * @returns {boolean}
 */
function isAvailable() {
  initialize();
  return db !== null;
}

// ─────────────────────────────────────────
// Firestore Data Operations
// ─────────────────────────────────────────

/**
 * Save a quiz score to Firestore.
 *
 * @param {string} userId - The user's UID
 * @param {number} score - Number of correct answers
 * @param {number} total - Total number of questions
 * @param {number} percentage - Score percentage
 * @param {Array} answers - User's answer breakdown
 * @returns {Promise<string>} The created document ID
 */
async function saveQuizScore(userId, score, total, percentage, answers) {
  if (!isAvailable()) {
    logger.debug('Firebase unavailable — skipping quiz score save');
    return `demo_${Date.now()}`;
  }

  try {
    const docRef = await db.collection('quizAttempts').add({
      userId,
      score,
      total,
      percentage,
      answers,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString(),
    });

    logger.info('Quiz score saved', { userId, score, total, docId: docRef.id });
    return docRef.id;
  } catch (err) {
    logger.error('Failed to save quiz score', { error: err.message, userId });
    throw err;
  }
}

/**
 * Get the top quiz scores for the leaderboard.
 *
 * @param {number} [limit=20] - Maximum entries to return
 * @returns {Promise<Array>} Leaderboard entries
 */
async function getLeaderboard(limit = 20) {
  if (!isAvailable()) {
    return getDemoLeaderboard();
  }

  try {
    const snapshot = await db
      .collection('quizAttempts')
      .orderBy('percentage', 'desc')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        rank: index + 1,
        score: data.score,
        total: data.total,
        percentage: data.percentage,
        userId: data.userId,
        displayName: data.userId.slice(0, 4) + '****', // Anonymized
        timestamp: data.createdAt,
      };
    });
  } catch (err) {
    logger.error('Failed to fetch leaderboard', { error: err.message });
    return getDemoLeaderboard();
  }
}

/**
 * Get a user's quiz attempt history.
 *
 * @param {string} userId - The user's UID
 * @param {number} [limit=10] - Maximum attempts to return
 * @returns {Promise<Array>} User's quiz attempts
 */
async function getUserQuizHistory(userId, limit = 10) {
  if (!isAvailable()) {
    return [];
  }

  try {
    const snapshot = await db
      .collection('quizAttempts')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    logger.error('Failed to fetch user quiz history', { error: err.message, userId });
    return [];
  }
}

/**
 * Update a user's learning progress.
 *
 * @param {string} userId - The user's UID
 * @param {object} progress - Progress data to merge
 * @returns {Promise<void>}
 */
async function updateUserProgress(userId, progress) {
  if (!isAvailable()) {
    logger.debug('Firebase unavailable — skipping progress update');
    return;
  }

  try {
    await db.collection('users').doc(userId).set(
      {
        progress,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    logger.info('User progress updated', { userId });
  } catch (err) {
    logger.error('Failed to update user progress', { error: err.message, userId });
    throw err;
  }
}

/**
 * Get a user's profile and progress.
 *
 * @param {string} userId - The user's UID
 * @returns {Promise<object>} User profile data
 */
async function getUserProfile(userId) {
  if (!isAvailable()) {
    return { progress: {}, quizCount: 0 };
  }

  try {
    const doc = await db.collection('users').doc(userId).get();

    if (!doc.exists) {
      return { progress: {}, quizCount: 0 };
    }

    return doc.data();
  } catch (err) {
    logger.error('Failed to fetch user profile', { error: err.message, userId });
    return { progress: {}, quizCount: 0 };
  }
}

/**
 * Save a chat message and response pair.
 *
 * @param {string} userId - The user's UID
 * @param {string} message - User's message
 * @param {object} response - AI response
 * @returns {Promise<void>}
 */
async function saveChatMessage(userId, message, response) {
  if (!isAvailable()) return;

  try {
    await db.collection('chatHistory').add({
      userId,
      message,
      response: JSON.stringify(response),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    // Non-critical — log and continue
    logger.warn('Failed to save chat message', { error: err.message, userId });
  }
}

/**
 * Demo leaderboard data when Firebase is not configured.
 */
function getDemoLeaderboard() {
  return [
    { rank: 1, score: 10, total: 10, percentage: 100, displayName: 'Demo****', timestamp: new Date().toISOString() },
    { rank: 2, score: 9, total: 10, percentage: 90, displayName: 'Star****', timestamp: new Date().toISOString() },
    { rank: 3, score: 8, total: 10, percentage: 80, displayName: 'Vote****', timestamp: new Date().toISOString() },
    { rank: 4, score: 7, total: 10, percentage: 70, displayName: 'Elec****', timestamp: new Date().toISOString() },
    { rank: 5, score: 6, total: 10, percentage: 60, displayName: 'Citi****', timestamp: new Date().toISOString() },
  ];
}

// ─────────────────────────────────────────
// Additional Firestore Collections (non-blocking)
// ─────────────────────────────────────────

/**
 * Store a chat entry in the 'chats' collection.
 * Non-blocking — if Firestore fails, the app still works.
 *
 * @param {string} userId - User ID or 'anonymous'
 * @param {string} message - User's message
 * @param {object} response - AI response object
 * @returns {Promise<void>}
 */
async function storeChatEntry(userId, message, response) {
  if (!isAvailable()) return;

  try {
    await db.collection('chats').add({
      userId,
      message,
      responseSummary: response?.summary || '',
      source: response?.source || 'unknown',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString(),
    });
    logger.debug('Chat entry stored in chats collection', { userId });
  } catch (err) {
    // Non-critical — log and continue
    logger.warn('Failed to store chat entry', { error: err.message, userId });
  }
}

/**
 * Store a quiz score in the 'scores' collection.
 * Non-blocking — if Firestore fails, the app still works.
 *
 * @param {string} userId - User's UID
 * @param {number} score - Number of correct answers
 * @param {number} total - Total number of questions
 * @param {number} percentage - Score percentage
 * @returns {Promise<void>}
 */
async function storeQuizScore(userId, score, total, percentage) {
  if (!isAvailable()) return;

  try {
    await db.collection('scores').add({
      userId,
      score,
      total,
      percentage,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString(),
    });
    logger.debug('Quiz score stored in scores collection', { userId, score, total });
  } catch (err) {
    // Non-critical — log and continue
    logger.warn('Failed to store quiz score', { error: err.message, userId });
  }
}

/**
 * Get Firestore connection status for health check.
 *
 * @returns {Promise<string>} 'connected', 'disconnected', or 'not_configured'
 */
async function getConnectionStatus() {
  if (!isAvailable()) return 'not_configured';

  try {
    // Quick read to verify connectivity — uses a lightweight collection list
    await db.listCollections();
    return 'connected';
  } catch (err) {
    logger.warn('Firestore health check failed', { error: err.message });
    return 'disconnected';
  }
}

module.exports = {
  getAuth,
  getDb,
  isAvailable,
  saveQuizScore,
  getLeaderboard,
  getUserQuizHistory,
  updateUserProgress,
  getUserProfile,
  saveChatMessage,
  storeChatEntry,
  storeQuizScore,
  getConnectionStatus,
};
