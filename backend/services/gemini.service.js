// backend/services/gemini.service.js

const axios = require("axios");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-pro";

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

// Simple mutex: ensures only ONE Gemini call runs at a time.
// Additional requests wait in line instead of being rejected.
let pendingRequest = Promise.resolve();

async function generateResponse(prompt) {
  const safePrompt = sanitizePrompt(prompt);

  if (!safePrompt || safePrompt.length < 5) {
    return "Please ask a meaningful question about elections.";
  }

  // Queue this request behind any currently running request
  const result = new Promise((resolve, reject) => {
    pendingRequest = pendingRequest
      .then(() => callGemini(safePrompt))
      .then(resolve)
      .catch(reject);
  });

  return result;
}

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
