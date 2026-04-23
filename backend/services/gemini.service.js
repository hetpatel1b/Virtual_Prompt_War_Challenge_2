const axios = require("axios");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL; // should be gemini-2.5-flash

// 🔹 Main function used by controller
async function generateResponse(prompt) {
  try {
    return await callGemini(prompt);
  } catch (err) {
    const status = err.response?.status;

    console.error("GEMINI ERROR:", status, err.response?.data || err.message);

    // Retry for server busy
    if (status === 503) {
      console.log("Retrying Gemini...");
      await new Promise(r => setTimeout(r, 3000));

      try {
        return await callGemini(prompt);
      } catch {
        return "AI servers are busy. Please try again in a few seconds.";
      }
    }

    // Rate limit
    if (status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }

    // Fallback
    return "Failed to generate response.";
  }
}

// 🔹 Actual Gemini API call
async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const response = await axios.post(url, {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  });

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  return text || "No response generated. Try again.";
}

module.exports = { generateResponse };