const axios = require("axios");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

// ✅ Delay helper (MISSING BEFORE)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ✅ Clean input
const sanitizePrompt = (p) =>
  typeof p === "string" ? p.trim().substring(0, 1000) : "";

// 🔥 MAIN FUNCTION
async function generateResponse(prompt) {
  const safePrompt = sanitizePrompt(prompt);

  if (!safePrompt) return "Please enter a valid question.";

  try {
    return await callGemini(safePrompt);
  } catch (err) {
    const status = err.response?.status;

    console.log("Gemini Status:", status);

    // 🔥 RATE LIMIT
    if (status === 429) {
      await delay(3000);
      return "Too many users. Please try again in a few seconds.";
    }

    // 🔥 SERVER BUSY
    if (status === 503) {
      await delay(2000);
      return "AI is busy. Please try again shortly.";
    }

    console.error("Gemini Error:", err.message);

    return "Something went wrong. Please try again.";
  }
}

// 🔥 GEMINI API CALL
async function callGemini(prompt) {
  // 🔥 Small delay to avoid rate limit
  await delay(1200);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const response = await axios.post(
    url,
    {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Explain clearly and simply:\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 200, // 🔥 reduced (IMPORTANT)
      },
    },
    {
      timeout: 10000, // 🔥 prevents hanging
    }
  );

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty response");

  return text;
}

module.exports = { generateResponse, sanitizePrompt };