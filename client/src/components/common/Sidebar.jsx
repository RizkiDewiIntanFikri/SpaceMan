import React from 'react'
import { useLocation, Link } from 'react-router'
import { 
  Home, 
  TrendingUp, 
  PieChart, 
  Trophy, 
  BarChart3,
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Stocks', href: '/stocks', icon: TrendingUp },
  { name: 'Portfolio', href: '/portfolio', icon: PieChart },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Trade', href: '/trade', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">SpaceMan</h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
