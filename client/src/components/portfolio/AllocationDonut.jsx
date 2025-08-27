import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { useMarketStore } from "../../stores/marketStore";

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#64748b"];

export default function AllocationDonut() {
  const holdings = usePortfolioStore(s => s.holdings);
  const featured = useMarketStore(s => s.featured);

  const priceMap = useMemo(() => {
    const m = {};
    (featured || []).forEach(f => { m[f.symbol] = f.price; });
    return m;
  }, [featured]);

  const data = useMemo(() => {
    const arr = Object.entries(holdings || {}).map(([sym, qty]) => ({
      name: sym,
      value: (priceMap[sym] ?? 0) * qty
    })).filter(d => d.value > 0);
    return arr.length ? arr : [{ name: "Empty", value: 1 }];
  }, [holdings, priceMap]);

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
