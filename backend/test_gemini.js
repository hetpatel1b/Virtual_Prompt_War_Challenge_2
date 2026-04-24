const axios = require("axios");

const API_KEY = *;
const MODEL = "gemini-2.5-flash";

async function testGemini() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  console.log(`CALLING GEMINI`);
  console.log(`URL: ${url}`);
  
  try {
    const response = await axios.post(
      url,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: "Hello" }]
          }
        ]
      }
    );
    console.log(`GEMINI RESPONSE RECEIVED`);
    console.log(response.data.candidates[0].content.parts[0].text);
  } catch (err) {
    console.error("ERROR", err.response?.status, err.response?.data || err.message);
  }
}

testGemini();
