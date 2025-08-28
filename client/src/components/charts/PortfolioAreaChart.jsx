import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
// 1. Import the real portfolio store
import { usePortfolioStore } from "../../stores/portfolioStore";

export default function PortfolioAreaChart() {
  // 2. Get the entire portfolio object AND the isLoading flag
  const { portfolio, isLoading } = usePortfolioStore();

  // Safely access the performance data from within the portfolio object
  const perfSeries = portfolio?.performance;

  // 3. The useMemo hook will now safely handle the data
  const data = useMemo(() => {
    // If perfSeries exists and has data, use it. Otherwise, fallback to an empty array.
    const series = perfSeries && perfSeries.length ? perfSeries : [];
    return series
      .slice(-30)
      .map((y, i) => ({ name: i + 1, value: Math.max(0, y) }));
  }, [perfSeries]);

  // 4. This is the crucial "loading guard". If the data is still being fetched,
  // we show a loading message and stop rendering. This prevents all crashes.
  if (isLoading) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-500">
        Loading Chart Data...
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="perf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: "#e5e7eb" }}
            contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#4f46e5"
            fill="url(#perf)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
