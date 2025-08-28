import { useMemo, useRef } from "react"
import { ChevronRight } from "lucide-react"
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

  // untuk Quick Watch (ambil dari featured)
  const quickWatch = useMemo(() => {
    const list = [...(featured || [])]
    // ambil yang paling “gerak” (opsional): sort by abs(changePct)
    list.sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
    return list.slice(0, 6).map(f => ({
      symbol: f.symbol, name: f.name, logo: f.logo, price: f.price, changePct: f.changePct
    }))
  }, [featured])

  // map harga utk item watchlist
  const priceMap = useMemo(() => {
    const m = {}
    ;(featured || []).forEach(f => {
      m[f.symbol] = { price: f.price, changePct: f.changePct, name: f.name, logo: f.logo }
    })
    return m
  }, [featured])

  const scroller = useRef(null)
  const scrollByCards = (dir=1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * 316, behavior: "smooth" }) // ~card width + gap
  }

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
          <div className="text-xs text-gray-500 mb-2"> </div>
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => scrollByCards(-1)} className="h-8 w-8 rounded-xl border border-gray-200 grid place-items-center">‹</button>
            <button onClick={() => scrollByCards(1)} className="h-8 w-8 rounded-xl border border-gray-200 grid place-items-center">›</button>
          </div>
          <div ref={scroller} className="mt-2 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {quickWatch.map(w => {
              const up = (w.changePct ?? 0) >= 0
              return (
                <div key={w.symbol} className="min-w-[300px] snap-start rounded-2xl border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 grid place-items-center rounded-full bg-white text-lg">{w.logo}</div>
                      <div>
                        <div className="font-semibold">{w.symbol}</div>
                        <div className="text-xs text-gray-500">{w.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(w.price)}</div>
                      <div className={`text-xs font-medium ${up ? "text-emerald-600" : "text-rose-600"}`}>
                        {up ? "▲" : "▼"} {fmtPct(Math.abs(w.changePct))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <SparklineMini symbol={w.symbol} />
                    <div className="flex gap-2">
                      <button className="rounded-xl border border-gray-200 px-3 py-1 text-xs">Short</button>
                      <button className="rounded-xl bg-indigo-600 text-white px-3 py-1 text-xs">Buy</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="my-3 h-px bg-gray-200" />
        </>
      )}

      {items.length === 0 ? (
        <div className="text-sm text-gray-500"> </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
          {items.map(it => {
            const p = priceMap[it.symbol]
            const price = p?.price ?? 0
            const ch = p?.changePct ?? 0
            const up = (ch ?? 0) >= 0

            return (
              <div key={it.symbol} className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 grid place-items-center rounded-full bg-white text-lg">{p?.logo ?? "📈"}</div>
                    <div>
                      <div className="font-semibold">{it.symbol}</div>
                      <div className="text-xs text-gray-500">{p?.name ?? "-"}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(price)}</div>
                    <div className={`text-xs font-medium ${up ? "text-emerald-600" : "text-rose-600"}`}>
                      {up ? "▲" : "▼"} {fmtPct(Math.abs(ch))}
                    </div>
                  </div>
                </div>

                {/* sparkline + actions */}
                <div className="mt-2 flex items-center justify-between">
                  <SparklineMini symbol={it.symbol} />
                  <div className="flex gap-2">
                    <button onClick={() => clearAlerts(it.symbol)} className="rounded-xl border border-gray-200 px-3 py-1 text-xs">
                      Clear
                    </button>
                    <button onClick={() => remove(it.symbol)} className="rounded-xl border border-gray-200 px-3 py-1 text-xs">
                      Remove
                    </button>
                  </div>
                </div>

                {/* alert inputs di bawah, tetap ringkas */}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="number" step="0.01" placeholder="Alert ↑"
                    defaultValue={it.alertAbove ?? ""}
                    onBlur={(e) => setAlerts(it.symbol, { above: e.target.value || null })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-2 py-1 text-xs"
                  />
                  <input
                    type="number" step="0.01" placeholder="Alert ↓"
                    defaultValue={it.alertBelow ?? ""}
                    onBlur={(e) => setAlerts(it.symbol, { below: e.target.value || null })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-2 py-1 text-xs"
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
