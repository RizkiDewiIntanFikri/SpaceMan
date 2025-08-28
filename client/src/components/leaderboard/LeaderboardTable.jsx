import React from "react";
import Card from "../ui/Card";
import { useLeaderboardStore } from "../../stores/leaderboardStore";
import { formatCurrency } from "../../utils/formatters";

// 1. Simplify the table headers to match our real data
const heads = [
  { key: "rank", label: "#" },
  { key: "player", label: "Player" },
  { key: "value", label: "Total Value" },
];

export default function LeaderboardTable() {
  // 2. Get the real player data. It's already sorted by the backend.
  const players = useLeaderboardStore((s) => s.players);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-gray-800">Full Leaderboard</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              {heads.map((h) => (
                <th key={h.key} className="py-2 pr-4 font-medium">
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {players.map((player, index) => (
              <tr key={player.id} className="align-middle">
                <td className="py-2 pr-4 text-gray-500">{index + 1}</td>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={player.avatar}
                      alt={player.username}
                      className="h-8 w-8 rounded-full"
                    />
                    {/* 3. Use the correct property 'username' */}
                    <div className="font-medium text-gray-800">
                      {player.username}
                    </div>
                  </div>
                </td>
                <td className="py-2 pr-4 font-semibold">
                  {formatCurrency(player.portfolioValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
