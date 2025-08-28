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
        <button className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200">🌓</button>
        <button className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200">🔔</button>


        <div className="ml-1 h-10 w-10 overflow-hidden rounded-full border border-gray-200">
          <img alt="avatar" src="https://i.pravatar.cc/100?img=18" className="h-full w-full object-cover" />
        </div>
      </div>
    </header>
  );
}
