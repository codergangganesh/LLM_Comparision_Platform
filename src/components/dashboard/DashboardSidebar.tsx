'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Settings, 
  User, 
  HelpCircle, 
  LogOut,
  Home,
  Zap,
  Database,
  TrendingUp
} from 'lucide-react'

export default function DashboardSidebar() {
  const pathname = usePathname()
  
  const navItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: Home,
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
    },
    {
      name: 'Performance',
      href: '/dashboard/performance',
      icon: TrendingUp,
    },
    {
      name: 'Models',
      href: '/dashboard/models',
      icon: Zap,
    },
    {
      name: 'Data',
      href: '/dashboard/data',
      icon: Database,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: User,
    },
    {
      name: 'Help',
      href: '/dashboard/help',
      icon: HelpCircle,
    },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-80 backdrop-blur-xl border-r transition-colors duration-200 z-10
      bg-gray-800/80 border-gray-700">
      {/* Sidebar Content Container */}
      <div className="flex flex-col h-full pb-20">
        {/* Header with Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                AI Fiesta
              </h1>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold text-white mb-4">Dashboard</h2>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative w-full
                    ${pathname === item.href
                      ? 'text-white bg-gray-700/50 border border-gray-600' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                >
                  <Icon className="w-5 h-5 transition-colors group-hover:text-blue-400" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        
        {/* Profile Section at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 backdrop-blur-xl bg-gray-800/95">
          <div className="flex items-center justify-between cursor-pointer hover:bg-gray-700/30 p-2 rounded-lg transition-colors duration-200 group relative">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">U</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">User</p>
                <p className="text-xs text-gray-400">user@example.com</p>
              </div>
            </div>
            <LogOut className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}