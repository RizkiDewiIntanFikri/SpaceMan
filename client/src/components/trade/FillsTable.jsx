import Card from "../ui/Card"
import { useTradeStore } from "../../stores/tradeStore"
import { formatCurrency } from "../../utils/formatters"

export default function FillsTable() {
  const fills = useTradeStore(s => s.fills)

  return (
    <Card>
      <div className="font-semibold text-gray-800 mb-3">Recent Fills</div>
      {fills.length === 0 ? (
        <div className="text-sm text-gray-500">No fills yet.</div>
      ) : (
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
              {fills.map(f => (
                <tr key={f.id}>
                  <td className="py-2 pr-4 text-gray-500">{new Date(f.time).toLocaleString()}</td>
                  <td className="py-2 pr-4 font-medium">{f.symbol}</td>
                  <td className={`py-2 pr-4 ${f.side === "BUY" ? "text-emerald-600" : "text-rose-600"}`}>{f.side}</td>
                  <td className="py-2 pr-4">{f.qty}</td>
                  <td className="py-2 pr-4">{formatCurrency(f.price)}</td>
                  <td className="py-2 pr-4">{formatCurrency(f.qty * f.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
