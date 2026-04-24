/**
 * Chat Controller
 *
 * Handles AI chat assistant requests:
 *   - sendMessage: General election education Q&A
 *   - simulateScenario: Election scenario simulation
 *   - getSuggestions: Curated suggested questions
 *
 * Production-safe: Returns proper HTTP status codes for errors.
 */

const geminiService = require('../services/gemini.service');
const cacheService = require('../services/cache.service');
const firebaseService = require('../services/firebase.service');
const demoService = require('../services/demo.service');
const { getAllSuggestions } = require('../data/suggestions');
const { getAllScenarios } = require('../data/scenarios');
const logger = require('../config/logger');
const config = require('../config');



/**
 * POST /api/chat
 * Send a message to the AI election education assistant.
 */
async function sendMessage(req, res, next) {
  try {
    const { message } = req.body;
    const userId = req.user?.uid || 'anonymous';
    const cacheKey = `chat_${userId}_${Buffer.from(message || '').toString('base64').substring(0, 20)}`;

    const cachedReply = cacheService.get(cacheKey);
    if (cachedReply) {
      return res.json({ success: true, data: { reply: cachedReply } });
    }

    let reply;
    try {
      reply = await geminiService.generateResponse(message);
    } catch (err) {
      const status = err.response?.status;
      console.error("Gemini API error:", status, err.message);

      if (status === 429) {
        return res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT',
            message: 'AI service is busy. Please wait a moment and try again.'
          }
        });
      }

      if (status === 503) {
        return res.status(503).json({
          success: false,
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: 'AI service is temporarily unavailable. Please try again shortly.'
          }
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'AI_ERROR',
          message: 'Failed to generate response. Please try again.'
        }
      });
    }

    // Cache and Store (Non-blocking)
    cacheService.set(cacheKey, reply, 300); // cache for 5 minutes
    firebaseService.storeChatEntry(userId, message, { summary: reply }).catch(() => { });

    return res.json({
      success: true,
      data: { reply }
    });

  } catch (err) {
    console.error("CONTROLLER ERROR:", err);

    return res.status(500).json({
      success: false,
      error: {
        code: "AI_ERROR",
        message: "Failed to generate response"
      }
    });
  }
}

/**
 * POST /api/chat/scenario
 * Simulate an election scenario step-by-step.
 */
async function simulateScenario(req, res) {
  try {
    const scenario = req.body.scenario || req.body.message;

    if (!scenario) {
      return res.json({
        success: true,
        data: { reply: "Please enter a valid scenario." }
      });
    }

    const prompt = `
You are an expert in Indian elections.

Explain in structured format:

## Situation
## Legal Rules
## Step-by-step Process
## Final Outcome

Scenario:
${scenario}
`;

    let reply;
    try {
      reply = await geminiService.generateResponse(prompt);
    } catch (err) {
      const status = err.response?.status;

      if (status === 429) {
        return res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT',
            message: 'AI service is busy. Please wait a moment and try again.'
          }
        });
      }

      return res.json({
        success: true,
        data: {
          reply: "⚠️ Unable to process scenario right now. Please try again."
        }
      });
    }

    return res.json({
      success: true,
      data: { reply }
    });

  } catch (err) {
    console.error("SCENARIO ERROR:", err);

    return res.json({
      success: true,
      data: {
        reply: "⚠️ Unable to process scenario right now. Please try again."
      }
    });
  }
}
/**
 * GET /api/chat/suggestions
 * Get curated suggested questions for the chat interface.
 */
function getSuggestions(req, res) {
  try {
    const suggestions = getAllSuggestions();
    const scenarios = getAllScenarios();

    res.json({
      success: true,
      data: {
        suggestions,
        scenarios,
      },
    });
  } catch (err) {
    logger.error('getSuggestions failed', { error: err.message });
    res.json({
      success: true,
      data: {
        suggestions: [],
        scenarios: [],
      },
    });
  }
}

/**
 * GET /api/chat/history
 * Retrieve recent chats for the user from Firestore.
 */
async function getHistory(req, res) {
  try {
    const userId = req.user?.uid || 'anonymous';
    const limit = parseInt(req.query.limit, 10) || 10;

    // Safely retrieve chats from Firestore (non-blocking)
    const chats = await firebaseService.getRecentChats(userId, limit);

    res.json({
      success: true,
      data: { chats }
    });
  } catch (err) {
    logger.error('getHistory failed', { error: err.message });
    res.json({
      success: true,
      data: { chats: [] }
    });
  }
}

module.exports = { sendMessage, simulateScenario, getSuggestions, getHistory };
