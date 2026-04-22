const axios = require("axios");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL; // should be gemini-2.5-flash

// 🔹 Main function used by controller
async function generateResponse(prompt) {
  try {
    return await callGemini(prompt);
  } catch (err) {
    if (err.response?.status === 503) {
      console.log("Retrying Gemini...");
      await new Promise(r => setTimeout(r, 2000));

      try {
        return await callGemini(prompt);
      } catch {
        return "AI is busy right now. Please try again in a moment.";
      }
    }

    console.error("GEMINI ERROR:", err.response?.data || err.message);
    throw err;
  }
}

// 🔹 Actual Gemini API call
async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const response = await axios.post(url, {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  });

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  return text;
}

module.exports = { generateResponse };