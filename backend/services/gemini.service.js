const axios = require("axios");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

// ✅ Delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ✅ Sanitize
const sanitizePrompt = (p) =>
  typeof p === "string" ? p.trim().substring(0, 1000) : "";

// ✅ MAIN FUNCTION
async function generateResponse(prompt) {
  const safePrompt = sanitizePrompt(prompt);

  if (!safePrompt) return "Please enter a valid question.";

  try {
    return await callGemini(safePrompt);
  } catch (err) {
    console.error("Gemini FULL ERROR:", err.response?.data || err.message);

    const status = err.response?.status;

    if (status === 429) {
      return "Too many requests. Try again in a few seconds.";
    }

    if (status === 503) {
      return "AI is busy. Please try again.";
    }

    return `ERROR: ${err.response?.data?.error?.message || err.message}`;
  }
}

// ✅ API CALL
async function callGemini(prompt) {
  await delay(1000);

  const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;
  const response = await axios.post(
    url,
    {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    },
    {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 10000
    }
  );

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty Gemini response");

  return text;
}

module.exports = { generateResponse };