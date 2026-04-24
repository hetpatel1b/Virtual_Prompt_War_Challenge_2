// backend/services/gemini.service.js

const axios = require("axios");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

console.log(`[Gemini] Initialized — model=${MODEL}, keyPrefix=${API_KEY ? API_KEY.substring(0, 10) + '...' : 'MISSING'}`);

const systemPrompt = `
You are an expert Indian election educator.

IMPORTANT:
- Always complete the full answer
- NEVER stop mid-sentence
- Minimum 300–500 words

Use:
## Headings
- Bullet points
- Step-by-step explanation

Finish properly with a conclusion.
`;

const sanitizePrompt = (p) =>
  typeof p === "string" ? p.trim().substring(0, 1000) : "";

// ─── FIFO Queue + Rate-Limit Guard ─────────────────────────
// Ensures only ONE Gemini call at a time, with a minimum 3-second
// gap between calls to stay safely under the free tier limit.
let pendingRequest = Promise.resolve();
let lastCallTime = 0;
const MIN_GAP_MS = 3000; // 3 seconds between Gemini calls

// ─── In-Memory Response Cache ──────────────────────────────
// Global cache keyed by normalized prompt (shared across all users).
// TTL: 10 minutes. Prevents duplicate Gemini calls for the same question.
const responseCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCacheKey(prompt) {
  return prompt.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

function getCachedResponse(prompt) {
  const key = getCacheKey(prompt);
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return entry.text;
}

function setCachedResponse(prompt, text) {
  const key = getCacheKey(prompt);
  responseCache.set(key, { text, time: Date.now() });

  // Evict oldest entries if cache grows too large
  if (responseCache.size > 200) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
}

// ─── Main Entry Point ──────────────────────────────────────
async function generateResponse(prompt) {
  const safePrompt = sanitizePrompt(prompt);

  if (!safePrompt || safePrompt.length < 5) {
    return "Please ask a meaningful question about elections.";
  }

  // 1. Check cache first — no Gemini call needed
  const cached = getCachedResponse(safePrompt);
  if (cached) {
    console.log("[Gemini] Cache HIT for prompt");
    return cached;
  }

  // 2. Queue behind any running request (FIFO, one at a time)
  const result = new Promise((resolve, reject) => {
    pendingRequest = pendingRequest
      .then(() => rateGuardedCall(safePrompt))
      .then(resolve)
      .catch(reject);
  });

  return result;
}

// ─── Rate-Guarded Gemini Call ──────────────────────────────
// Enforces minimum gap between calls, then makes the actual request.
async function rateGuardedCall(prompt) {
  const now = Date.now();
  const elapsed = now - lastCallTime;
  if (elapsed < MIN_GAP_MS) {
    const waitTime = MIN_GAP_MS - elapsed;
    console.log(`[Gemini] Rate guard: waiting ${waitTime}ms`);
    await new Promise(res => setTimeout(res, waitTime));
  }

  lastCallTime = Date.now();
  const text = await callGemini(prompt);

  // Cache the successful response
  setCachedResponse(prompt, text);

  return text;
}

// ─── Raw Gemini API Call ───────────────────────────────────
async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const fullPrompt = `${systemPrompt}\n\nUser Question:\n${prompt}\n`;

  const response = await axios.post(
    url,
    {
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 1200
      }
    },
    {
      timeout: 60000
    }
  );

  const parts = response.data?.candidates?.[0]?.content?.parts || [];

  const text = parts
    .map(p => p.text || "")
    .join("")
    .trim();

  if (!text) throw new Error("Empty response from Gemini");

  return text;
}

module.exports = { generateResponse };
