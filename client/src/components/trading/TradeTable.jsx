import { usePortfolioStore } from '../../stores/portfolioStore'
import { formatCurrency } from '../../utils/formatters'

export default function TradeTable() {
  const txs = usePortfolioStore(s => s.transactions)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 font-semibold border-b border-gray-100">Trade History</div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="text-left px-4 py-2">Time</th>
            <th className="text-left px-4 py-2">Symbol</th>
            <th className="text-left px-4 py-2">Side</th>
            <th className="text-right px-4 py-2">Qty</th>
            <th className="text-right px-4 py-2">Price</th>
            <th className="text-right px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {txs.map(tx => (
            <tr key={tx.id} className="odd:bg-white even:bg-gray-50/50">
              <td className="px-4 py-2">{new Date(tx.time).toLocaleString()}</td>
              <td className="px-4 py-2">{tx.symbol}</td>
              <td className={"px-4 py-2 " + (tx.side==='BUY'?'text-success-600':'text-danger-600')}>{tx.side}</td>
              <td className="px-4 py-2 text-right">{tx.qty}</td>
              <td className="px-4 py-2 text-right">{formatCurrency(tx.price)}</td>
              <td className="px-4 py-2 text-right">{formatCurrency(tx.qty*tx.price)}</td>
            </tr>
          ))}
          {txs.length===0 && (
            <tr><td colSpan="6" className="px-4 py-6 text-center text-gray-400">No trades yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
