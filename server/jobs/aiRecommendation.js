const { MarketDataService } = require("../utilities/marketData");

function startAiRecommendation(io) {
  const symbols = ["AAPL", "GOOGL", "AMZN", "MSFT", "NVDA"]; // Bisa tambah simbol lain

  setInterval(async () => {
    for (let symbol of symbols) {
      try {
        const quote = await MarketDataService.fetchStockQuote(symbol);

        let recommendation = "";
        if (quote.change > 0)
          recommendation = `Buy ${symbol} – bullish trend (+${quote.changePercent.toFixed(
            2
          )}%)`;
        else if (quote.change < 0)
          recommendation = `Sell ${symbol} – bearish trend (${quote.changePercent.toFixed(
            2
          )}%)`;
        else recommendation = `Hold ${symbol} – no significant change`;

        io.emit("ai_recommendation", recommendation);
        console.log("AI recommendation emitted:", recommendation);
      } catch (err) {
        if (err.message === "STOCK_NOT_FOUND") {
          console.warn(`Symbol not found: ${symbol}`);
        } else {
          console.error("Error generating recommendation:", err.message);
        }
      }
    }
  }, 10000);
}

module.exports = { startAiRecommendation };
