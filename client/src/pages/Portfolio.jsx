import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import SectionHeader from "../components/ui/SectionHeader";
import PortfolioAreaChart from "../components/charts/PortfolioAreaChart";
import AllocationDonut from "../components/portfolio/AllocationDonut";
import HoldingsTable from "../components/portfolio/HoldingsTable";
import TradeTable from "../components/portfolio/TradeTable";
import BuySellModal from "../components/portfolio/BuySellModal";
// 1. IMPORT the real portfolio store
import { usePortfolioStore } from "../stores/portfolioStore";
// 2. REMOVE the old mock data imports
// import { startPortfolioAutoRecalc } from "../stores/portfolioStore";
// import { startMarketAutoTick } from "../stores/marketStore";
import { formatCurrency } from "../utils/formatters";

export default function Portfolio() {
  // 3. GET the entire portfolio object and loading state from our real store
  const { portfolio, isLoading } = usePortfolioStore();

  const [range, setRange] = useState("Monthly");
  const [open, setOpen] = useState(false);

  // 4. REMOVE the useEffect that starts the mock data engines
  // useEffect(() => {
  //   const stopM = startMarketAutoTick(2000);
  //   const stopP = startPortfolioAutoRecalc();
  //   return () => { stopM?.(); stopP?.(); };
  // }, []);

  // We can still use mock data for the chart for now
  const areaData = useMemo(() => {
    const series =
      portfolio?.performance && portfolio.performance.length
        ? portfolio.performance
        : Array.from(
            { length: 30 },
            (_, i) => 30000 + i * 180 + (Math.random() - 0.5) * 600
          );
    return series
      .slice(-30)
      .map((y, i) => ({ name: i + 1, value: Math.max(0, y) }));
  }, [portfolio]);

  // Calculate P&L on the fly from real data
  const pnl = portfolio ? ((portfolio.totalValue - 100000) / 100000) * 100 : 0;
  const up = pnl >= 0;

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen text-center">
        Loading Portfolio...
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header + quick actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Portfolio</h1>
          <p className="text-sm text-gray-500">
            Track your performance and manage positions
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-500"
        >
          Buy / Sell
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-xs text-gray-500">Cash Balance</div>
          <div className="mt-1 text-2xl font-semibold">
            {formatCurrency(portfolio?.cashBalance || 0)}
          </div>
        </Card>
        <Card>
          <div className="text-xs text-gray-500">Total Value</div>
          <div className="mt-1 text-2xl font-semibold">
            {formatCurrency(portfolio?.totalValue || 0)}
          </div>
        </Card>
        <Card>
          <div className="text-xs text-gray-500">P&amp;L</div>
          <div
            className={`mt-1 text-lg font-medium ${
              up ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {up ? "▲" : "▼"} {Math.abs(pnl).toFixed(2)}%
          </div>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <SectionHeader
            title="Portfolio Performance"
            tabs={["Monthly", "Quarterly", "Annually"]}
            active={range}
            onChange={setRange}
          />
          <PortfolioAreaChart data={areaData} />
        </Card>
        <Card>
          <div className="font-semibold text-gray-800 mb-3">Allocation</div>
          <AllocationDonut />
        </Card>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <div className="font-semibold text-gray-800 mb-3">Holdings</div>
          {/* HoldingsTable will now get its data from the store */}
          <HoldingsTable />
        </Card>
        <Card>
          <div className="font-semibold text-gray-800 mb-3">Recent Trades</div>
          {/* TradeTable will now get its data from the store */}
          <TradeTable />
        </Card>
      </div>

      {/* The modal needs to be passed a symbol to trade */}
      <BuySellModal open={open} onClose={() => setOpen(false)} symbol="AAPL" />
    </div>
  );
}
