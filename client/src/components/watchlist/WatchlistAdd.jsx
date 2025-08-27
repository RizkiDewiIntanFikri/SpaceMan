import { useEffect, useMemo, useState } from "react"
import Card from "../ui/Card"
import { useMarketStore } from "../../stores/marketStore"
import { useWatchlistStore } from "../../stores/watchlistStore"

export default function WatchlistAdd() {
  const featured = useMarketStore(s => s.featured)
  const add = useWatchlistStore(s => s.addSymbol)

  const [symbol, setSymbol] = useState("AAPL")

  const options = useMemo(() => (featured || []).map(f => f.symbol), [featured])

  useEffect(() => {
    if (options.length && !options.includes(symbol)) setSymbol(options[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.join(",")])

  function submit(e) {
    e.preventDefault()
    if (!symbol) return
    add(symbol.toUpperCase().trim())
  }

  return (
    <Card>
      <div className="font-semibold text-gray-800 mb-3">Add to Watchlist</div>
      <form onSubmit={submit} className="flex gap-2">
        <select value={symbol} onChange={e => setSymbol(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
          {options.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="rounded-xl px-3 py-2 text-sm text-white bg-brand-600 hover:bg-brand-500">Add</button>
      </form>
    </Card>
  )
}
