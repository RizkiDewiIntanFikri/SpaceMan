import { useEffect, useState } from 'react'
import { useMarketStore } from '../../stores/marketStore'
import { usePortfolioStore } from '../../stores/portfolioStore'

export default function BuySellModal({ open, onClose }) {
  const selected = useMarketStore(s => s.selectedSymbol)
  const price = useMarketStore(s => s.getPrice(selected))
  const placeTrade = usePortfolioStore(s => s.placeTrade)

  const [side, setSide] = useState('BUY')
  const [qty, setQty] = useState(10)

  useEffect(() => {
    if (open) { setSide('BUY'); setQty(10) }
  }, [open])

  if (!open) return null

  const confirm = () => {
    placeTrade({ symbol: selected, side, qty, price })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg">
        <div className="font-semibold mb-3">New Order</div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button className={'rounded-xl px-3 py-2 border ' + (side==='BUY'?'bg-success-50 border-success-200 text-success-700':'border-gray-200')} onClick={()=>setSide('BUY')}>Buy</button>
            <button className={'rounded-xl px-3 py-2 border ' + (side==='SELL'?'bg-danger-50 border-danger-200 text-danger-700':'border-gray-200')} onClick={()=>setSide('SELL')}>Sell</button>
          </div>
          <div className="text-sm">Symbol: <span className="font-medium">{selected}</span></div>
          <div className="text-sm">Price: <span className="font-medium">${price?.toFixed(2)}</span></div>
          <div className="text-sm grid grid-cols-2 gap-2 items-center">
            <label>Quantity</label>
            <input type="number" min="1" value={qty} onChange={e=>setQty(+e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={confirm} className="px-3 py-2 rounded-xl bg-primary-600 text-white">Confirm</button>
            <button onClick={onClose} className="px-3 py-2 rounded-xl border border-gray-200">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
