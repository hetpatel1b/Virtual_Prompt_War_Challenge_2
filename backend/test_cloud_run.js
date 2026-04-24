const axios = require("axios");

async function test() {
  try {
    const res = await axios.post("https://electionguide-backend-626852181074.us-central1.run.app/api/chat", {
      message: "What is an EVM?"
    });
    console.log("SUCCESS:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log("ERROR STATUS:", err.response?.status);
    console.log("ERROR DATA:", JSON.stringify(err.response?.data, null, 2));
  }
}

test();
