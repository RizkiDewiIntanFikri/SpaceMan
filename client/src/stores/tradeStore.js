import { create } from "zustand"
import { useMarketStore } from "./marketStore"
import { usePortfolioStore } from "./portfolioStore"

export const useTradeStore = create((set, get) => ({
  openOrders: [],   // {id,symbol,side,qty,type,limitPrice?,time,status}
  fills: [],        // {id,symbol,side,qty,price,type,time}

  placeOrder: ({ symbol, side, qty, type = "MARKET", limitPrice = null }) => {
    const ts = new Date().toISOString()
    const id = genId()
    if (type === "MARKET") {
      const price = useMarketStore.getState().getPrice(symbol) || 0
      usePortfolioStore.getState().placeTrade({ symbol, side, qty, price })
      set(st => ({
        fills: [{ id, symbol, side, qty, price, type, time: ts }, ...st.fills].slice(0, 50)
      }))
      return { id, status: "FILLED" }
    } else {
      const order = { id, symbol, side, qty, type: "LIMIT", limitPrice, time: ts, status: "OPEN" }
      set(st => ({ openOrders: [order, ...st.openOrders] }))
      return { id, status: "OPEN" }
    }
  },

  cancelOrder: (id) => set(st => ({ openOrders: st.openOrders.filter(o => o.id !== id) })),

  // dipanggil engine ketika harga berubah
  _engineStep: () => {
    const featured = useMarketStore.getState().featured || []
    const priceMap = Object.fromEntries(featured.map(f => [f.symbol, f.price]))

    const nextOpen = []
    const fills = []

    for (const o of get().openOrders) {
      const p = priceMap[o.symbol]
      if (p == null) { nextOpen.push(o); continue }
      const hit = (o.side === "BUY" && p <= o.limitPrice) ||
        (o.side === "SELL" && p >= o.limitPrice)
      if (hit) {
        usePortfolioStore.getState().placeTrade({ symbol: o.symbol, side: o.side, qty: o.qty, price: p })
        fills.push({ id: o.id, symbol: o.symbol, side: o.side, qty: o.qty, price: p, type: o.type, time: new Date().toISOString() })
      } else {
        nextOpen.push(o)
      }
    }

    if (fills.length) {
      set(st => ({
        openOrders: nextOpen,
        fills: [...fills, ...st.fills].slice(0, 50)
      }))
    }
  },
}))

// --- Engine: subscribe ke perubahan harga, jalankan step via rAF
let _unsub = null
let _refs = 0
let _raf = 0
function scheduleStep() {
  if (_raf) return
  _raf = requestAnimationFrame(() => {
    _raf = 0
    try { useTradeStore.getState()._engineStep() } catch (e) { console.error("[trade/engine] step failed:", e) }
  })
}

export function startTradeEngine() {
  if (typeof window === "undefined") return () => { }
  _refs += 1
  if (!_unsub) {
    _unsub = useMarketStore.subscribe(
      s => s.featured?.map(f => [f.symbol, f.price]),
      () => scheduleStep()
    )
  }
  return () => {
    _refs = Math.max(0, _refs - 1)
    if (_refs === 0 && _unsub) { _unsub(); _unsub = null }
  }
}

function genId() {
  return crypto?.randomUUID ? crypto.randomUUID() : `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
