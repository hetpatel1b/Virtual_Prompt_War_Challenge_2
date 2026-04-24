const axios = require("axios");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const systemPrompt = `
You are an expert Indian election educator.

Always respond in a detailed, structured format.

Rules:
- Minimum 300 words
- Use headings (##)
- Use bullet points
- Give step-by-step explanation
- Include real India context (EVM, Election Commission, Lok Sabha)
- Use clear formatting (markdown)

Format:
## Overview
## Types / Steps
## Important Notes
## Final Summary
`;

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const sanitizePrompt = (p) =>
  typeof p === "string" ? p.trim().substring(0, 1000) : "";

async function generateResponse(prompt) {
  const safePrompt = sanitizePrompt(prompt);

  if (!safePrompt) return "Please enter a valid question.";

  try {
    return await callGemini(safePrompt);
  } catch (err) {
    const status = err.response?.status;

    console.log("Gemini error status:", status);

    // ✅ Handle rate limit
    if (safePrompt.length < 5) {
      return "Please ask a meaningful question.";
    }
    if (status === 429) {
      return "⚠️ Too many users right now. Please wait a few seconds and try again.";
    }

    // ✅ Handle busy server
    if (status === 503) {
      return "⚠️ AI is temporarily busy. Please try again in a moment.";
    }

    // ✅ Final fallback
    return "⚠️ AI service error. Please try again.";
  }
}

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

  const fullPrompt = `${systemPrompt}

User Question:
${prompt}
`;

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
      timeout: 60000 // 🔥 increase timeout
    }
  );

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty response");

  return text;
}

module.exports = { generateResponse };