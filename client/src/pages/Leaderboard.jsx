import { useEffect, useMemo } from "react";
import Card from "../components/ui/Card";
import SectionHeader from "../components/ui/SectionHeader";
import Podium from "../components/leaderboard/Podium";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
// 1. IMPORT the real store
import { useLeaderboardStore } from "../stores/leaderboardStore";
// 2. REMOVE the old mock data import
// import { startLeaderboardAutoTick } from "../stores/leaderboardStore";

export default function Leaderboard() {
  // 3. GET the real data and loading state from our store
  const players = useLeaderboardStore((s) => s.players);
  const fetchLeaderboard = useLeaderboardStore((s) => s.fetchLeaderboard);

  // 4. REMOVE the timeframe state, as our backend doesn't support it yet.
  // We will rank by total portfolio value, which is what the backend provides.
  // const [tf, setTf] = useState("30D");

  // 5. REPLACE the old useEffect with one that fetches REAL data
  useEffect(() => {
    // When the page loads, fetch the initial leaderboard.
    // Live updates will be handled automatically by the socket connection.
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // 6. UPDATE the logic for top3 to match our real data structure
  const top3 = useMemo(() => {
    return [...players].slice(0, 3).map((p) => ({
      name: p.username,
      avatar: p.avatar,
      // The "pnl" will be their total portfolio value for the podium display
      pnl: p.portfolioValue,
    }));
  }, [players]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Leaderboard</h1>
          <p className="text-sm text-gray-500">
            Top performers by portfolio value
          </p>
        </div>
      </div>

      {/* We can remove the timeframe tabs for now */}
      <SectionHeader title="Top Performers" />

      <Podium top={top3} />

      {/* The LeaderboardTable component will also need to be updated to use the new data structure */}
      <LeaderboardTable />
    </div>
  );
}
