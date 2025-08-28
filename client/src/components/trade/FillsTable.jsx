import Card from "../ui/Card";
// 1. Import the REAL portfolio store
import { usePortfolioStore } from "../../stores/portfolioStore";
import { formatCurrency } from "../../utils/formatters";

export default function FillsTable() {
  // 2. Get the real trade history from the portfolio store
  const fills = usePortfolioStore((s) => s.tradeHistory);

  return (
    <Card>
      <div className="font-semibold text-gray-800 mb-3">Recent Fills</div>
      {!fills || fills.length === 0 ? (
        <div className="text-sm text-gray-500">No fills yet.</div>
      ) : (
        <div className="overflow-x-auto max-h-64">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2 pr-4 font-medium">Time</th>
                <th className="py-2 pr-4 font-medium">Symbol</th>
                <th className="py-2 pr-4 font-medium">Side</th>
                <th className="py-2 pr-4 font-medium">Qty</th>
                <th className="py-2 pr-4 font-medium">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fills.map((f) => (
                <tr key={f.id}>
                  <td className="py-2 pr-4 text-gray-500 text-xs">
                    {new Date(f.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 pr-4 font-medium">{f.symbol}</td>
                  <td
                    className={`py-2 pr-4 font-semibold ${
                      f.type === "BUY" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {f.type}
                  </td>
                  <td className="py-2 pr-4">{f.quantity}</td>
                  <td className="py-2 pr-4">{formatCurrency(f.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
