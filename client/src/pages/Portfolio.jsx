import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card";
import SectionHeader from "../components/ui/SectionHeader";
import PortfolioAreaChart from "../components/charts/PortfolioAreaChart";
import AllocationDonut from "../components/portfolio/AllocationDonut";
import HoldingsTable from "../components/portfolio/HoldingsTable";
import TradeTable from "../components/portfolio/TradeTable";
import BuySellModal from "../components/portfolio/BuySellModal";
import { usePortfolioStore, startPortfolioAutoRecalc } from "../stores/portfolioStore";
import { startMarketAutoTick } from "../stores/marketStore";
import { formatCurrency } from "../utils/formatters";

export default function Portfolio() {
  const cashBalance = usePortfolioStore(s => s.cashBalance);
  const totalValue  = usePortfolioStore(s => s.totalValue);
  const pnlPct      = usePortfolioStore(s => s.pnlPct);
  const perfSeries  = usePortfolioStore(s => s.performance);

  const [range, setRange] = useState("Monthly");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stopM = startMarketAutoTick(2000);
    const stopP = startPortfolioAutoRecalc();
    return () => { stopM?.(); stopP?.(); };
  }, []);

  const areaData = useMemo(() => {
    const arr = (perfSeries?.length ? perfSeries : Array.from({ length: 30 }, (_, i) => 30000 + i*180 + (Math.random()-0.5)*600)).slice(-30);
    return arr.map((y, i) => ({ name: i+1, value: Math.max(0, y) }));
  }, [perfSeries]);

  const up = (pnlPct ?? 0) >= 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header + quick actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Portfolio</h1>
          <p className="text-sm text-gray-500">Track your performance and manage positions</p>
        </div>
        <button onClick={() => setOpen(true)} className="rounded-xl px-4 py-2 text-sm text-white bg-brand-600 hover:bg-brand-500">Buy / Sell</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-xs text-gray-500">Cash Balance</div>
          <div className="mt-1 text-2xl font-semibold">{formatCurrency(cashBalance)}</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-500">Total Value</div>
          <div className="mt-1 text-2xl font-semibold">{formatCurrency(totalValue)}</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-500">P&amp;L</div>
          <div className={`mt-1 text-lg font-medium ${up ? "text-emerald-600" : "text-rose-600"}`}>
            {up ? "▲" : "▼"} {Math.abs(pnlPct || 0).toFixed(2)}%
          </div>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <SectionHeader title="Portfolio Performance" tabs={["Monthly","Quarterly","Annually"]} active={range} onChange={setRange} />
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
          <HoldingsTable />
        </Card>
        <Card>
          <div className="font-semibold text-gray-800 mb-3">Recent Trades</div>
          <TradeTable />
        </Card>
      </div>

      <BuySellModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
