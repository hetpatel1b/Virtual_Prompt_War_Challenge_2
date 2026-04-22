/**
 * Google Gemini AI Service
 *
 * Handles all interactions with the Google Generative AI (Gemini) API
 * using the current @google/genai SDK (replaces deprecated @google/generative-ai).
 *
 * Features:
 *   - Uses Google AI Studio endpoint (not Vertex AI)
 *   - Structured system prompts for election education
 *   - JSON-structured output parsing with fallback
 *   - Retry with exponential backoff on 429/5xx errors
 *   - Demo mode when API key is missing
 *   - Throws on failure so errors are visible to callers
 */

const { GoogleGenAI } = require('@google/genai');
const config = require('../config');
const logger = require('../config/logger');
const demoService = require('./demo.service');

/* ── Singleton client ─────────────────────────────────────────── */

let ai = null;

/**
 * Lazily initialize the Google GenAI client.
 * Returns null if no API key is configured (triggers demo mode).
 */
function getClient() {
  if (ai) return ai;

  if (!config.gemini.apiKey) {
    logger.warn('Gemini API key not configured — using demo mode');
    return null;
  }

  try {
    ai = new GoogleGenAI({ apiKey: config.gemini.apiKey });
    logger.info('Gemini AI client initialized', { model: config.gemini.model });
    return ai;
  } catch (err) {
    logger.error('Failed to initialize Gemini client', { error: err.message });
    return null;
  }
}

/* ── System prompts ───────────────────────────────────────────── */

/**
 * System prompt for election education responses.
 * Enforces structured, educational, non-partisan output.
 */
const ELECTION_SYSTEM_PROMPT = `You are a Senior Election Education Expert and Civic Education Advisor. Your role is to help citizens, students, and first-time voters understand the election process clearly and accurately.

RESPONSE RULES:
1. Always respond in clear, structured format
2. Use simple language accessible to a 8th-grade reading level
3. Be factual, neutral, and non-partisan — never express political opinions
4. Focus primarily on Indian elections but acknowledge global practices when relevant
5. Include constitutional or legal references when applicable

RESPONSE FORMAT — Return a valid JSON object with this structure:
{
  "summary": "A 1-2 sentence summary of the answer",
  "steps": ["Step 1 explanation", "Step 2 explanation", ...],
  "bullets": ["Key point 1", "Key point 2", ...],
  "examples": ["Example 1", "Example 2", ...],
  "relatedTopics": ["Related topic 1", "Related topic 2", ...]
}

RULES FOR EACH FIELD:
- "summary": Always provide a concise 1-2 sentence summary
- "steps": Provide step-by-step explanation when the topic involves a process. If not a process, use an empty array
- "bullets": Always provide 3-6 key points as bullet items
- "examples": Provide 1-3 real-world examples when helpful. Use empty array if not applicable
- "relatedTopics": Suggest 2-4 related election topics the user might want to learn about

If the question is not related to elections, civic education, democracy, or governance, politely redirect the user to ask election-related questions.`;

/**
 * System prompt for scenario simulation.
 */
const SCENARIO_SYSTEM_PROMPT = `You are an Election Scenario Analyst and Constitutional Expert. Users will describe hypothetical election scenarios, and you must simulate and explain what would happen step-by-step based on constitutional provisions, election laws, and established precedents.

RESPONSE FORMAT — Return a valid JSON object:
{
  "scenario": "Restatement of the scenario in clear terms",
  "analysis": "Brief analysis of the scenario",
  "steps": [
    { "step": 1, "title": "Step title", "description": "What happens in this step" },
    { "step": 2, "title": "Step title", "description": "What happens next" }
  ],
  "outcome": "The most likely outcome of this scenario",
  "constitutionalBasis": "Relevant constitutional articles or election laws",
  "historicalPrecedent": "Any historical examples of similar situations (or 'No direct precedent')"
}

RULES:
1. Be thorough but accessible — explain legal concepts in simple terms
2. Reference specific articles of the Indian Constitution or election laws when possible
3. Mention historical examples from India or other democracies
4. Stay factual and neutral — present what WOULD happen, not what SHOULD happen
5. If the scenario is unrealistic, still explain the constitutional process while noting its improbability`;

/* ── Response parsing ─────────────────────────────────────────── */

/**
 * Parse JSON from Gemini's response text.
 * Handles markdown code fences and malformed JSON gracefully.
 *
 * @param {string} text - Raw response text from Gemini
 * @returns {object} Parsed JSON or fallback structure
 */
