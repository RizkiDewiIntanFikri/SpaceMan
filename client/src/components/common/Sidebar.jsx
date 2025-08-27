import { NavLink } from 'react-router'

const Item = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      ['flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
       isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'].join(' ')
    }>
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </NavLink>
)

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col border-r border-gray-200 bg-white p-4 gap-2">
      <div className="flex items-center gap-2 px-2 py-2">
        <span className="text-2xl">📈</span>
        <span className="font-semibold">SpaceMan</span>
      </div>
      <nav className="mt-4 grid gap-1">
        <Item to="/dashboard" icon="🏠" label="Dashboard" />
        <Item to="/portfolio" icon="💼" label="Portfolio" />
        <Item to="/trade" icon="🧾" label="Trade" />
        <Item to="/leaderboard" icon="🏆" label="Leaderboard" />
      </nav>
      <div className="mt-auto text-xs text-gray-400 px-2">v0.1 JS</div>
    </aside>
  )
}
