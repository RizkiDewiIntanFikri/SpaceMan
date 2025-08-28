import { useEffect, useState } from "react";
// 1. Import the REAL data stores we need
import { useMarketStore } from "../stores/marketStore";
import { usePortfolioStore } from "../stores/portfolioStore";
import { useLeaderboardStore } from "../stores/leaderboardStore"; // Import the new leaderboard store

// (The old mock data functions are no longer needed)
// import { startMarketAutoTick } from "../stores/marketStore";
// import { startPortfolioAutoRecalc } from "../stores/portfolioStore";

import StockCard from "../components/trading/StockCard";
import PortfolioCard from "../components/trading/PortfolioCard";
import TradeTable from "../components/trading/TradeTable";
import BuySellModal from "../components/trading/BuySellModal";
import StockLine from "../components/charts/StockLine";
import PortfolioArea from "../components/charts/PortfolioArea";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable"; // Assuming this is the new name for the leaderboard component

export default function Dashboard() {
  // 2. Get the real data from our backend-connected stores
  // Note: The property is now 'featuredStocks' in our new marketStore
  const stocks = useMarketStore((s) => s.featuredStocks);
  const [open, setOpen] = useState(false);

  // 3. Get the REAL data-fetching actions from our stores
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio);
  const fetchLeaderboard = useLeaderboardStore(
    (state) => state.fetchLeaderboard
  );

  // 4. This useEffect hook replaces the mock data engine.
  // It runs once when the dashboard loads to get the initial state.
  useEffect(() => {
    fetchPortfolio();
    fetchLeaderboard();
    // After this, all live updates are handled by the socketService.
  }, [fetchPortfolio, fetchLeaderboard]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* This will be empty at first, then populate with live data from the socket */}
        {stocks.map((s) => (
          <StockCard key={s.symbol} stock={s} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Stock Chart</div>
            <button
              className="rounded-xl border border-gray-200 px-3 py-1 text-sm"
              onClick={() => setOpen(true)}
            >
              Buy/Sell
            </button>
          </div>
          <StockLine />
        </div>
        {/* The PortfolioCard will now get its data from the portfolioStore */}
        <PortfolioCard />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 xl:col-span-2">
          <div className="font-semibold mb-2">Portfolio</div>
          <PortfolioArea />
        </div>
        {/* The TradeTable will need to be updated to use the portfolioStore */}
        <TradeTable />
      </div>

      {/* This component will need to be updated to call our real backend API */}
      <BuySellModal open={open} onClose={() => setOpen(false)} />

      {/* A new section for the leaderboard */}
      <div>
        <LeaderboardTable />
      </div>
    </div>
  );
}
