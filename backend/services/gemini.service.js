const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

async function generateResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // ✅ your target model
    });

    const result = await model.generateContent(prompt);

    // 🔥 SAFE UNIVERSAL PARSER (works for 1.5 + 2.5)
    let text = null;

    if (result?.response?.text) {
      text = result.response.text();
    } else {
      text =
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    if (!text) {
      console.error("EMPTY RESPONSE:", JSON.stringify(result, null, 2));
      throw new Error("No text returned");
    }

    return text;

  } catch (err) {
    console.error("GEMINI ERROR:", err);
    throw err;
  }
}

module.exports = { generateResponse };