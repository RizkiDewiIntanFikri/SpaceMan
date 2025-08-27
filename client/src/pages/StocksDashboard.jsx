import React, { useEffect, useMemo, useState } from "react";
import { Search, Bell, Moon, ChevronRight } from "lucide-react";
import { useMarketStore, startMarketAutoTick } from "../stores/marketStore";
import { usePortfolioStore, startPortfolioAutoRecalc } from "../stores/portfolioStore";
import Card from "../components/ui/Card";
import SectionHeader from "../components/ui/SectionHeader";
import WatchItem from "../components/ui/WatchItem";
import MetricCard from "../components/metrics/MetricCard";
import PortfolioAreaChart from "../components/charts/PortfolioAreaChart";
import DividendBarChart from "../components/charts/DividendBarChart";
import { formatCurrency } from "../utils/formatters";

export default function StocksDashboard() {
  const featured = useMarketStore((s) => s.featured);
  const cashBalance = usePortfolioStore((s) => s.cashBalance);
  const totalValue  = usePortfolioStore((s) => s.totalValue);
  const pnlPct      = usePortfolioStore((s) => s.pnlPct);
  const perfSeries  = usePortfolioStore((s) => s.performance);
  const [range, setRange] = useState("Monthly");

  useEffect(() => {
    const stopM = startMarketAutoTick(2000);
    const stopP = startPortfolioAutoRecalc();
    return () => { stopM?.(); stopP?.(); };
  }, []);

  const areaData = useMemo(() => {
    const arr = (perfSeries?.length ? perfSeries : Array.from({ length: 30 }, (_, i) => 30000 + i*180 + (Math.random()-0.5)*600)).slice(-30);
    return arr.map((y, i) => ({ name: i+1, value: Math.max(0, y) }));
  }, [perfSeries]);

  const dividendData = [
    { name: "Jan", value: 150 }, { name: "Feb", value: 380 }, { name: "Mar", value: 120 },
    { name: "Apr", value: 300 }, { name: "May", value: 180 }, { name: "Jun", value: 220 },
  ];

  const watch = useMemo(() => {
    const mapName = (sym) =>
      sym==="AAPL"?"Apple, Inc": sym==="GOOGL"?"Alphabet, Inc": sym==="AMZN"?"Amazon.com, Inc": sym==="MSFT"?"Microsoft, Inc": sym==="NVDA"?"NVIDIA Corp": sym;
    return (featured || []).slice(0, 6).map((f) => ({
      badge: f.logo, name: f.symbol, company: mapName(f.symbol), price: f.price, changePct: f.changePct,
    }));
  }, [featured]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button className="lg:hidden rounded-xl border border-gray-200 p-2 bg-white">☰</button>
          <div className="relative w-72 max-w-[60vw]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              placeholder="Search or type command…"
              className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-gray-300"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-xl border border-gray-200 bg-white p-2"><Moon className="h-4 w-4" /></button>
          <button className="rounded-xl border border-gray-200 bg-white p-2"><Bell className="h-4 w-4" /></button>
          <img src="https://i.pravatar.cc/40?img=13" alt="avatar" className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {(featured || []).slice(0, 4).map((s) => (
          <MetricCard key={s.symbol} logo={s.logo} title={s.name} subtitle={s.name} price={s.price} changePct={s.changePct} />
        ))}
      </div>

      {/* Area + Dividend + Watchlist */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <SectionHeader title="Portfolio Performance" tabs={["Monthly","Quarterly","Annually"]} active={range} onChange={setRange} />
          <PortfolioAreaChart data={areaData} />
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-gray-800">Dividend</div>
              <button className="text-gray-500 text-sm inline-flex items-center gap-1">Details <ChevronRight className="h-4 w-4" /></button>
            </div>
            <DividendBarChart data={dividendData} />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-800">My Watchlist</div>
              <button className="text-gray-500 text-sm inline-flex items-center gap-1">Manage <ChevronRight className="h-4 w-4" /></button>
            </div>
            <div className="divide-y divide-gray-100">
              {watch.map((w) => <WatchItem key={w.name} {...w} />)}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <Card className="xl:col-span-1">
          <div className="font-semibold text-gray-800 mb-2">Portfolio Summary</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">Cash Balance</div>
              <div className="text-lg font-semibold">{formatCurrency(cashBalance)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Total Value</div>
              <div className="text-lg font-semibold">{formatCurrency(totalValue)}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-gray-500">P&L</div>
              <div className={`text-sm font-medium ${pnlPct >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {pnlPct >= 0 ? "▲" : "▼"} {Math.abs(pnlPct || 0).toFixed(2)}%
              </div>
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <div className="font-semibold text-gray-800 mb-2">Notes</div>
          <p className="text-sm text-gray-600">
            ---
          </p>
        </Card>
      </div>
    </div>
  );
}
