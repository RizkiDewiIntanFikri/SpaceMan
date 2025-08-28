import { shallow } from 'zustand/shallow'
import { usePortfolioStore } from '../../stores/portfolioStore'
import { formatCurrency } from '../../utils/formatters'

export default function PortfolioCard() {
  // satu subscription + shallow (lebih efisien & stabil)
  const [cashBalance, totalValue, pnlPctRaw] = usePortfolioStore(
    s => [s.cashBalance, s.totalValue, s.pnlPct],
    shallow
  )

  const pnlPct = Number.isFinite(pnlPctRaw) ? pnlPctRaw : 0
  const up = pnlPct >= 0

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500">Cash Balance</div>
          <div className="text-lg font-semibold">{formatCurrency(cashBalance)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Total Value</div>
          <div className="text-lg font-semibold">{formatCurrency(totalValue)}</div>
        </div>
        <div className="col-span-2">
          <div className="text-xs text-gray-500">P&L</div>
          <div className={'text-sm font-medium ' + (up ? 'text-emerald-600' : 'text-rose-600')}>
            {up ? '▲' : '▼'} {Math.abs(pnlPct).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  )
}
