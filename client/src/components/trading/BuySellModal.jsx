import { useEffect, useState } from "react";
// 1. Import the REAL apiService function and portfolio store
import { placeTrade } from "../../services/apiService";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { useMarketStore } from "../../stores/marketStore";

// 2. The component now needs to be told which symbol to trade via props
export default function BuySellModal({ open, onClose, symbol }) {
  // Get the latest price for the selected symbol from our real marketStore
  const getPrice = useMarketStore((s) => {
    const stock = s.featuredStocks.find((f) => f.symbol === symbol);
    return stock ? stock.price : null;
  });
  const price = getPrice;

  // Get the action to manually refresh the portfolio after a trade
  const fetchPortfolio = usePortfolioStore((s) => s.fetchPortfolio);

  const [side, setSide] = useState("BUY");
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Reset the form state whenever the modal is opened
  useEffect(() => {
    if (open) {
      setSide("BUY");
      setQty(1);
      setError("");
      setSuccess("");
    }
  }, [open]);

  if (!open) return null;

  const handleConfirm = async () => {
    if (!symbol || !qty || qty <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // 3. Call the REAL backend API
      await placeTrade({ symbol, quantity: qty, type: side });
      setSuccess(`Trade successful!`);
      // Manually refresh portfolio data as a fallback to the socket
      fetchPortfolio();
      // Close the modal after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
      setIsLoading(false);
    }
    // Don't set isLoading to false on success, as the modal will close
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg">
        <div className="font-semibold mb-3 text-lg">New Order: {symbol}</div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              className={
                "rounded-xl px-3 py-2 border " +
                (side === "BUY"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "border-gray-200")
              }
              onClick={() => setSide("BUY")}
            >
              Buy
            </button>
            <button
              className={
                "rounded-xl px-3 py-2 border " +
                (side === "SELL"
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : "border-gray-200")
              }
              onClick={() => setSide("SELL")}
            >
              Sell
            </button>
          </div>
          <div className="text-sm">
            Market Price:{" "}
            <span className="font-medium">
              {price ? `$${price.toFixed(2)}` : "Loading..."}
            </span>
          </div>
          <div className="text-sm grid grid-cols-2 gap-2 items-center">
            <label>Quantity</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, +e.target.value))}
              className="rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>
          <div className="text-sm">
            Estimated Total:{" "}
            <span className="font-medium">
              {price ? `$${(price * qty).toFixed(2)}` : "..."}
            </span>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-3 py-2 rounded-xl bg-indigo-600 text-white disabled:bg-gray-400"
            >
              {isLoading ? "Processing..." : "Confirm"}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
