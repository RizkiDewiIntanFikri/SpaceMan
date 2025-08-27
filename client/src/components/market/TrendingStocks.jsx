import Card from "../ui/Card"
import { useMemo } from "react"
import { useMarketStore } from "../../stores/marketStore"
import { formatCurrency } from "../../utils/formatters"
import SparklineMini from "../watchlist/SparklineMini"

function Pct({ v }) {
  const up = (v ?? 0) >= 0
  return (
    <span className={`text-xs font-medium ${up ? "text-emerald-600" : "text-rose-600"}`}>
      {up ? "▲" : "▼"} {Math.abs(v || 0).toFixed(2)}%
    </span>
  )
}

export default function TrendingStocks({ limit = 6 }) {
  const featured = useMarketStore(s => s.featured)

  const movers = useMemo(() => {
    const list = [...(featured || [])]
    // trending = pergerakan terbesar (abs changePct)
    list.sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
    return list.slice(0, limit)
  }, [featured, limit])

  return (
    <Card>
      <div className="font-semibold text-gray-800 mb-2">Trending Stocks</div>
      <div className="divide-y divide-gray-100">
        {movers.map(m => {
          return (
            <div key={m.symbol} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 grid place-items-center rounded-full bg-gray-100 text-lg">{m.logo}</div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 truncate">{m.symbol}</div>
                  <div className="text-gray-500 text-xs truncate">{m.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(m.price)}</div>
                  <Pct v={m.changePct} />
                </div>
                <SparklineMini symbol={m.symbol} />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
