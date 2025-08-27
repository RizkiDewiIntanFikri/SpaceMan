// StockCard.jsx
import { useMarketStore } from "../../stores/marketStore";

export default function StockCard({ stock, onTrade }) {
  const { symbol, name, logo, price, changePct } = stock;

  return (
    <div className="border rounded-2xl p-4 bg-white">
      <div className="flex justify-between items-center mb-2">
        <div>
          {logo} {name}
        </div>
        <div className={changePct >= 0 ? "text-green-600" : "text-red-600"}>
          {price.toFixed(2)} ({changePct.toFixed(2)}%)
        </div>
      </div>
      <button
        className="mt-2 w-full py-1 rounded-xl border bg-gray-100"
        onClick={() => onTrade(symbol, price)}
      >
        Buy/Sell
      </button>
    </div>
  );
}
