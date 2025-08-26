const axios = require("axios");
const { FINNHUB_KEY } = require("../config/marketData.js");

async function getStockPrice(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
  const { data } = await axios.get(url);
  return { symbol, price: data.c };
}

module.exports = { getStockPrice };
