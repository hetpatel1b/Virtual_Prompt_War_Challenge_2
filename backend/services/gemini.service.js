const axios = require("axios");

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

async function generateResponse(prompt) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    // ✅ SAFE PARSING (VERY IMPORTANT)
    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Gemini RAW response:", JSON.stringify(response.data, null, 2));
      throw new Error("Empty response from Gemini");
    }

    return text;

  } catch (err) {
    console.error("🔥 GEMINI FULL ERROR:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { generateResponse };