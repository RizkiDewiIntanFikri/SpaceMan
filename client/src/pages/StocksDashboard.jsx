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
import BuySellModal from "../components/trading/BuySellModal"; // Import the missing modal
import { formatCurrency } from "../utils/formatters";

export default function StocksDashboard() {
  // State for controlling the trading modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  // Get live data from our backend-connected stores
  const featuredStocks = useMarketStore((s) => s.featuredStocks);
  const portfolio = usePortfolioStore((s) => s.portfolio);

  // Get data fetching actions from stores
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio);

  // State for the chart range selector
  const [range, setRange] = useState("Monthly");

  // Fetch initial data when the component loads
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  // Memoized data for charts
  const areaData = useMemo(() => {
    const perfSeries = portfolio?.performance || [];
    const arr = (perfSeries.length ? perfSeries : []).slice(-30);
    return arr.map((y, i) => ({ name: i + 1, value: Math.max(0, y) }));
  }, [portfolio]);

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

  // Function to open the trading modal with the correct stock
  const handleOpenModal = (symbol) => {
    setSelectedSymbol(symbol);
    setIsModalOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {(featuredStocks || []).slice(0, 4).map((s) => (
          // Add onClick to open the modal when a card is clicked
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
        ))}
      </div>

      {/* Performance + Dividend Charts */}
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

      {/* RENDER THE MODAL HERE */}
      <BuySellModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        symbol={selectedSymbol}
      />
    </div>
  );
}
