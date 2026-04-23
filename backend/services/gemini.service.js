const axios = require("axios");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL; // should be gemini-2.5-flash

// 🔹 Minimal testable pure function
const sanitizePrompt = (p) => (typeof p === "string" ? p.trim().substring(0, 1000) : "");

// 🔹 Main function used by controller
async function generateResponse(prompt) {
  const safePrompt = sanitizePrompt(prompt);
  if (!safePrompt) return "Invalid or empty prompt provided.";

  try {
    return await callGemini(safePrompt);
  } catch (err) {
    const status = err.response?.status;

    console.error("GEMINI ERROR:", status, err.response?.data || err.message);

    // Retry for server busy
    if (status === 503) {
      console.log("Retrying Gemini...");
      await new Promise(r => setTimeout(r, 3000));

      try {
        return await callGemini(safePrompt);
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

  // Enforce problem alignment (election context)
  const systemInstruction = "You are an AI assistant helping users understand elections. Keep answers neutral, factual, and concise.";

  console.log(`[Gemini API] Requesting ${MODEL}. Prompt length: ${prompt.length}`);

  const response = await axios.post(url, {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemInstruction}\n\nUser: ${prompt}` }]
      }
    ]
  });

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  console.log(`[Gemini API] Received response. Length: ${text?.length || 0}`);

  return text || "No response generated. Try again.";
}

module.exports = { generateResponse, sanitizePrompt };