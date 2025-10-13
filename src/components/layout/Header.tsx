'use client'

import Link from 'next/link'
import { Brain } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import NotificationBell from '@/components/ui/NotificationBell'

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { user } = useAuth()

  // Function to get user display name
  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'User')
  }

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800/90 border-gray-700/50' 
        : 'bg-white/90 border-slate-200/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <Link href="/">
                <h1 className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-200 ${
                  darkMode 
                    ? 'from-white to-gray-200' 
                    : 'from-slate-900 to-slate-700'
                }`}>
                  AI Fiesta
                </h1>
              </Link>
            </div>
          </div>

          {/* Right side - Notification and User */}
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {getUserDisplayName()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}