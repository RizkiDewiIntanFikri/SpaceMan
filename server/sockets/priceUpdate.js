import { getStockPrice } from "../services/marketDataService.js";

export function registerPriceUpdates(socket) {
  socket.on("subscribeStock", async (symbol) => {
    console.log(`Subscribing ${socket.id} to ${symbol}`);

    // fetch harga tiap 5 detik
    const interval = setInterval(async () => {
      const priceData = await getStockPrice(symbol);
      socket.emit("priceUpdate", priceData);
    }, 5000);

    socket.on("unsubscribeStock", () => {
      clearInterval(interval);
    });
  });
}
