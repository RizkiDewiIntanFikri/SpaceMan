import Card from "../ui/Card"
import { useTradeStore } from "../../stores/tradeStore"
import { formatCurrency } from "../../utils/formatters"

export default function OpenOrdersTable() {
  const open = useTradeStore(s => s.openOrders)
  const cancel = useTradeStore(s => s.cancelOrder)

  return (
    <Card>
      <div className="font-semibold text-gray-800 mb-3">Open Orders</div>
      {open.length === 0 ? (
        <div className="text-sm text-gray-500">No open orders.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Symbol</th>
                <th className="py-2 pr-4">Side</th>
                <th className="py-2 pr-4">Qty</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Limit</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {open.map(o => (
                <tr key={o.id}>
                  <td className="py-2 pr-4 text-gray-500">{new Date(o.time).toLocaleString()}</td>
                  <td className="py-2 pr-4 font-medium">{o.symbol}</td>
                  <td className={`py-2 pr-4 ${o.side === "BUY" ? "text-emerald-600" : "text-rose-600"}`}>{o.side}</td>
                  <td className="py-2 pr-4">{o.qty}</td>
                  <td className="py-2 pr-4">{o.type}</td>
                  <td className="py-2 pr-4">{o.limitPrice ? formatCurrency(o.limitPrice) : "-"}</td>
                  <td className="py-2 pr-4">
                    <button onClick={() => cancel(o.id)} className="rounded-xl border border-gray-200 px-3 py-1 text-sm">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
