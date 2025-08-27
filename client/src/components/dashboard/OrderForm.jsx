import React, { useState } from "react";
import { placeTrade } from "../../services/apiService";
import { usePortfolioStore } from "../../stores/portfolioStore";

// 1. Define the list of stocks that can be traded.
const TRADEABLE_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "JPM", name: "JPMorgan Chase" },
  { symbol: "V", name: "Visa Inc." },
];

function OrderForm() {
  // 2. Set the default symbol to the first stock in our list.
  const [symbol, setSymbol] = useState(TRADEABLE_STOCKS[0].symbol);
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("BUY");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol || !quantity || parseInt(quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const tradeDetails = { symbol, quantity: parseInt(quantity), type };
      await placeTrade(tradeDetails);
      setSuccess(
        `${type} order for ${quantity} shares of ${symbol} successful!`
      );
      setQuantity(""); // Only clear quantity on success
      fetchPortfolio();
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred during the trade."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Place an Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="symbol"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Stock Symbol
          </label>
          {/* 3. Replace the text input with a select dropdown */}
          <select
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TRADEABLE_STOCKS.map((stock) => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Order Type
          </label>
          <div className="flex rounded-lg bg-gray-700 p-1">
            <button
              type="button"
              onClick={() => setType("BUY")}
              className={`w-1/2 py-2 rounded-md font-semibold transition ${
                type === "BUY" ? "bg-green-500 text-white" : "text-gray-300"
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setType("SELL")}
              className={`w-1/2 py-2 rounded-md font-semibold transition ${
                type === "SELL" ? "bg-red-500 text-white" : "text-gray-300"
              }`}
            >
              SELL
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-400 text-center mb-4">{success}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:bg-gray-500"
        >
          {isLoading ? "Executing..." : "Execute Trade"}
        </button>
      </form>
    </div>
  );
}

export default OrderForm;
