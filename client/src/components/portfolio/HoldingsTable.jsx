import { useMemo } from "react";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { useMarketStore } from "../../stores/marketStore";
import { formatCurrency } from "../../utils/formatters";

export default function HoldingsTable() {
  const holdings = usePortfolioStore(s => s.holdings);
  const featured = useMarketStore(s => s.featured);

  const priceMap = useMemo(() => {
    const m = {};
    (featured || []).forEach(f => { m[f.symbol] = f.price; });
    return m;
  }, [featured]);

  const rows = useMemo(() => {
    const items = Object.entries(holdings || {}).map(([sym, qty]) => {
      const price = priceMap[sym] ?? 0;
      const value = qty * price;
      return { sym, qty, price, value };
    });
    const total = items.reduce((a, r) => a + r.value, 0) || 1;
    return items
      .sort((a, b) => b.value - a.value)
      .map(r => ({ ...r, weight: (r.value / total) * 100 }));
  }, [holdings, priceMap]);

  if (!rows.length) {
    return (
      <div className="text-sm text-gray-500">
        No holdings yet. Buy some stocks to populate your portfolio.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 pr-4">Symbol</th>
            <th className="py-2 pr-4">Qty</th>
            <th className="py-2 pr-4">Price</th>
            <th className="py-2 pr-4">Value</th>
            <th className="py-2 pr-4">Weight</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(r => (
            <tr key={r.sym}>
              <td className="py-2 pr-4 font-medium text-gray-800">{r.sym}</td>
              <td className="py-2 pr-4">{r.qty}</td>
              <td className="py-2 pr-4">{formatCurrency(r.price)}</td>
              <td className="py-2 pr-4 font-semibold">{formatCurrency(r.value)}</td>
              <td className="py-2 pr-4">{r.weight.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
