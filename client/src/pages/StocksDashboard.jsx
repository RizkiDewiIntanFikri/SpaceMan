import React, { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

// 1. REMOVE the old mock data imports
// import { useMarketStore, startMarketAutoTick } from "../stores/marketStore";
// import { usePortfolioStore, startPortfolioAutoRecalc } from "../stores/portfolioStore";
// import { startWatchlistEngine } from "../stores/watchlistStore";

// 2. IMPORT the real data stores
import { useMarketStore } from "../stores/marketStore";
import { usePortfolioStore } from "../stores/portfolioStore";
// We might need the leaderboard store here as well if we add it to this page
// import { useLeaderboardStore } from "../stores/leaderboardStore";

import Card from "../components/ui/Card";
import SectionHeader from "../components/ui/SectionHeader";
import MetricCard from "../components/metrics/MetricCard";
import PortfolioAreaChart from "../components/charts/PortfolioAreaChart";
import DividendBarChart from "../components/charts/DividendBarChart";
import WatchlistTable from "../components/watchlist/WatchlistTable";
import TrendingStocks from "../components/market/TrendingStocks";
import { formatCurrency } from "../utils/formatters";

export default function StocksDashboard() {
  // 3. UPDATE the state selectors to match our real stores
  const featuredStocks = useMarketStore((s) => s.featuredStocks);
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const perfSeries = portfolio?.performance || []; // Get performance data safely

  // Get the data fetching actions from our stores
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio);
  // We may also need fetchLeaderboard if we add it here
  // const fetchLeaderboard = useLeaderboardStore((state) => state.fetchLeaderboard);

  const [range, setRange] = useState("Monthly");

  // 4. REPLACE the old useEffect with one that fetches REAL data
  useEffect(() => {
    // When this dashboard loads, fetch the initial portfolio state.
    // The live market data will come in via the socket automatically.
    fetchPortfolio();
    // fetchLeaderboard(); // Uncomment if you add the leaderboard to this page
  }, [fetchPortfolio]); // Dependency array

  // chart data (this can largely stay the same)
  const areaData = useMemo(() => {
    const arr = (perfSeries?.length ? perfSeries : []).slice(-30);
    return arr.map((y, i) => ({ name: i + 1, value: Math.max(0, y) }));
  }, [perfSeries]);

  const dividendData = [
    { name: "Jan", value: 150 },
    { name: "Feb", value: 380 },
    { name: "Mar", value: 120 },
    { name: "Apr", value: 300 },
    { name: "May", value: 180 },
    { name: "Jun", value: 220 },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Top bar can stay the same */}
      <div className="flex items-center justify-between mb-6">{/* ... */}</div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {(featuredStocks || []).slice(0, 4).map((s) => (
          <MetricCard
            key={s.symbol}
            // Use the first letter of the symbol as a simple placeholder logo
            logo={s.symbol.charAt(0)}
            // Use the symbol for the title and subtitle since we don't have the full name here
            title={s.symbol}
            subtitle={`Data for ${s.symbol}`}
            // The price and changePercent from our real data map perfectly
            price={s.price}
            changePct={s.changePercent}
          />
        ))}
      </div>

      {/* Performance + Dividend (atas) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <SectionHeader
            title="Portfolio Performance"
            tabs={["Monthly", "Quarterly", "Annually"]}
            active={range}
            onChange={setRange}
          />
          <PortfolioAreaChart data={areaData} />
        </Card>
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-gray-800">Dividend</div>
              <button className="text-gray-500 text-sm inline-flex items-center gap-1">
                Details <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <DividendBarChart data={dividendData} />
          </Card>
        </div>
      </div>

      {/* Watchlist + Trending (bawah) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <div className="xl:col-span-2 space-y-4">
          <WatchlistTable />
        </div>
        <div className="space-y-4">
          <TrendingStocks />
        </div>
      </div>

      {/* Bottom summary cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <Card className="xl:col-span-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">Cash Balance</div>
              <div className="text-lg font-semibold">
                {formatCurrency(portfolio?.cashBalance || 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Total Value</div>
              <div className="text-lg font-semibold">
                {formatCurrency(portfolio?.totalValue || 0)}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-gray-500">P&L</div>
              <div
                className={`text-sm font-medium ${
                  portfolio?.pnlPct >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {portfolio?.pnlPct >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(portfolio?.pnlPct || 0).toFixed(2)}%
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
