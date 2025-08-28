import { create } from "zustand";

const SYMBOLS = ["AAPL", "GOOGL", "AMZN", "MSFT", "NVDA"];
const initialPrice = { AAPL: 192.12, GOOGL: 168.42, AMZN: 182.26, MSFT: 428.21, NVDA: 116.35 };
const logoOf = s => s === "AAPL" ? "" : s === "GOOGL" ? "🔎" : s === "AMZN" ? "🅰️" : s === "MSFT" ? "🪟" : s === "NVDA" ? "🧠" : "📈";

export const useMarketStore = create((set, get) => ({
  selectedSymbol: "AAPL",
  featured: SYMBOLS.map(sym => ({
    symbol: sym,
    name: sym === "GOOGL" ? "Alphabet, Inc"
      : sym === "MSFT" ? "Microsoft, Inc"
        : sym === "NVDA" ? "NVIDIA Corp"
          : sym === "AMZN" ? "Amazon.com, Inc"
            : "Apple, Inc",
    logo: logoOf(sym),
    price: initialPrice[sym],
    changePct: 0,
  })),
  series: SYMBOLS.reduce((acc, s) => {
    acc[s] = Array.from({ length: 40 }, (_, i) =>
      initialPrice[s] + Math.sin(i / 3) * 2 + (Math.random() - 0.5) * 1.5
    );
    return acc;
  }, {}),

  setSelectedSymbol: (sym) => set({ selectedSymbol: sym }),
  getPrice: (sym) => get().featured.find(f => f.symbol === sym)?.price ?? null,

  tick: () => set((state) => {
    const featured = state.featured.map(st => {
      const prevSeries = state.series[st.symbol];
      const last = prevSeries[prevSeries.length - 1] ?? st.price;
      const next = Math.max(1, last + (Math.random() - 0.5) * 2);
      const changePct = ((next - st.price) / st.price) * 100;
      return { ...st, price: next, changePct };
    });
    const series = { ...state.series };
    for (const st of featured) {
      const prev = state.series[st.symbol];
      series[st.symbol] = [...prev.slice(-39), st.price /* atau next; pilih salah satu konsisten */];
    }
    return { featured, series };
  }),
}));

// Timer aman (ref-count) — panggil dari useEffect
let _tickTimer = null;
let _tickRefs = 0;
export function startMarketAutoTick(intervalMs = 2000) {
  if (typeof window === "undefined") return () => { };
  _tickRefs += 1;
  if (!_tickTimer) {
    _tickTimer = setInterval(() => {
      try { useMarketStore.getState().tick?.(); }
      catch (err) { console.error("[market/tick] failed:", err); }
    }, intervalMs);
    // console.log("[market] timer started");
  }
  return () => {
    _tickRefs = Math.max(0, _tickRefs - 1);
    if (_tickRefs === 0 && _tickTimer) {
      clearInterval(_tickTimer);
      _tickTimer = null;
      // console.log("[market] timer cleared");
    }
  };
}
