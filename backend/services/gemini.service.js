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

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const sanitizePrompt = (p) =>
  typeof p === "string" ? p.trim().substring(0, 1000) : "";

let lastRequestTime = 0;

async function generateResponse(prompt) {
  const safePrompt = sanitizePrompt(prompt);

  if (!safePrompt || safePrompt.length < 5) {
    return "Please ask a meaningful question about elections.";
  }

  if (Date.now() - lastRequestTime < 3000) {
    return "⚠️ Please wait a few seconds before sending another request.";
  }

  lastRequestTime = Date.now();

  try {
    const response = await callGemini(safePrompt);
    return response;
  } catch (err) {
    const status = err.response?.status;
    console.log("Gemini error status:", status);

    if (status === 429) {
      return "⚠️ Too many users right now. Please wait a few seconds.";
    }

    if (status === 503) {
      return "⚠️ AI is temporarily busy. Please try again shortly.";
    }

    return "⚠️ AI service error. Please try again.";
  }
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

  if (!text) throw new Error("Empty response");

  return text;
}

module.exports = { generateResponse };
