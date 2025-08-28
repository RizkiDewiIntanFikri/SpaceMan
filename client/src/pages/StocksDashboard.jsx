import React, { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

// Import real data stores
import { useMarketStore } from "../stores/marketStore";
import { usePortfolioStore } from "../stores/portfolioStore";

// Import UI components
import Card from "../components/ui/Card";
import SectionHeader from "../components/ui/SectionHeader";
import MetricCard from "../components/metrics/MetricCard";
import PortfolioAreaChart from "../components/charts/PortfolioAreaChart";
import DividendBarChart from "../components/charts/DividendBarChart";
import WatchlistTable from "../components/watchlist/WatchlistTable";
import TrendingStocks from "../components/market/TrendingStocks";
import BuySellModal from "../components/trading/BuySellModal";
import { formatCurrency } from "../utils/formatters";

export default function StocksDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

 
  const featuredStocks = useMarketStore((s) => s.featuredStocks);
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio);

  const [range, setRange] = useState("Monthly");

  useEffect(() => {
    // Fetch the user's portfolio once when the page loads.
    // The market data will arrive automatically via the socket.
    fetchPortfolio();
  }, [fetchPortfolio]);

  const dividendData = useMemo(
    () => [
      { name: "Jan", value: 150 },
      { name: "Feb", value: 380 },
      { name: "Mar", value: 120 },
      { name: "Apr", value: 300 },
      { name: "May", value: 180 },
      { name: "Jun", value: 220 },
    ],
    []
  );

  const handleOpenModal = (symbol) => {
    setSelectedSymbol(symbol);
    setIsModalOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* 2. Add a loading/empty state for a better user experience */}
        {featuredStocks && featuredStocks.length > 0 ? (
          featuredStocks.slice(0, 4).map((s) => (
            <div
              key={s.symbol}
              onClick={() => handleOpenModal(s.symbol)}
              className="cursor-pointer"
            >
              <MetricCard
                logo={s.symbol.charAt(0)}
                title={s.symbol}
                subtitle={`Data for ${s.symbol}`}
                price={s.price}
                changePct={s.changePercent}
              />
            </div>
          ))
        ) : (
          // Show a placeholder while waiting for the first socket event
          <div className="col-span-full text-center text-gray-500 py-8">
            Connecting to live market data...
          </div>
        )}
      </div>

      {/* ... The rest of your JSX remains the same ... */}

      {/* Performance + Dividend Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <SectionHeader
            title="Portfolio Performance"
            tabs={["Monthly", "Quarterly", "Annually"]}
            active={range}
            onChange={setRange}
          />
          <PortfolioAreaChart />
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

      {/* Watchlist + Trending Stocks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <div className="xl:col-span-2 space-y-4">
          <WatchlistTable />
        </div>
        <div className="space-y-4">
          <TrendingStocks />
        </div>
      </div>

      {/* Bottom Summary Cards */}
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
              <div className="text-xs text-gray-500">P&L %</div>
              {portfolio &&
                (() => {
                  const pnl = ((portfolio.totalValue - 100000) / 100000) * 100;
                  const isPositive = pnl >= 0;
                  return (
                    <div
                      className={`text-sm font-medium ${
                        isPositive ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isPositive ? "▲" : "▼"} {Math.abs(pnl).toFixed(2)}%
                    </div>
                  );
                })()}
            </div>
          </div>
        </Card>
      </div>

      <BuySellModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        symbol={selectedSymbol}
      />
    </div>
  );
}
