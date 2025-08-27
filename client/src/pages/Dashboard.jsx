import { useEffect, useState } from 'react'
import { useMarketStore, startMarketAutoTick } from '../stores/marketStore'
import { startPortfolioAutoRecalc } from '../stores/portfolioStore'
import StockCard from '../components/trading/StockCard'
import PortfolioCard from '../components/trading/PortfolioCard'
import TradeTable from '../components/trading/TradeTable'
import BuySellModal from '../components/trading/BuySellModal'
import StockLine from '../components/charts/StockLine'
import PortfolioArea from '../components/charts/PortfolioArea'

export default function Dashboard() {
  const stocks = useMarketStore(s => s.featured)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const stopMarket = startMarketAutoTick(2000)
    const stopRecalc = startPortfolioAutoRecalc()
    return () => { stopMarket?.(); stopRecalc?.() }
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {stocks.map((s) => <StockCard key={s.symbol} stock={s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Stock Chart</div>
            <button className="rounded-xl border border-gray-200 px-3 py-1 text-sm" onClick={() => setOpen(true)}>
              Buy/Sell
            </button>
          </div>
          <StockLine />
        </div>
        <PortfolioCard />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 xl:col-span-2">
          <div className="font-semibold mb-2">Portfolio</div>
          <PortfolioArea />
        </div>
        <TradeTable />
      </div>

      <BuySellModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
