import { create } from "zustand"
import { useMarketStore } from "./marketStore"

const LS_KEY = "watchlist.v1"

function safeLoad() {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(LS_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (Array.isArray(parsed)) return parsed
    // eslint-disable-next-line no-empty
  } catch { }
  return []
}

export const useWatchlistStore = create((set, get) => ({
  items: safeLoad(), // [{symbol, note?, alertAbove?, alertBelow?, _firedAbove?, _firedBelow?}]
  alerts: [],        // [{id,symbol,dir,price,at}]

  addSymbol: (symbol) => set(st => {
    if (!symbol) return {}
    if (st.items.some(i => i.symbol === symbol)) return {}
    return { items: [{ symbol }, ...st.items].slice(0, 100) }
  }),

  removeSymbol: (symbol) => set(st => ({ items: st.items.filter(i => i.symbol !== symbol) })),

  setNote: (symbol, note) => set(st => ({
    items: st.items.map(i => i.symbol === symbol ? { ...i, note } : i)
  })),

  setAlerts: (symbol, { above, below }) => set(st => ({
    items: st.items.map(i => i.symbol === symbol ? {
      ...i,
      alertAbove: (above ?? i.alertAbove) || null,
      alertBelow: (below ?? i.alertBelow) || null,
      // reset fired flags when editing
      _firedAbove: false,
      _firedBelow: false,
    } : i)
  })),

  clearAlerts: (symbol) => set(st => ({
    items: st.items.map(i => i.symbol === symbol ? {
      ...i, alertAbove: null, alertBelow: null, _firedAbove: false, _firedBelow: false
    } : i)
  })),

  clearAllAlerts: () => set({ alerts: [] }),

  // dipanggil engine ketika harga berubah
  _engineStep: () => {
    const featured = useMarketStore.getState().featured || []
    const price = Object.fromEntries(featured.map(f => [f.symbol, f.price]))

    const outAlerts = []
    const nextItems = get().items.map(i => {
      const p = price[i.symbol]
      if (p == null) return i
      let firedAbove = i._firedAbove || false
      let firedBelow = i._firedBelow || false

      if (i.alertAbove != null && !firedAbove && p >= Number(i.alertAbove)) {
        outAlerts.push({ id: makeId(), symbol: i.symbol, dir: "above", price: p, at: new Date().toISOString() })
        firedAbove = true
      }
      if (i.alertBelow != null && !firedBelow && p <= Number(i.alertBelow)) {
        outAlerts.push({ id: makeId(), symbol: i.symbol, dir: "below", price: p, at: new Date().toISOString() })
        firedBelow = true
      }

      // reset flags if price goes back within band
      if (i.alertAbove != null && firedAbove && p < Number(i.alertAbove) * 0.995) firedAbove = false
      if (i.alertBelow != null && firedBelow && p > Number(i.alertBelow) * 1.005) firedBelow = false

      return { ...i, _firedAbove: firedAbove, _firedBelow: firedBelow }
    })

    if (outAlerts.length) {
      set(st => ({ alerts: [...outAlerts, ...st.alerts].slice(0, 50) }))
    }
    // hanya set items kalau ada perubahan flag
    set(st => {
      // quick shallow compare length + some diff
      const changed = nextItems.length !== st.items.length || nextItems.some((n, idx) => {
        const o = st.items[idx]
        return !o || o.symbol !== n.symbol || o._firedAbove !== n._firedAbove || o._firedBelow !== n._firedBelow
      })
      return changed ? { items: nextItems } : {}
    })
  },
}))

// --- persistence & alert engine (subscribe + rAF, ref-counted)
let _unsubPersist = null
let _unsubMarket = null
let _refs = 0
let _raf = 0

function persistSnapshot(items) {
  if (typeof window === "undefined") return
  // eslint-disable-next-line no-empty
  try { localStorage.setItem(LS_KEY, JSON.stringify(items)) } catch { }
}

function scheduleStep() {
  if (_raf) return
  _raf = requestAnimationFrame(() => {
    _raf = 0
    try { useWatchlistStore.getState()._engineStep() } catch (e) { console.error("[watchlist/engine] step failed:", e) }
  })
}

export function startWatchlistEngine() {
  if (typeof window === "undefined") return () => { }
  _refs += 1

  if (!_unsubPersist) {
    _unsubPersist = useWatchlistStore.subscribe(s => s.items, persistSnapshot, { equalityFn: () => false })
  }
  if (!_unsubMarket) {
    _unsubMarket = useMarketStore.subscribe(
      s => s.featured?.map(f => [f.symbol, f.price]),
      () => scheduleStep()
    )
  }

  return () => {
    _refs = Math.max(0, _refs - 1)
    if (_refs === 0) {
      _unsubPersist?.(); _unsubPersist = null
      _unsubMarket?.(); _unsubMarket = null
    }
  }
}

function makeId() {
  return crypto?.randomUUID ? crypto.randomUUID() : `al_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
