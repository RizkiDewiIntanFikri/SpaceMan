const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function askGemini(userQuestion) {
  const prompt = `Jawab singkat dalam 2 kalimat: ${userQuestion}`;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini error:", err);
    return "AI gagal merespon, coba lagi sebentar.";
  }
}

module.exports = { askGemini };
