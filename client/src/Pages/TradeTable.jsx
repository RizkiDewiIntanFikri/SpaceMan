import React from "react";
// 1. Import the portfolio store to get the trade history
import { usePortfolioStore } from "../../stores/portfolioStore";
import Card from "../ui/Card"; // Assuming you have a Card component for consistent styling
import { formatCurrency } from "../../utils/formatters";

export default function TradeTable() {
  // 2. Get the tradeHistory array directly from our Zustand store
  const tradeHistory = usePortfolioStore((state) => state.tradeHistory);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  // Handle the case where there are no trades yet
  if (!tradeHistory || tradeHistory.length === 0) {
    return (
      <Card>
        <div className="font-semibold text-gray-800 mb-2">Recent Trades</div>
        <p className="text-sm text-gray-500 text-center py-4">
          No trades have been executed yet.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="font-semibold text-gray-800 mb-2">Recent Trades</div>
      <div className="max-h-[400px] overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th className="p-2 font-medium">Symbol</th>
              <th className="p-2 font-medium">Type</th>
              <th className="p-2 font-medium">Quantity</th>
              <th className="p-2 font-medium">Price</th>
              <th className="p-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tradeHistory.map((trade) => (
              <tr key={trade.id}>
                <td className="p-2 font-semibold">{trade.symbol}</td>
                <td
                  className={`p-2 font-semibold ${
                    trade.type === "BUY" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {trade.type}
                </td>
                <td className="p-2">{trade.quantity}</td>
                <td className="p-2">{formatCurrency(trade.price)}</td>
                <td className="p-2 text-xs text-gray-500">
                  {formatDate(trade.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
