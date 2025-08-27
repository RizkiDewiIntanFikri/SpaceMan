import { useEffect, useMemo } from "react"
import Card from "../components/ui/Card"
import TradeTicket from "../components/trade/TradeTicket"
import OpenOrdersTable from "../components/trade/OpenOrdersTable"
import FillsTable from "../components/trade/FillsTable"
import { useMarketStore, startMarketAutoTick } from "../stores/marketStore"
import { startPortfolioAutoRecalc } from "../stores/portfolioStore"
import { startTradeEngine } from "../stores/tradeStore"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export default function Trade() {
  const selected = useMarketStore(s => s.selectedSymbol)
  const series = useMarketStore(s => s.series)
  const featured = useMarketStore(s => s.featured)

  const data = useMemo(() => {
    const arr = series?.[selected] || []
    return arr.slice(-60).map((v, i) => ({ name: i + 1, value: v }))
  }, [series, selected])

  const current = (featured?.find(f => f.symbol === selected)?.price) ?? 0

  useEffect(() => {
    const stopM = startMarketAutoTick(2000)
    const stopP = startPortfolioAutoRecalc()
    const stopT = startTradeEngine()
    return () => { stopM?.(); stopP?.(); stopT?.() }
  }, [])

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Trade</h1>
          <p className="text-sm text-gray-500">Place market/limit orders and monitor execution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-gray-800">Price — {selected}</div>
            <div className="text-2xl font-semibold">${current.toFixed(2)}</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="px" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip cursor={{ stroke: "#e5e7eb" }} contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb" }} />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="url(#px)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <TradeTicket />
        <OpenOrdersTable />
        <FillsTable />
      </div>
    </div>
  )
}
