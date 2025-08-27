import React from 'react'
import Sidebar from '../components/common/Sidebar'
import Header from '../components/common/Header'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
