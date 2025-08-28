import { useMemo, useState } from "react"
import Card from "../ui/Card"
import { useLeaderboardStore } from "../../stores/leaderboardStore"
import { fmtPct, formatCurrency } from "../../utils/formatters"
import { ChevronUp, ChevronDown, Search } from "lucide-react"

const heads = [
  { key: "rank", label: "#" },
  { key: "player", label: "Player" },
  { key: "pnl", label: "P&L %" },
  { key: "value", label: "Total Value" },
  { key: "change", label: "Δ Today" },
]

export default function LeaderboardTable({ timeframe = "30D" }) {
  const players = useLeaderboardStore(s => s.players)
  const [query] = useState("")
  const [sortKey, setSortKey] = useState("pnl")
  const [sortDir, setSortDir] = useState("desc")

  const rows = useMemo(() => {
    const keyForTf = timeframe === "24H" ? "pnl24h" : timeframe === "7D" ? "pnl7d" : "pnl30d"
    const map = players.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      pnl: p[keyForTf],
      value: p.totalValue,
      change: p.pnl24h, // tampilkan “today” juga
    }))

    const filtered = query
      ? map.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
      : map

    const sorted = filtered.sort((a, b) => {
      const k = sortKey
      const av = a[k]; const bv = b[k]
      if (av === bv) return 0
      return (sortDir === "asc" ? (av > bv ? 1 : -1) : (av > bv ? -1 : 1))
    })

    return sorted.map((r, i) => ({ ...r, rank: i + 1 }))
  }, [players, timeframe, query, sortKey, sortDir])

  const setSort = (k) => {
    if (k === sortKey) setSortDir(d => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(k); setSortDir("desc") }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-gray-800">Leaderboard</div>
        <div className="relative w-60">
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              {heads.map(h => (
                <th key={h.key} className="py-2 pr-4">
                  <button onClick={() => setSort(h.key === "player" ? "name" : h.key)} className="inline-flex items-center gap-1">
                    {h.label}
                    {sortKey === (h.key === "player" ? "name" : h.key) ? (
                      sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                    ) : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(r => {
              const up = (r.pnl ?? 0) >= 0
              const upToday = (r.change ?? 0) >= 0
              return (
                <tr key={r.id} className="align-middle">
                  <td className="py-2 pr-4 text-gray-500">{r.rank}</td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt={r.name} className="h-8 w-8 rounded-full" />
                      <div className="font-medium text-gray-800">{r.name}</div>
                    </div>
                  </td>
                  <td className={`py-2 pr-4 ${up ? "text-emerald-600" : "text-rose-600"} font-medium`}>
                    {up ? "▲" : "▼"} {fmtPct(Math.abs(r.pnl))}
                  </td>
                  <td className="py-2 pr-4 font-semibold">{formatCurrency(r.value)}</td>
                  <td className={`py-2 pr-4 ${upToday ? "text-emerald-600" : "text-rose-600"}`}>
                    {upToday ? "+" : "−"}{fmtPct(Math.abs(r.change))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
