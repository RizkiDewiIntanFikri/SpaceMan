import { useMemo } from "react"
import { ResponsiveContainer, AreaChart, Area } from "recharts"
import { useMarketStore } from "../../stores/marketStore"

export default function SparklineMini({ symbol }) {
  const series = useMarketStore(s => s.series)
  const data = useMemo(() => {
    const arr = series?.[symbol] || []
    return arr.slice(-30).map((v, i) => ({ x: i, y: v }))
  }, [series, symbol])

  return (
    <div className="h-8 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`sl_${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="y" stroke="#4f46e5" fill={`url(#sl_${symbol})`} strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
