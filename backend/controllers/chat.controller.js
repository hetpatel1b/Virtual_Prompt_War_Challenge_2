/**
 * Chat Controller
 *
 * Handles AI chat assistant requests:
 *   - sendMessage: General election education Q&A
 *   - simulateScenario: Election scenario simulation
 *   - getSuggestions: Curated suggested questions
 *
 * Production-safe: NEVER throws — always returns consistent response shape.
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

    const reply = await geminiService.generateResponse(message)
      .catch(() => "AI is busy right now. Please try again in a moment.");

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
  console.log("SCENARIO INPUT:", req.body);
  try {
    const scenario = req.body?.scenario?.trim();

    if (!scenario || scenario.trim().length < 5) {
      return res.json({
        success: true,
        data: { reply: "Please enter a proper scenario." }
      });
    }

    const prompt = `
You are an expert in Indian elections.

Explain this scenario in a structured and detailed way.

Include:
- Legal process
- Constitutional rules
- Step-by-step what happens
- Final outcome

Use headings and bullet points.

Scenario:
${scenario}
`;

    let reply;

    try {
      reply = await geminiService.generateResponse(prompt);
    } catch (e) {
      console.error("Gemini Scenario Error:", e.message);
      reply = "AI is temporarily busy. Please try again.";
    }

    return res.json({
      success: true,
      data: { reply }
    });

  } catch (err) {
    console.error("SCENARIO ERROR:", err);

    return res.json({
      success: true,
      data: { reply: "Unable to process. Please try again." }
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

