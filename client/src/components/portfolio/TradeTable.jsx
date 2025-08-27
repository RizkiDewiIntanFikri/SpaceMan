import { usePortfolioStore } from "../../stores/portfolioStore";
import { formatCurrency } from "../../utils/formatters";

export default function TradeTable() {
  const tx = usePortfolioStore(s => s.transactions).slice(0, 10);

  if (!tx.length) {
    return <div className="text-sm text-gray-500">No trades yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 pr-4">Time</th>
            <th className="py-2 pr-4">Symbol</th>
            <th className="py-2 pr-4">Side</th>
            <th className="py-2 pr-4">Qty</th>
            <th className="py-2 pr-4">Price</th>
            <th className="py-2 pr-4">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tx.map(t => (
            <tr key={t.id}>
              <td className="py-2 pr-4 text-gray-500">{new Date(t.time).toLocaleString()}</td>
              <td className="py-2 pr-4 font-medium">{t.symbol}</td>
              <td className={`py-2 pr-4 ${t.side === "BUY" ? "text-emerald-600" : "text-rose-600"}`}>{t.side}</td>
              <td className="py-2 pr-4">{t.qty}</td>
              <td className="py-2 pr-4">{formatCurrency(t.price)}</td>
              <td className="py-2 pr-4">{formatCurrency(t.qty * t.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
