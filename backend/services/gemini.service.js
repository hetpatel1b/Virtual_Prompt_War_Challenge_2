const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

async function generateResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // use stable model
    });

    const result = await model.generateContent(prompt);

    // 🔥 SAFE PARSING (this is the real fix)
    const text =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("EMPTY GEMINI RESPONSE:", result);
      throw new Error("Empty Gemini response");
    }

    return text;

  } catch (err) {
    console.error("GEMINI ERROR:", err);
    throw err;
  }
}

module.exports = { generateResponse };