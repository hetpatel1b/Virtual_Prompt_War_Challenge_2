/**
 * Chat Controller
 *
 * Handles AI chat assistant requests:
 *   - sendMessage: General election education Q&A
 *   - simulateScenario: Election scenario simulation
 *   - getSuggestions: Curated suggested questions
 *
 * Production-safe: Uses Gemini with demo-service fallback.
 * Returns proper HTTP status codes for errors.
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

    // Use normalized cache key (shared across users for same question)
    const cacheKey = cacheService.generateKey(message, 'chat');

    const cachedReply = cacheService.get(cacheKey);
    if (cachedReply) {
      return res.json({ success: true, data: { reply: cachedReply } });
    }

    let reply;
    let source = 'gemini';

    try {
      reply = await geminiService.generateResponse(message);
    } catch (err) {
      const status = err.response?.status;
      console.error("Gemini API error:", status, err.message);

      // Fallback to demo service instead of returning an error
      // ONLY use demo if Gemini NEVER worked
      if (!API_KEY) {
        const demoResponse = demoService.getResponse(message);
        reply = formatDemoResponse(demoResponse);
        source = 'fallback';
      }
      if (demoResponse) {
        // Format demo response as readable text
        reply = formatDemoResponse(demoResponse);
        source = 'fallback';
        console.log("FALLBACK TRIGGERED: Using demo response");
      } else {
        // Only return error if fallback also fails
        if (status === 429 || status === 503) {
          console.log("Gemini temporary failure — retrying once...");

          try {
            // retry once after delay
            await new Promise(res => setTimeout(res, 2500));
            reply = await geminiService.generateResponse(message);
            source = 'gemini-retry';
          } catch {
            // final fallback (but still SUCCESS response)
            reply = "⚠️ AI is currently busy. Please try again in a few seconds.";
            source = 'system-message';
          }

          return res.json({
            success: true,
            data: { reply, source }
          });
        }

        if (status === 503) {
          return res.status(503).json({
            success: false,
            error: {
              code: 'SERVICE_UNAVAILABLE',
              message: 'AI busy. Please try again later.'
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
    }

    // Cache for 5 minutes (shared across users)
    cacheService.set(cacheKey, reply, 300);
    firebaseService.storeChatEntry(userId, message, { summary: reply }).catch(() => { });

    return res.json({
      success: true,
      data: { reply, source }
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
 * Format a demo service response object into a readable markdown string.
 */
function formatDemoResponse(demo) {
  let text = '';

  if (demo.summary) {
    text += `${demo.summary}\n\n`;
  }

  if (demo.steps && demo.steps.length > 0) {
    text += `## Steps\n\n`;
    demo.steps.forEach((s, i) => {
      text += `${i + 1}. ${s}\n`;
    });
    text += '\n';
  }

  if (demo.bullets && demo.bullets.length > 0) {
    text += `## Key Points\n\n`;
    demo.bullets.forEach(b => {
      text += `- ${b}\n`;
    });
    text += '\n';
  }

  if (demo.examples && demo.examples.length > 0) {
    text += `## Examples\n\n`;
    demo.examples.forEach(e => {
      text += `> ${e}\n\n`;
    });
  }

  if (demo.relatedTopics && demo.relatedTopics.length > 0) {
    text += `**Related Topics:** ${demo.relatedTopics.join(', ')}\n`;
  }

  return text.trim() || 'I can help you understand elections, voting, and democracy in India. Please ask a specific question!';
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
      console.error("Scenario Gemini error:", status, err.message);

      // Fallback to demo scenario service
      const demoScenario = demoService.getScenarioResponse(scenario);
      if (demoScenario) {
        reply = formatScenarioResponse(demoScenario);
        console.log("FALLBACK TRIGGERED: Using demo scenario response");
      } else {
        if (status === 429) {
          return res.status(429).json({
            success: false,
            error: {
              code: 'RATE_LIMIT',
              message: 'Too many users. Please wait a moment and try again.'
            }
          });
        }

        if (status === 503) {
          return res.status(503).json({
            success: false,
            error: {
              code: 'SERVICE_UNAVAILABLE',
              message: 'AI busy. Please try again later.'
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
 * Format a demo scenario response into readable markdown.
 */
function formatScenarioResponse(demo) {
  let text = '';

  if (demo.scenario) {
    text += `## Situation\n\n${demo.scenario}\n\n`;
  }

  if (demo.analysis) {
    text += `## Analysis\n\n${demo.analysis}\n\n`;
  }

  if (demo.steps && demo.steps.length > 0) {
    text += `## Step-by-step Process\n\n`;
    demo.steps.forEach(s => {
      text += `**Step ${s.step}: ${s.title}**\n${s.description}\n\n`;
    });
  }

  if (demo.outcome) {
    text += `## Final Outcome\n\n${demo.outcome}\n\n`;
  }

  if (demo.constitutionalBasis) {
    text += `## Legal/Constitutional Basis\n\n${demo.constitutionalBasis}\n\n`;
  }

  if (demo.historicalPrecedent) {
    text += `## Historical Precedent\n\n${demo.historicalPrecedent}\n`;
  }

  return text.trim() || "⚠️ Unable to process scenario right now. Please try again.";
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
