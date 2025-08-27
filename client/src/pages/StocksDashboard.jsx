import React, { useEffect, useMemo, useState } from "react";
import { Search, Bell, Moon, ChevronRight } from "lucide-react";

import { useMarketStore, startMarketAutoTick } from "../stores/marketStore";
import { usePortfolioStore, startPortfolioAutoRecalc } from "../stores/portfolioStore";
import { startWatchlistEngine } from "../stores/watchlistStore";

import Card from "../components/ui/Card";
import SectionHeader from "../components/ui/SectionHeader";
import WatchItem from "../components/ui/WatchItem";
import MetricCard from "../components/metrics/MetricCard";
import PortfolioAreaChart from "../components/charts/PortfolioAreaChart";
import DividendBarChart from "../components/charts/DividendBarChart";

import WatchlistTable from "../components/watchlist/WatchlistTable";
import AlertsCard from "../components/watchlist/AlertsCard";
import WatchlistAdd from "../components/watchlist/WatchlistAdd";
import TrendingStocks from "../components/market/TrendingStocks";

import { formatCurrency } from "../utils/formatters";

export default function StocksDashboard() {
  // Market cards
  const featured = useMarketStore((s) => s.featured);

  // Portfolio numbers (primitive selectors)
  const cashBalance = usePortfolioStore((s) => s.cashBalance);
  const totalValue  = usePortfolioStore((s) => s.totalValue);
  const pnlPct      = usePortfolioStore((s) => s.pnlPct);
  const perfSeries  = usePortfolioStore((s) => s.performance);

  const [range, setRange] = useState("Monthly");

  // start all engines needed on dashboard
  useEffect(() => {
    const stopM = startMarketAutoTick(2000);
    const stopP = startPortfolioAutoRecalc();
    const stopW = startWatchlistEngine();
    return () => { stopM?.(); stopP?.(); stopW?.(); };
  }, []);

  // chart data
  const areaData = useMemo(() => {
    const arr = (perfSeries?.length ? perfSeries : Array.from({ length: 30 }, (_, i) => 30000 + i * 180 + (Math.random() - 0.5) * 600)).slice(-30);
    return arr.map((y, i) => ({ name: i + 1, value: Math.max(0, y) }));
  }, [perfSeries]);

  const dividendData = [
    { name: "Jan", value: 150 }, { name: "Feb", value: 380 }, { name: "Mar", value: 120 },
    { name: "Apr", value: 300 }, { name: "May", value: 180 }, { name: "Jun", value: 220 },
  ];

  // small watch list (for top cards area – optional)
  const quickWatch = useMemo(() => {
    const mapName = (sym) =>
      sym === "AAPL" ? "Apple, Inc" :
      sym === "GOOGL" ? "Alphabet, Inc" :
      sym === "AMZN" ? "Amazon.com, Inc" :
      sym === "MSFT" ? "Microsoft, Inc" :
      sym === "NVDA" ? "NVIDIA Corp" : sym;
    return (featured || []).slice(0, 6).map((f) => ({
      badge: f.logo, name: f.symbol, company: mapName(f.symbol), price: f.price, changePct: f.changePct,
    }));
  }, [featured]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button className="lg:hidden ui-iconbtn">☰</button>
          <div className="relative w-72 max-w-[60vw]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              placeholder="Search or type command…"
              className="ui-search"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="ui-iconbtn"><Moon className="h-4 w-4" /></button>
          <button className="ui-iconbtn"><Bell className="h-4 w-4" /></button>
          <img src="https://i.pravatar.cc/40?img=13" alt="avatar" className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {(featured || []).slice(0, 4).map((s) => (
          <MetricCard
            key={s.symbol}
            logo={s.logo}
            title={s.name}
            subtitle={s.name}
            price={s.price}
            changePct={s.changePct}
          />
        ))}
      </div>

      {/* Performance + Dividend (atas) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <SectionHeader title="Portfolio Performance" tabs={["Monthly", "Quarterly", "Annually"]} active={range} onChange={setRange} />
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

          {/* Quick “watch” (kecil) – boleh dihapus kalau mau */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-800">Quick Watch</div>
              <button className="text-gray-500 text-sm inline-flex items-center gap-1">Manage <ChevronRight className="h-4 w-4" /></button>
            </div>
            <div className="divide-y divide-gray-100">
              {quickWatch.map((w) => <WatchItem key={w.name} {...w} />)}
            </div>
          </Card>
        </div>
      </div>

      {/* Watchlist + Trending (bawah) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        {/* My Watchlist table lebar */}
        <div className="xl:col-span-2 space-y-4">
          <WatchlistTable />
        </div>

        {/* Sisi kanan: Add + Alerts + Trending */}
        <div className="space-y-4">
          <WatchlistAdd />
          <AlertsCard />
          <TrendingStocks />
        </div>
      </div>

      {/* Bottom summary cards */}
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
