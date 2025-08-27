import React from "react";
import { usePortfolioStore } from "../../stores/portfolioStore";

function Holdings() {
  const portfolio = usePortfolioStore((state) => state.portfolio);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  if (!portfolio || !portfolio.Holdings || portfolio.Holdings.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-bold text-white mb-2">My Holdings</h3>
        <p className="text-gray-400">You do not currently own any stocks.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">My Holdings</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-2">Symbol</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Avg. Price</th>
              <th className="p-2">Current Price</th>
              <th className="p-2">Market Value</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.Holdings.map((holding) => (
              <tr key={holding.symbol} className="border-b border-gray-700">
                <td className="p-2 font-bold">{holding.symbol}</td>
                <td className="p-2">{holding.quantity}</td>
                <td className="p-2">{formatCurrency(holding.avgPrice)}</td>
                <td className="p-2">{formatCurrency(holding.currentPrice)}</td>
                <td className="p-2 font-semibold">
                  {formatCurrency(holding.marketValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Holdings;
