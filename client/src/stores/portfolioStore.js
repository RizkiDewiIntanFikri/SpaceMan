import { create } from "zustand";
import { useMarketStore } from "./marketStore";

export const usePortfolioStore = create((set, get) => ({
  cashBalance: 100000,
  holdings: {},
  transactions: [],
  performance: [],
  totalValue: 100000,
  pnlPct: 0,

  recalcNow: () => {
    const st = get();
    const getPrice = useMarketStore.getState().getPrice;
    let equity = 0;
    for (const [sym, qty] of Object.entries(st.holdings)) {
      equity += (getPrice(sym) || 0) * qty;
    }
    const totalValue = st.cashBalance + equity;
    const basis = 100000;
    const pnlPct = ((totalValue - basis) / basis) * 100;
    if (st.totalValue === totalValue && st.pnlPct === pnlPct) return; // guard
    set(prev => ({
      totalValue,
      pnlPct,
      performance: prev.performance.length
        ? [...prev.performance.slice(-39), totalValue]
        : [totalValue],
    }));
  },

  recalc: () => scheduleRecalc(),

  placeTrade: ({ symbol, side, qty, price }) => {
    set(st => {
      const cost = qty * price;
      const cashBalance = side === "BUY" ? st.cashBalance - cost : st.cashBalance + cost;
      const holdings = { ...st.holdings };
      holdings[symbol] = Math.max(0, (holdings[symbol] || 0) + (side === "BUY" ? qty : -qty));
      const tx = {
        id: (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())),
        symbol, side, qty, price, time: new Date().toISOString()
      };
      const transactions = [tx, ...st.transactions].slice(0, 100);
      return { cashBalance, holdings, transactions };
    });
    scheduleRecalc();
  },
}));

// jadwalkan recalc ke rAF biar setelah commit
let _rafId = 0;
function scheduleRecalc() {
  if (_rafId) return;
  _rafId = requestAnimationFrame(() => {
    _rafId = 0;
    try { usePortfolioStore.getState().recalcNow(); }
    catch (err) { console.error("[portfolio/recalc] failed:", err); }
  });
}

// subscribe aman ke perubahan harga
let _recalcUnsub = null;
let _recalcRefs = 0;
export function startPortfolioAutoRecalc() {
  if (typeof window === "undefined") return () => { };
  _recalcRefs += 1;
  if (!_recalcUnsub) {
    _recalcUnsub = useMarketStore.subscribe(
      s => s.featured?.map(f => [f.symbol, f.price]),
      () => scheduleRecalc()
    );
  }
  return () => {
    _recalcRefs = Math.max(0, _recalcRefs - 1);
    if (_recalcRefs === 0 && _recalcUnsub) {
      _recalcUnsub();
      _recalcUnsub = null;
    }
  };
}
