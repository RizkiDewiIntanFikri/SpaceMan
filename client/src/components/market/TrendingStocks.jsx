import Card from "../ui/Card";
import { useMemo } from "react";
import { useMarketStore } from "../../stores/marketStore";
import { formatCurrency } from "../../utils/formatters";
// SparklineMini will need to be updated separately if it also uses mock data
import SparklineMini from "../watchlist/SparklineMini";

function Pct({ v }) {
  const up = (v ?? 0) >= 0;
  return (
    <span
      className={`text-xs font-medium ${
        up ? "text-emerald-600" : "text-rose-600"
      }`}
    >
      {up ? "▲" : "▼"} {Math.abs(v || 0).toFixed(2)}%
    </span>
  );
}

export default function TrendingStocks({ limit = 6 }) {
  // 1. FIX: Get data from 'featuredStocks' instead of 'featured'
  const featuredStocks = useMarketStore((s) => s.featuredStocks);

  const movers = useMemo(() => {
    const list = [...(featuredStocks || [])];
    // 2. FIX: Sort by 'changePercent' which is the real property name
    list.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
    return list.slice(0, limit);
  }, [featuredStocks, limit]);

  return (
    <Card>
      <div className="font-semibold text-gray-800 mb-2">Trending Stocks</div>
      <div className="divide-y divide-gray-100">
        {movers.map((m) => {
          return (
            <div
              key={m.symbol}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* 3. FIX: Use the symbol's first letter as a placeholder logo */}
                <div className="h-9 w-9 grid place-items-center rounded-full bg-gray-100 text-lg font-bold">
                  {m.symbol.charAt(0)}
                </div>
                <div className="min-w-0">
                  {/* 4. FIX: Use the symbol for the title and name */}
                  <div className="font-medium text-gray-800 truncate">
                    {m.symbol}
                  </div>
                  <div className="text-gray-500 text-xs truncate">
                    {m.symbol}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(m.price)}</div>
                  {/* 5. FIX: Pass the correct property 'changePercent' */}
                  <Pct v={m.changePercent} />
                </div>
                <SparklineMini symbol={m.symbol} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
