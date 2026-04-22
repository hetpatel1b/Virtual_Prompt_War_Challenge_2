const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

async function generateResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);

    // 🔥 SAFE PARSING (THIS FIXES YOUR ISSUE)
    let text = null;

    if (typeof result.response.text === "function") {
      text = result.response.text();
    }

    if (!text) {
      text =
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    if (!text) {
      console.error("FULL GEMINI RESPONSE:", JSON.stringify(result, null, 2));
      throw new Error("Empty response from Gemini");
    }

    return text;

  } catch (err) {
    console.error("🔥 GEMINI SERVICE ERROR:", err);
    throw err;
  }
}

module.exports = { generateResponse };