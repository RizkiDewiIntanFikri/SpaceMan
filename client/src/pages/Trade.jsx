import { useEffect, useMemo, useState } from "react"; // 1. Import useState
import Card from "../components/ui/Card";
import TradeTicket from "../components/trade/TradeTicket";
import OpenOrdersTable from "../components/trade/OpenOrdersTable";
import FillsTable from "../components/trade/FillsTable";
import { useMarketStore } from "../stores/marketStore";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function Trade() {
  const featuredStocks = useMarketStore((s) => s.featuredStocks);

  // 2. The selectedSymbol state now lives here in the parent page.
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  // Set a default symbol when the stock list loads
  useEffect(() => {
    if (featuredStocks && featuredStocks.length > 0) {
      setSelectedSymbol(featuredStocks[0].symbol);
    }
  }, [featuredStocks]);

  // The chart data will now be based on the selectedSymbol state
  const seriesData = useMemo(() => {
    // We'll keep using mock data for the chart for now
    const arr = Array.from(
      { length: 60 },
      () => 100 + Math.random() * (selectedSymbol.length * 5)
    );
    return arr.map((v, i) => ({ name: i + 1, value: v }));
  }, [selectedSymbol]);

  const currentPrice =
    featuredStocks?.find((f) => f.symbol === selectedSymbol)?.price ?? 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Trade</h1>
          <p className="text-sm text-gray-500">
            Place market/limit orders and monitor execution
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-gray-800">
              {/* The chart title is now dynamic */}
              Price — {selectedSymbol}
            </div>
            <div className="text-2xl font-semibold">
              ${currentPrice.toFixed(2)}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={seriesData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="px" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#px)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 3. Pass the state and the setter function down to the TradeTicket */}
        <TradeTicket
          selectedSymbol={selectedSymbol}
          onSymbolChange={setSelectedSymbol}
        />

        <OpenOrdersTable />
        <FillsTable />
        <Card>
          <div className="font-semibold text-gray-800 mb-3">Notes</div>
          <p className="text-sm text-gray-600">
            Market orders fill instantly at current price.
          </p>
        </Card>
      </div>
    </div>
  );
}
