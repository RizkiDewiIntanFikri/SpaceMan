import { useEffect, useMemo, useState } from "react"
import Card from "../components/ui/Card"
import SectionHeader from "../components/ui/SectionHeader"
import Podium from "../components/leaderboard/Podium"
import LeaderboardTable from "../components/leaderboard/LeaderboardTable"
import { useLeaderboardStore, startLeaderboardAutoTick } from "../stores/leaderboardStore"

export default function Leaderboard() {
  const players = useLeaderboardStore(s => s.players)
  const [tf, setTf] = useState("30D") // "24H" | "7D" | "30D"

  useEffect(() => {
    const stop = startLeaderboardAutoTick(2500)
    return () => stop?.()
  }, [])

  const top3 = useMemo(() => {
    const key = tf === "24H" ? "pnl24h" : tf === "7D" ? "pnl7d" : "pnl30d"
    return [...players].sort((a, b) => b[key] - a[key]).slice(0, 3)
      .map(p => ({ name: p.name, avatar: p.avatar, pnl: p[key] }))
  }, [players, tf])

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Leaderboard</h1>
          <p className="text-sm text-gray-500">Top performers by portfolio return</p>
        </div>
      </div>

      <SectionHeader
        title="Top Performers"
        subtitle=""
        tabs={["24H","7D","30D"]}
        active={tf}
        onChange={setTf}
      />

      <Podium top={top3} />

      <LeaderboardTable timeframe={tf} />
    </div>
  )
}
