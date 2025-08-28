import React from "react";
import Card from "../ui/Card";
// 1. Import the portfolio store to get the trade history AND the loading state
import { usePortfolioStore } from "../../stores/portfolioStore";
import { formatCurrency } from "../../utils/formatters";

export default function TradeTable() {
  // 2. Get both the tradeHistory array and the isLoading flag from the store
  const { tradeHistory, isLoading } = usePortfolioStore();

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  // --- THIS IS THE FIX ---
  // 3. If the portfolio is still loading, show a simple loading message.
  if (isLoading) {
    return (
      <Card>
        <div className="font-semibold text-gray-800 mb-2">Recent Trades</div>
        <p className="text-sm text-gray-500 text-center py-4">
          Loading trade history...
        </p>
      </Card>
    );
  }

  // 4. If loading is done but there are no trades, show the empty message.
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

  // 5. If we get here, it's safe to render the table because we know tradeHistory is an array.
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
