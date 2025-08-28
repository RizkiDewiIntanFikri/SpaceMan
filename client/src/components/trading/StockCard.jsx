import { useMarketStore } from '../../stores/marketStore'
import { formatCurrency } from '../../utils/formatters'

export default function StockCard({ stock }) {
  const setSelected = useMarketStore(s => s.setSelectedSymbol)
  const up = stock.changePct >= 0
  return (
    <button onClick={() => setSelected(stock.symbol)} className="text-left rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-sm transition">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">{stock.logo}</div>
        <div>
          <div className="font-medium">{stock.name}</div>
          <div className="text-xs text-gray-500">{stock.symbol}</div>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="text-xl font-semibold">{formatCurrency(stock.price)}</div>
        <div className={'text-xs rounded-full px-2 py-1 ' + (up ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600')}>
          {up ? '▲' : '▼'} {Math.abs(stock.changePct).toFixed(2)}%
        </div>
      </div>
    </button>
  )
}
