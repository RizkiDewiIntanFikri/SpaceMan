import { useMemo, useRef } from "react";
import { ChevronRight } from "lucide-react";
import Card from "../ui/Card";
import SparklineMini from "./SparklineMini";
import { useWatchlistStore } from "../../stores/watchlistStore";
import { useMarketStore } from "../../stores/marketStore";
import { formatCurrency, fmtPct } from "../../utils/formatters";

export default function WatchlistTable() {
  // This part still uses the mock store. We can connect it later.
  const items = useWatchlistStore((s) => s.items);
  const remove = useWatchlistStore((s) => s.removeSymbol);
  const setAlerts = useWatchlistStore((s) => s.setAlerts);
  const clearAlerts = useWatchlistStore((s) => s.clearAlerts);

  // 1. FIX: Get data from 'featuredStocks'
  const featuredStocks = useMarketStore((s) => s.featuredStocks);

  // This "Quick Watch" section will now use real data
  const quickWatch = useMemo(() => {
    const list = [...(featuredStocks || [])];
    // 2. FIX: Sort by 'changePercent'
    list.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
    // 3. FIX: Map the real data properties
    return list.slice(0, 6).map((f) => ({
      symbol: f.symbol,
      name: f.symbol, // Use symbol as name for now
      logo: f.symbol.charAt(0), // Use first letter as logo
      price: f.price,
      changePct: f.changePercent, // Use correct property name
    }));
  }, [featuredStocks]);

  // The rest of the component can largely stay the same for now,
  // as it will correctly consume the 'quickWatch' data we just fixed.

  const scroller = useRef(null);
  const scrollByCards = (dir = 1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * 316, behavior: "smooth" });
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-800">My Watchlist</div>
        <button className="text-gray-500 text-sm inline-flex items-center gap-1">
          Manage <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {!!quickWatch.length && (
        <>
          <div className="text-xs text-gray-500 mb-2">Quick Watch</div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => scrollByCards(-1)}
              className="h-8 w-8 rounded-xl border border-gray-200 grid place-items-center"
            >
              ‹
            </button>
            <button
              onClick={() => scrollByCards(1)}
              className="h-8 w-8 rounded-xl border border-gray-200 grid place-items-center"
            >
              ›
            </button>
          </div>
          <div
            ref={scroller}
            className="mt-2 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
          >
            {quickWatch.map((w) => {
              const up = (w.changePct ?? 0) >= 0;
              return (
                <div
                  key={w.symbol}
                  className="min-w-[300px] snap-start rounded-2xl border border-gray-200 bg-gray-50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 grid place-items-center rounded-full bg-white text-lg font-bold">
                        {w.logo}
                      </div>
                      <div>
                        <div className="font-semibold">{w.symbol}</div>
                        <div className="text-xs text-gray-500">{w.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(w.price)}
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          up ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {up ? "▲" : "▼"} {fmtPct(Math.abs(w.changePct))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <SparklineMini symbol={w.symbol} />
                    <div className="flex gap-2">
                      <button className="rounded-xl border border-gray-200 px-3 py-1 text-xs">
                        Short
                      </button>
                      <button className="rounded-xl bg-indigo-600 text-white px-3 py-1 text-xs">
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="my-3 h-px bg-gray-200" />
        </>
      )}

      {/* The main watchlist part below still uses mock data from watchlistStore */}
      {/* We can connect this to the backend as a new feature later */}
      {items.length > 0 && (
        // ... rest of the component's JSX for the main watchlist ...
        <div>Main watchlist section (currently mock)</div>
      )}
    </Card>
  );
}
