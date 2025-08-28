import { create } from "zustand"

const AVATARS = [
  "https://i.pravatar.cc/48?img=1",
  "https://i.pravatar.cc/48?img=2",
  "https://i.pravatar.cc/48?img=3",
  "https://i.pravatar.cc/48?img=4",
  "https://i.pravatar.cc/48?img=5",
  "https://i.pravatar.cc/48?img=6",
  "https://i.pravatar.cc/48?img=7",
  "https://i.pravatar.cc/48?img=8",
  "https://i.pravatar.cc/48?img=9",
  "https://i.pravatar.cc/48?img=10",
]

const NAMES = [
  "Alex Morgan", "Jordan Lee", "Taylor Kim", "Samir Khan", "Priya Patel",
  "Diego Santos", "Yuki Tanaka", "Mia Rossi", "Liam O'Connor", "Chen Wei",
  "Nora Fischer", "Omar Haddad", "Ivy Nguyen", "Sofia Silva", "Noah Clarke",
]

function seedPlayers(n = 12) {
  const arr = []
  for (let i = 0; i < n; i++) {
    const base = 25000 + Math.random() * 75000
    const p30 = (Math.random() - 0.45) * 40      // -22% .. +?%
    const p7 = p30 / 4 + (Math.random() - 0.5) * 5
    const p1 = p7 / 3 + (Math.random() - 0.5) * 2.5
    arr.push({
      id: i + 1,
      name: NAMES[i % NAMES.length],
      avatar: AVATARS[i % AVATARS.length],
      totalValue: Math.round(base * (1 + p30 / 100)),
      pnl30d: p30,
      pnl7d: p7,
      pnl24h: p1,
    })
  }
  return arr
}

export const useLeaderboardStore = create((set) => ({
  players: seedPlayers(15),

  tick: () => set((state) => {
    const players = state.players.map(p => {
      const d1 = (Math.random() - 0.5) * 0.6
      const d7 = d1 * 0.6
      const d30 = d1 * 0.3
      const pnl24h = clamp(p.pnl24h + d1, -30, 60)
      const pnl7d = clamp(p.pnl7d + d7, -40, 80)
      const pnl30d = clamp(p.pnl30d + d30, -60, 120)
      const totalValue = Math.max(1000, Math.round(p.totalValue * (1 + d1 / 800)))
      return { ...p, pnl24h, pnl7d, pnl30d, totalValue }
    })
    return { players }
  }),
}))

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)) }

let _timer = null
let _refs = 0
export function startLeaderboardAutoTick(intervalMs = 2500) {
  if (typeof window === "undefined") return () => { }
  _refs += 1
  if (!_timer) {
    _timer = setInterval(() => {
      try {
        const { tick } = useLeaderboardStore.getState()
        if (typeof tick === "function") tick()
      } catch (e) {
        console.error("[leaderboard/tick] failed:", e)
      }
    }, intervalMs)
  }
  return () => {
    _refs = Math.max(0, _refs - 1)
    if (_refs === 0 && _timer) { clearInterval(_timer); _timer = null }
  }
}
