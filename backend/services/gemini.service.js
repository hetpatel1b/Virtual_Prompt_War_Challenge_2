const axios = require("axios");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

async function generateResponse(prompt) {
  const MAX_RETRIES = 3;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );

      const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("Empty response");

      return text;

    } catch (err) {
      const status = err?.response?.status;

      // retry only on 503
      if (status === 503 && i < MAX_RETRIES - 1) {
        console.log(`Retrying Gemini... attempt ${i + 1}`);
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }

      console.error("🔥 GEMINI ERROR:", err?.response?.data || err.message);
      throw err;
    }
  }
}
module.exports = { generateResponse };