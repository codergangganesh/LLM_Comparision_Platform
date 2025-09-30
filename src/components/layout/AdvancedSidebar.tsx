'use client'

import Link from 'next/link'

export default function AdvancedSidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-16 lg:w-72 border-r border-gray-200/30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm z-10">
      <div className="p-4 hidden lg:block">
        <h2 className="text-lg font-bold">AI Fiesta</h2>
        <nav className="mt-4 space-y-2">
          <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Dashboard</Link>
          <Link href="/chat" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Chat</Link>
        </nav>
      </div>
    </div>
  )
}


