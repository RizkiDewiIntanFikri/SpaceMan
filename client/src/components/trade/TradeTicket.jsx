import { useEffect, useMemo, useState } from "react"
import Card from "../ui/Card"
import { useMarketStore } from "../../stores/marketStore"
import { usePortfolioStore } from "../../stores/portfolioStore"
import { useTradeStore } from "../../stores/tradeStore"
import { formatCurrency } from "../../utils/formatters"

export default function TradeTicket() {
  const featured = useMarketStore(s => s.featured)
  const selected  = useMarketStore(s => s.selectedSymbol)
  const setSelected = useMarketStore(s => s.setSelectedSymbol)
  const cash = usePortfolioStore(s => s.cashBalance)
  const holdings = usePortfolioStore(s => s.holdings)
  const placeOrder = useTradeStore(s => s.placeOrder)

  const [symbol, setSymbol] = useState(selected || "AAPL")
  const [side, setSide] = useState("BUY")         // BUY | SELL
  const [type, setType] = useState("MARKET")      // MARKET | LIMIT
  const [qty, setQty] = useState(1)
  const [limitPrice, setLimitPrice] = useState(0)

  useEffect(() => {
    if (selected) setSymbol(selected)
  }, [selected])

  useEffect(() => {
    // default limit price = current
    const p = priceMap[symbol] ?? 0
    setLimitPrice(Number(p.toFixed(2)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol])

  const priceMap = useMemo(() => {
    const m = {}
    ;(featured || []).forEach(f => { m[f.symbol] = f.price })
    return m
  }, [featured])

  const price = priceMap[symbol] ?? 0
  const amount = (Number(qty) || 0) * (type === "LIMIT" ? Number(limitPrice) || 0 : price)
  const have = holdings?.[symbol] || 0
  const canBuy = cash >= amount
  const canSell = have >= (Number(qty) || 0)

  function submit(e) {
    e.preventDefault()
    const nQty = Math.max(0, Math.floor(Number(qty) || 0))
    if (nQty === 0) return
    if (side === "BUY" && type === "MARKET" && !canBuy) return
    if (side === "SELL" && type === "MARKET" && !canSell) return

    if (type === "MARKET") {
      placeOrder({ symbol, side, qty: nQty, type: "MARKET" })
    } else {
      const lp = Number(limitPrice) || 0
      if (lp <= 0) return
      placeOrder({ symbol, side, qty: nQty, type: "LIMIT", limitPrice: lp })
    }
  }

  return (
    <Card>
      <div className="font-semibold text-gray-800 mb-3">Trade</div>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">Symbol</label>
          <select
            value={symbol}
            onChange={e => { setSymbol(e.target.value); setSelected?.(e.target.value) }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            {(featured || []).map(f => <option key={f.symbol} value={f.symbol}>{f.symbol}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setSide("BUY")}
            className={`rounded-xl px-3 py-2 border text-sm ${side==="BUY" ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white"}`}>
            BUY
          </button>
          <button type="button" onClick={() => setSide("SELL")}
            className={`rounded-xl px-3 py-2 border text-sm ${side==="SELL" ? "border-rose-300 bg-rose-50 text-rose-700" : "border-gray-200 bg-white"}`}>
            SELL
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setType("MARKET")}
            className={`rounded-xl px-3 py-2 border text-sm ${type==="MARKET" ? "border-gray-300 bg-gray-50" : "border-gray-200 bg-white"}`}>
            Market
          </button>
          <button type="button" onClick={() => setType("LIMIT")}
            className={`rounded-xl px-3 py-2 border text-sm ${type==="LIMIT" ? "border-gray-300 bg-gray-50" : "border-gray-200 bg-white"}`}>
            Limit
          </button>
        </div>

        {type === "LIMIT" && (
          <div>
            <label className="text-sm text-gray-600">Limit Price</label>
            <input type="number" step="0.01" value={limitPrice}
              onChange={e => setLimitPrice(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" />
          </div>
        )}

        <div>
          <label className="text-sm text-gray-600">Quantity</label>
          <input type="number" min="0" step="1" value={qty}
            onChange={e => setQty(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" />
        </div>

        <div className="text-sm text-gray-600">
          Price: <span className="font-medium text-gray-900">{formatCurrency(type==="LIMIT" ? Number(limitPrice) || 0 : price)}</span>
          <span className="mx-2">•</span>
          Amount: <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
        </div>

        <div className="text-xs text-gray-500">
          Cash: <span className="font-medium text-gray-700">{formatCurrency(cash)}</span>
          <span className="mx-2">•</span>
          You own {have} {symbol}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="submit"
            disabled={type==="MARKET" ? (side==="BUY" ? !canBuy : !canSell) : false}
            className="rounded-xl px-3 py-2 text-sm text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-60">
            Place {side} {type}
          </button>
        </div>
      </form>
    </Card>
  )
}
