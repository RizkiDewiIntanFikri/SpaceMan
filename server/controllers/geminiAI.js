import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "	gemini-2.5-flash" });

async function getTradingAdvice(symbol) {
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
  );
  const data = await res.json();

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

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export { getTradingAdvice };
