import { useEffect, useMemo, useState } from "react";
import { useMarketStore } from "../../stores/marketStore";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { formatCurrency } from "../../utils/formatters";

export default function BuySellModal({ open, onClose }) {
  const featured = useMarketStore(s => s.featured);
  const defaultSym = useMarketStore(s => s.selectedSymbol);
  const placeTrade = usePortfolioStore(s => s.placeTrade);

  const [symbol, setSymbol] = useState(defaultSym || "AAPL");
  const [side, setSide] = useState("BUY");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (open) {
      setSymbol(defaultSym || "AAPL");
      setSide("BUY");
      setQty(1);
    }
  }, [open, defaultSym]);

  const priceMap = useMemo(() => {
    const m = {};
    (featured || []).forEach(f => { m[f.symbol] = f.price; });
    return m;
  }, [featured]);

  if (!open) return null;

  const price = priceMap[symbol] ?? 0;
  const amount = (qty || 0) * price;

  function submit(e) {
    e.preventDefault();
    const nQty = Math.max(0, Number(qty) || 0);
    placeTrade({ symbol, side, qty: nQty, price });
    onClose?.();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold text-gray-800">New Order</div>
          <button className="text-gray-500" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Symbol</label>
            <select value={symbol} onChange={e => setSymbol(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
              {(featured || []).map(f => <option key={f.symbol} value={f.symbol}>{f.symbol}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setSide("BUY")} className={`rounded-xl px-3 py-2 border text-sm ${side==="BUY" ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white"}`}>BUY</button>
            <button type="button" onClick={() => setSide("SELL")} className={`rounded-xl px-3 py-2 border text-sm ${side==="SELL" ? "border-rose-300 bg-rose-50 text-rose-700" : "border-gray-200 bg-white"}`}>SELL</button>
          </div>

          <div>
            <label className="text-sm text-gray-600">Quantity</label>
            <input type="number" min="0" step="1" value={qty} onChange={e => setQty(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" />
          </div>

          <div className="text-sm text-gray-600">
            Price: <span className="font-medium text-gray-900">{formatCurrency(price)}</span>
            <span className="mx-2">•</span>
            Amount: <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white">Cancel</button>
            <button type="submit" className="rounded-xl px-3 py-2 text-sm text-white bg-brand-600 hover:bg-brand-500">Place Order</button>
          </div>
        </form>
      </div>
    </div>
  );
}
