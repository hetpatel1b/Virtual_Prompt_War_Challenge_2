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

/** Fallback response used when everything else fails */
const CHAT_FALLBACK = {
  summary: 'I apologize, but I encountered an issue processing your request. Please try again.',
  steps: [],
  bullets: [],
  examples: [],
  relatedTopics: [],
};

const SCENARIO_FALLBACK = {
  scenario: 'Unable to process the scenario at this time.',
  analysis: 'The AI service encountered an issue. Please try again in a moment.',
  steps: [],
  outcome: 'Please retry your request.',
  constitutionalBasis: '',
  historicalPrecedent: '',
};

/**
 * POST /api/chat
 * Send a message to the AI election education assistant.
 */
async function sendMessage(req, res, next) {
  try {
    const { message } = req.body;
    const reqLogger = logger.withRequestId(req.id);

    reqLogger.info('Chat message received', { messageLength: message.length });

    // 1. Check cache for existing response
    const cacheKey = cacheService.generateKey(message, 'chat');
    const cached = cacheService.get(cacheKey);

    if (cached) {
      reqLogger.info('Returning cached chat response');

      // Save to chat history if user is authenticated (async, non-blocking)
      if (req.user) {
        firebaseService.saveChatMessage(req.user.uid, message, cached).catch(() => {});
      }

      return res.json({
        success: true,
        data: {
          response: cached,
          cached: true,
          fallback: false,
        },
      });
    }

    // 2. Generate AI response
    let response;

    if (config.isDemoMode) {
      response = demoService.getResponse(message);
      reqLogger.info('Using demo mode response');
    } else {
      response = await geminiService.generateElectionResponse(message);
      reqLogger.info('Gemini response generated');
    }

    // 3. Cache the response
    cacheService.set(cacheKey, response);

    // 4. Save to chat history if authenticated (async, non-blocking)
    if (req.user) {
      firebaseService.saveChatMessage(req.user.uid, message, response).catch(() => {});
    }

    // 5. Determine if this was a fallback response from gemini service
    const isFallback = !!(response?._fallback);

    // Clean internal flags before sending to client
    if (response?._fallback) delete response._fallback;
    if (response?._error) delete response._error;

    // 6. Return response — ALWAYS consistent shape
    res.json({
      success: true,
      data: {
        response,
        cached: false,
        fallback: isFallback,
      },
    });
  } catch (err) {
    // Production-safe: return fallback instead of crashing
    const reqLogger = req.id ? logger.withRequestId(req.id) : logger;
    reqLogger.error('sendMessage failed — returning fallback', {
      error: err.message,
      stack: err.stack,
    });

    res.status(200).json({
      success: true,
      data: {
        response: CHAT_FALLBACK,
        cached: false,
        fallback: true,
      },
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
    const reqLogger = logger.withRequestId(req.id);

    reqLogger.info('Scenario simulation requested', { scenarioLength: scenario.length });

    // 1. Check cache
    const cacheKey = cacheService.generateKey(scenario, 'scenario');
    const cached = cacheService.get(cacheKey);

    if (cached) {
      reqLogger.info('Returning cached scenario response');
      return res.json({
        success: true,
        data: { response: cached, cached: true, fallback: false },
      });
    }

    // 2. Generate response
    let response;

    if (config.isDemoMode) {
      response = demoService.getScenarioResponse(scenario);
      reqLogger.info('Using demo scenario response');
    } else {
      response = await geminiService.generateScenarioResponse(scenario);
      reqLogger.info('Gemini scenario response generated');
    }

    // 3. Determine if fallback
    const isFallback = !!(response?._fallback);
    if (response?._fallback) delete response._fallback;
    if (response?._error) delete response._error;

    // 4. Cache
    cacheService.set(cacheKey, response);

    // 5. Return — ALWAYS consistent shape
    res.json({
      success: true,
      data: { response, cached: false, fallback: isFallback },
    });
  } catch (err) {
    // Production-safe: return fallback instead of crashing
    const reqLogger = req.id ? logger.withRequestId(req.id) : logger;
    reqLogger.error('simulateScenario failed — returning fallback', {
      error: err.message,
      stack: err.stack,
    });

    res.status(200).json({
      success: true,
      data: {
        response: SCENARIO_FALLBACK,
        cached: false,
        fallback: true,
      },
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

