const axios = require("axios");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

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

    return "AI service failed. Please try again.";
  }
}

// ✅ API CALL
async function callGemini(prompt) {
  await delay(1000); // SAFE delay inside function

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const response = await axios.post(
    url,
    {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Explain clearly:\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 200,
      },
    },
    {
      timeout: 10000,
    }
  );

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty response");

  return text;
}

module.exports = { generateResponse };