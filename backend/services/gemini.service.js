const axios = require("axios");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const systemPrompt = `
You are an expert Indian election educator.

Write a DETAILED answer with:
- Clear headings
- Step-by-step explanation
- Real India context (EVM, Election Commission, Lok Sabha, etc.)
- Bullet points
- Examples where helpful
- Minimum 200–300 words

Structure:
1. Overview
2. Step-by-step process
3. Important notes
4. Final outcome

Use markdown formatting with headings and bullet points.
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

    if (status === 429 || status === 503) {
      await delay(2000);
      return await callGemini(safePrompt);
    }

    console.error("Gemini Error:", err.message);
    return "AI is busy. Please try again.";
  }
}

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

  const response = await axios.post(
    url,
    {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\nUser Question: ${prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    },
    {
      timeout: 30000 // 🔥 FIX
    }
  );

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty response");

  return text;
}

module.exports = { generateResponse };