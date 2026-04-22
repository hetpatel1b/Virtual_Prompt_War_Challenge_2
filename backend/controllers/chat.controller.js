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

    const reply = await geminiService.generateResponse(message);

    return res.json({
      success: true,
      data: { reply }
    });

  } catch (err) {
    console.error("Chat Controller Error:", err);

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
async function simulateScenario(req, res, next) {
  try {
    const { scenario } = req.body;

    const reply = await geminiService.generateResponse(scenario);

    return res.json({
      success: true,
      data: { reply }
    });

  } catch (err) {
    console.error("Chat Controller Error:", err);

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

module.exports = { sendMessage, simulateScenario, getSuggestions };

