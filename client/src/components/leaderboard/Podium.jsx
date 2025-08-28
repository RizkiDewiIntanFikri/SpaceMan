import Card from "../ui/Card"
import { fmtPct } from "../../utils/formatters"

function Pill({ v }) {
  const up = (v ?? 0) >= 0
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
      {up ? "▲" : "▼"} {fmtPct(Math.abs(v))}
    </span>
  )
}

export default function Podium({ top = [] }) {
  const [gold, silver, bronze] = top
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        {silver ? <PodiumItem place="2" color="text-gray-500" {...silver} /> : <Empty place={2} />}
      </Card>
      <Card>
        {gold ? <PodiumItem place="1" color="text-yellow-600" crown {...gold} /> : <Empty place={1} />}
      </Card>
      <Card>
        {bronze ? <PodiumItem place="3" color="text-amber-700" {...bronze} /> : <Empty place={3} />}
      </Card>
    </div>
  )
}

function PodiumItem({ place, crown, color, name, avatar, pnl }) {
  const up = (pnl ?? 0) >= 0
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`text-sm font-semibold ${color}`}>{crown ? "Champion" : `#${place}`}</div>
      <img src={avatar} alt={name} className="h-16 w-16 rounded-full mt-2" />
      <div className="mt-2 font-semibold">{name}</div>
      <div className={`mt-1 text-sm ${up ? "text-emerald-600" : "text-rose-600"}`}>{up ? "▲" : "▼"} {fmtPct(Math.abs(pnl))}</div>
    </div>
  )
}

function Empty({ place }) {
  return <div className="text-sm text-gray-400 text-center py-10">Waiting for player #{place}</div>
}
