const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

async function generateResponse(message) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(message);

    if (!result || !result.response) {
      throw new Error("No response from Gemini");
    }

    const text = result.response.text();

    if (!text || text.trim() === "") {
      throw new Error("Empty response from Gemini");
    }

    return text;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

module.exports = { generateResponse };
