import { useMemo } from "react"
import Card from "../ui/Card"
import SparklineMini from "./SparklineMini"
import { useWatchlistStore } from "../../stores/watchlistStore"
import { useMarketStore } from "../../stores/marketStore"
import { formatCurrency, fmtPct } from "../../utils/formatters"

export default function WatchlistTable() {
  const items = useWatchlistStore(s => s.items)
  const remove = useWatchlistStore(s => s.removeSymbol)
  const setAlerts = useWatchlistStore(s => s.setAlerts)
  const clearAlerts = useWatchlistStore(s => s.clearAlerts)

  const featured = useMarketStore(s => s.featured)

  const priceMap = useMemo(() => {
    const m = {}
    ;(featured || []).forEach(f => { m[f.symbol] = { price: f.price, changePct: f.changePct, name: f.name, logo: f.logo } })
    return m
  }, [featured])

  if (!items.length) {
    return (
      <Card>
        <div className="font-semibold text-gray-800 mb-3">My Watchlist</div>
        <div className="text-sm text-gray-500">Your watchlist is empty. Add symbols on the left.</div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="font-semibold text-gray-800 mb-3">My Watchlist</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2 pr-4">Symbol</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Change</th>
              <th className="py-2 pr-4">Spark</th>
              <th className="py-2 pr-4">Alert ↑</th>
              <th className="py-2 pr-4">Alert ↓</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(it => {
              const p = priceMap[it.symbol]?.price ?? 0
              const ch = priceMap[it.symbol]?.changePct ?? 0
              const up = (ch ?? 0) >= 0
              return (
                <tr key={it.symbol} className="align-middle">
                  <td className="py-2 pr-4 font-semibold text-gray-800">{it.symbol}</td>
                  <td className="py-2 pr-4">{priceMap[it.symbol]?.name ?? "-"}</td>
                  <td className="py-2 pr-4 font-medium">{formatCurrency(p)}</td>
                  <td className={`py-2 pr-4 ${up ? "text-emerald-600" : "text-rose-600"}`}>
                    {up ? "▲" : "▼"} {fmtPct(Math.abs(ch))}
                  </td>
                  <td className="py-2 pr-4"><SparklineMini symbol={it.symbol} /></td>
                  <td className="py-2 pr-2">
                    <input
                      type="number" step="0.01" placeholder="Above"
                      defaultValue={it.alertAbove ?? ""}
                      onBlur={(e) => setAlerts(it.symbol, { above: e.target.value || null })}
                      className="w-28 rounded-xl border border-gray-200 bg-white px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number" step="0.01" placeholder="Below"
                      defaultValue={it.alertBelow ?? ""}
                      onBlur={(e) => setAlerts(it.symbol, { below: e.target.value || null })}
                      className="w-28 rounded-xl border border-gray-200 bg-white px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="py-2 pr-2 flex gap-2">
                    <button onClick={() => clearAlerts(it.symbol)} className="rounded-xl border border-gray-200 px-3 py-1 text-xs">Clear Alerts</button>
                    <button onClick={() => remove(it.symbol)} className="rounded-xl border border-gray-200 px-3 py-1 text-xs">Remove</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
