const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

async function generateResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

    console.log("RAW GEMINI RESULT:", JSON.stringify(result, null, 2));

    if (!result || !result.response) {
      throw new Error("Gemini returned no response object");
    }

    const text = result.response.text();

    console.log("GEMINI TEXT:", text);

    if (!text || text.trim() === "") {
      throw new Error("Gemini returned empty text");
    }

    return text;

  } catch (error) {
    console.error("GEMINI ERROR:", error);
    throw error;
  }
}

module.exports = { generateResponse };
