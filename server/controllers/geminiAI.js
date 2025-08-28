import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function getTradingAdvice(symbol) {
  try {
    // Ambil data saham
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );
    if (!res.ok) throw new Error("Failed to fetch stock data");
    const data = await res.json();

    // Prompt untuk AI
    const prompt = `
      Analisa data saham berikut:
      Symbol: ${symbol}
      Current Price: ${data.c}
      High: ${data.h}
      Low: ${data.l}
      Open: ${data.o}
      Previous Close: ${data.pc}

      Berdasarkan data ini, berikan rekomendasi singkat apakah lebih baik Buy, Hold, atau Sell.
      Jelaskan dengan ringkas.
    `;

    // Generate rekomendasi
    const result = await model.generateContent({ prompt });
    // Ambil teks output
    return result.output_text || result.response?.text || "No advice available";
  } catch (err) {
    console.error("Error getting trading advice:", err);
    return "Unable to generate advice";
  }
}

export { getTradingAdvice };
