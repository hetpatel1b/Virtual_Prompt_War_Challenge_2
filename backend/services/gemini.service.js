const axios = require("axios");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const systemPrompt = `
You are a highly knowledgeable Indian election expert.

You MUST follow these rules strictly:

- Write a LONG and DETAILED answer (minimum 300 words)
- Use proper Markdown formatting
- Use clear headings (##)
- Use bullet points and numbered steps
- Explain in simple language but with depth
- Include real Indian context (EVM, Election Commission, Lok Sabha, etc.)

Structure your answer EXACTLY like this:

## Overview
(Explain concept clearly)

## Step-by-Step Process
1. Step one
2. Step two
3. Step three

## Important Notes
- Key point 1
- Key point 2

## Final Outcome
(Summarize clearly)

IMPORTANT:
Do NOT give short answers.
Do NOT skip sections.
Always follow structure.
`;

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const sanitizePrompt = (p) =>
  typeof p === "string" ? p.trim().substring(0, 1000) : "";

async function generateResponse(prompt) {
  const safePrompt = sanitizePrompt(prompt);

  if (!safePrompt) return "Please enter a valid question.";

  try {
    return await callGemini(safePrompt);
  } catch (err) {
    const status = err.response?.status;

    if (status === 429 || status === 503) {
      await delay(2000);
      return await callGemini(safePrompt);
    }

    console.error("Gemini Error:", err.message);
    return "AI is busy. Please try again.";
  }
}

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

  const response = await axios.post(
    url,
    {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\nUser Question: ${prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 800
      }
    },
    {
      timeout: 30000 // 🔥 FIX
    }
  );

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty response");

  return text;
}

module.exports = { generateResponse };