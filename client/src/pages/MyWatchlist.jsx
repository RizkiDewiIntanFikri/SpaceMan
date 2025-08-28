import { useEffect } from "react"
import WatchlistAdd from "../components/watchlist/WatchlistAdd"
import WatchlistTable from "../components/watchlist/WatchlistTable"
import { startMarketAutoTick } from "../stores/marketStore"
import { startWatchlistEngine } from "../stores/watchlistStore"

export default function MyWatchlist() {
  useEffect(() => {
    const stopM = startMarketAutoTick(2000)
    const stopW = startWatchlistEngine()
    return () => { stopM?.(); stopW?.() }
  }, [])

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen space-y-6">
      <div>
        <h1 className="text-xl font-semibold">My Watchlist</h1>
        <p className="text-sm text-gray-500">Track prices, changes, and set price alerts</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <WatchlistTable />
        </div>
      </div>
    </div>
  )
}
