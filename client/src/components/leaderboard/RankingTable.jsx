import React from "react";
import { useMarketStore } from "../../stores/marketStore";

function RankingTable() {
  const leaderboard = useMarketStore((state) => state.leaderboard);
  const isLoading = useMarketStore((state) => state.isLoading);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  if (isLoading && leaderboard.length === 0) {
    return <p className="text-center text-gray-400">Loading leaderboard...</p>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Top Traders</h2>
      <ul className="space-y-4">
        {leaderboard.map((user, index) => (
          <li
            key={user.username}
            className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
          >
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-400 w-8">
                {index + 1}
              </span>
              <span className="text-lg text-white">{user.username}</span>
            </div>
            <span className="text-lg font-semibold text-green-400">
              {formatCurrency(user.portfolioValue)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RankingTable;
