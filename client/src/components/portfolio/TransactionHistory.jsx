import React from "react";
import { usePortfolioStore } from "../../stores/portfolioStore";

function TransactionHistory() {
  const tradeHistory = usePortfolioStore((state) => state.tradeHistory);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  if (!tradeHistory || tradeHistory.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center mt-6">
        <h3 className="text-xl font-bold text-white mb-2">
          Transaction History
        </h3>
        <p className="text-gray-400">You have not made any trades yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-xl font-bold text-white mb-4">Transaction History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Type</th>
              <th className="p-2">Symbol</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Price</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {tradeHistory.map((trade) => (
              <tr key={trade.id} className="border-b border-gray-700">
                <td className="p-2 text-sm text-gray-400">
                  {formatDate(trade.timestamp)}
                </td>
                <td
                  className={`p-2 font-bold ${
                    trade.type === "BUY" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {trade.type}
                </td>
                <td className="p-2 font-bold">{trade.symbol}</td>
                <td className="p-2">{trade.quantity}</td>
                <td className="p-2">{formatCurrency(trade.price)}</td>
                <td className="p-2">{formatCurrency(trade.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionHistory;
