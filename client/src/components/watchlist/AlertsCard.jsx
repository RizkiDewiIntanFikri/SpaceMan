import Card from "../ui/Card"
import { useWatchlistStore } from "../../stores/watchlistStore"

export default function AlertsCard() {
  const alerts = useWatchlistStore(s => s.alerts)
  const clearAll = useWatchlistStore(s => s.clearAllAlerts)

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-gray-800">Alerts</div>
        <button onClick={clearAll} className="rounded-xl border border-gray-200 px-3 py-1 text-xs">Clear</button>
      </div>
      {alerts.length === 0 ? (
        <div className="text-sm text-gray-500">No alerts fired.</div>
      ) : (
        <ul className="space-y-2 text-sm">
          {alerts.map(a => (
            <li key={a.id} className="flex items-center justify-between">
              <span>
                <span className="font-medium">{a.symbol}</span> crossed {a.dir === "above" ? "↑ above" : "↓ below"} at{" "}
                <span className="font-medium">${(a.price ?? 0).toFixed(2)}</span>
              </span>
              <span className="text-gray-400">{new Date(a.at).toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
