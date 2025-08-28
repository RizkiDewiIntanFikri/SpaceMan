import { useEffect, useState, useMemo } from "react";
import { useMarketStore, startMarketAutoTick } from "../stores/marketStore";
import { startPortfolioAutoRecalc } from "../stores/portfolioStore";
import { startWatchlistEngine } from "../stores/watchlistStore";

import StockCard from "../components/trading/StockCard";
import PortfolioCard from "../components/trading/PortfolioCard";
import TradeTable from "../components/trading/TradeTable";
import BuySellModal from "../components/trading/BuySellModal";
import StockLine from "../components/charts/StockLine";
import PortfolioArea from "../components/charts/PortfolioArea";

import WatchlistTable from "../components/watchlist/WatchlistTable";
import TrendingStocks from "../components/market/TrendingStocks";

export default function LandingPage() {
  const stocks = useMarketStore((s) => s.featured);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    const stopM = startMarketAutoTick(2000);
    const stopP = startPortfolioAutoRecalc();
    const stopW = startWatchlistEngine();
    return () => {
      stopM?.();
      stopP?.();
      stopW?.();
    };
  }, []);

  const topStocks = useMemo(() => (stocks || []).slice(0, 5), [stocks]);

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-4 space-y-5">
      {/* Top Stocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {topStocks.map((s) => (
          <StockCard key={s.symbol} stock={s} />
        ))}
      </div>

      {/* Stock Chart + Buy/Sell */}
      <div className="rounded-2xl border border-gray-200 bg-white p-3">
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

      {/* Portfolio Performance + Trade History */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-3 xl:col-span-2">
          <div className="font-semibold mb-2">Portfolio</div>
          <PortfolioArea />
        </div>
        <TradeTable />
      </div>

      {/* Watchlist + Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {/* Watchlist kiri */}
        <div className="xl:col-span-2 space-y-3">
          <WatchlistTable />
        </div>

        {/* Sidebar kanan */}
        <div className="space-y-3 xl:sticky xl:top-16">
          <TrendingStocks />
          <PortfolioCard />
        </div>
      </div>

      <BuySellModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