function parseAIResponse(text) {
  if (!text || typeof text !== 'string') {
    return { summary: 'No response received.', steps: [], bullets: [], examples: [], relatedTopics: [] };
  }

  // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
  let cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback: wrap raw text in structured format
    logger.debug('Failed to parse Gemini JSON response — using text fallback');
    return {
      summary: cleaned.split('\n')[0] || cleaned.slice(0, 200),
      steps: [],
      bullets: cleaned
        .split('\n')
        .filter((line) => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .map((line) => line.replace(/^[-•]\s*/, '').trim())
        .slice(0, 6),
      examples: [],
      relatedTopics: [],
      rawText: cleaned,
    };
  }
}

/* ── Core generation with retry ───────────────────────────────── */

/**
 * Determine if an error is retryable (429 rate limit or 5xx server error).
 */
function isRetryable(err) {
  const msg = (err.message || '').toLowerCase();
  const status = err.status || err.statusCode || err.httpStatusCode || 0;

  // 429 Too Many Requests — always retry
  if (status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('rate limit') || msg.includes('resource exhausted')) {
    return true;
  }

  // 5xx server errors — retry
  if (status >= 500 || msg.includes('internal') || msg.includes('unavailable') || msg.includes('overloaded')) {
    return true;
  }

  return false;
}

/**
 * Generate a response with retry logic and exponential backoff.
 *
 * @param {string} prompt - The user's prompt
 * @param {string} systemPrompt - The system instruction
 * @param {number} [maxRetries=2] - Number of retries on transient failure
 * @returns {Promise<object>} Parsed AI response
 * @throws {Error} If all retries fail or a non-retryable error occurs
 */
async function generateWithRetry(prompt, systemPrompt, maxRetries = 2) {
  const client = getClient();

  if (!client) {
    // No API key → demo mode
    return { ...demoService.getResponse(prompt), source: 'demo' };
  }

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // ── Call Gemini via @google/genai SDK ──
      const result = await client.models.generateContent({
        model: config.gemini.model,
        contents: prompt,
        config: {
          maxOutputTokens: 1500,
          temperature: 0.3,
          topP: 0.8,
          topK: 40,
          systemInstruction: systemPrompt,
        },
      });

      // ── Extract text from response ──
      // @google/genai returns result.text directly (string property, not a function)
      const responseText = result.text;

      if (!responseText) {
        throw new Error('Empty response from Gemini');
      }

      logger.debug('Gemini response received', {
        source: 'gemini',
        model: config.gemini.model,
        promptLength: prompt.length,
        responseLength: responseText.length,
        attempt,
      });

      return { ...parseAIResponse(responseText), source: 'gemini' };

    } catch (err) {
      lastError = err;
      logger.warn(`Gemini request failed (attempt ${attempt + 1}/${maxRetries + 1})`, {
        error: err.message,
        status: err.status || err.statusCode,
        retryable: isRetryable(err),
      });

      // Only retry on transient errors (429, 5xx)
      if (attempt < maxRetries && isRetryable(err)) {
        // Exponential backoff: 2s, 4s, 8s (with jitter)
        const base = Math.pow(2, attempt + 1) * 1000;
        const jitter = Math.random() * 1000;
        const delay = base + jitter;

        logger.info(`Retrying in ${Math.round(delay)}ms…`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Non-retryable error (400, 404, auth) — break immediately
      break;
    }
  }

  // ── All retries exhausted or non-retryable → throw to controller ──
  logger.error('Gemini generation failed — all retries exhausted', {
    error: lastError?.message,
    stack: lastError?.stack,
    model: config.gemini.model,
  });

  throw lastError || new Error('Gemini API call failed after all retries');
}

/* ── Public API ───────────────────────────────────────────────── */

/**
 * Generate an election education response.
 *
 * @param {string} message - The user's question about elections
 * @returns {Promise<object>} Structured election education response
 */
async function generateElectionResponse(message) {
  logger.info('Generating election response', { messageLength: message.length });
  return generateWithRetry(message, ELECTION_SYSTEM_PROMPT);
}

/**
 * Generate a scenario simulation response.
 *
 * @param {string} scenario - The scenario question
 * @returns {Promise<object>} Structured scenario simulation
 */
async function generateScenarioResponse(scenario) {
  logger.info('Generating scenario response', { scenarioLength: scenario.length });
  return generateWithRetry(scenario, SCENARIO_SYSTEM_PROMPT);
}

module.exports = {
  generateElectionResponse,
  generateScenarioResponse,
  parseAIResponse,
};
