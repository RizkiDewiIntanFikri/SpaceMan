import { useMemo, useState } from "react";
import Card from "../ui/Card";
import { useMarketStore } from "../../stores/marketStore";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { placeTrade as placeTradeApi } from "../../services/apiService";
import { formatCurrency } from "../../utils/formatters";

// 1. Define the list of stocks that can be traded.
const TRADEABLE_STOCKS = [
  "AAPL",
  "GOOGL",
  "AMZN",
  "MSFT",
  "NVDA",
  "TSLA",
  "META",
  "NFLX",
];

// 2. The component now receives the selected symbol and a handler from its parent
export default function TradeTicket({ selectedSymbol, onSymbolChange }) {
  const featuredStocks = useMarketStore((s) => s.featuredStocks);
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const fetchPortfolio = usePortfolioStore((s) => s.fetchPortfolio);

  // UI State (no longer includes 'symbol')
  const [side, setSide] = useState("BUY");
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Derived values from state
  const price = useMemo(() => {
    return featuredStocks?.find((f) => f.symbol === selectedSymbol)?.price ?? 0;
  }, [featuredStocks, selectedSymbol]);

  const amount = (Number(qty) || 0) * price;
  const cash = portfolio?.cashBalance || 0;
  const currentHolding =
    portfolio?.Holdings?.find((h) => h.symbol === selectedSymbol)?.quantity ||
    0;
  const canBuy = cash >= amount;
  const canSell = currentHolding >= (Number(qty) || 0);

  async function submit(e) {
    e.preventDefault();
    if (!selectedSymbol) return;
    const nQty = Math.max(1, Math.floor(Number(qty) || 0));
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      await placeTradeApi({
        symbol: selectedSymbol,
        quantity: nQty,
        type: side,
      });
      setSuccess(`Market ${side} order for ${nQty} ${selectedSymbol} filled!`);
      fetchPortfolio();
    } catch (err) {
      setError(err.response?.data?.error || "Trade failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <div className="font-semibold text-gray-800 mb-3">Trade</div>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">Symbol</label>
          {/* 3. The dropdown now uses the props and the static list */}
          <select
            value={selectedSymbol || ""}
            onChange={(e) => onSymbolChange(e.target.value)} // Call the function from the parent
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            {TRADEABLE_STOCKS.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>
        {/* ... the rest of your JSX is correct ... */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSide("BUY")}
            className={`rounded-xl px-3 py-2 border text-sm ${
              side === "BUY"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-gray-200 bg-white"
            }`}
          >
            BUY
          </button>
          <button
            type="button"
            onClick={() => setSide("SELL")}
            className={`rounded-xl px-3 py-2 border text-sm ${
              side === "SELL"
                ? "border-rose-300 bg-rose-50 text-rose-700"
                : "border-gray-200 bg-white"
            }`}
          >
            SELL
          </button>
        </div>
        <div>
          <label className="text-sm text-gray-600">Quantity</label>
          <input
            type="number"
            min="1"
            step="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div className="text-sm text-gray-600">
          Price:{" "}
          <span className="font-medium text-gray-900">
            {formatCurrency(price)}
          </span>
          <span className="mx-2">•</span>
          Amount:{" "}
          <span className="font-medium text-gray-900">
            {formatCurrency(amount)}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Cash:{" "}
          <span className="font-medium text-gray-700">
            {formatCurrency(cash)}
          </span>
          <span className="mx-2">•</span>
          You own {currentHolding} {selectedSymbol}
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="submit"
            disabled={isLoading || (side === "BUY" ? !canBuy : !canSell)}
            className="rounded-xl px-3 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
          >
            {isLoading ? "Processing..." : `Place ${side} Order`}
          </button>
        </div>
      </form>
    </Card>
  );
}
