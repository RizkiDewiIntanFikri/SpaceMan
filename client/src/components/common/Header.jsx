import { useRef, useEffect } from 'react'
import { LogOut, User, Bell, Search } from 'lucide-react'

export default function Header({ onLogout, user }) {
  const searchRef = useRef()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && e.ctrlKey) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="flex items-center gap-4 px-4 lg:px-6 py-3">
        {/* Left side - Search (extended) */}
        <div className="relative flex-1 max-w-none mr-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search stocks, portfolios..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Right side - Notifications, User Info, and Logout */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Notifications */}
          <button className="relative p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          </button>

          {/* User Info and Logout - Grouped together on the far right */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            {/* User Name */}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">{user?.username}</span>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            
            {/* Profile Photo */}
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors">
              <img 
                alt="Profile" 
                src="https://i.pravatar.cc/100?img=18" 
                className="h-full w-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
