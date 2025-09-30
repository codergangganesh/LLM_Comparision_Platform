'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { darkMode } = useDarkMode()

  // Redirect unauthenticated users to the auth page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Show nothing while loading or redirecting
  if (loading || !user) {
    return null
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <AdvancedSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300">
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="px-6 py-6">
            <h1 className={`text-3xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Settings
            </h1>
            <p className={`mt-1 transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Configure your AI Fiesta preferences
            </p>
          </div>
        </div>
        
        <div className="p-6">
          <div className={`rounded-2xl p-8 transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50' 
              : 'bg-white/80 border border-slate-200/50'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Account Settings
            </h2>
            <p className={`transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Manage your account preferences, security settings, and notification preferences.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`rounded-xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700/50' 
                  : 'bg-slate-100'
              }`}>
                <h3 className={`font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Profile
                </h3>
                <p className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Update your profile information and avatar.
                </p>
              </div>
              <div className={`rounded-xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700/50' 
                  : 'bg-slate-100'
              }`}>
                <h3 className={`font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Security
                </h3>
                <p className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Manage your password, two-factor authentication, and security preferences.
                </p>
              </div>
              <div className={`rounded-xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700/50' 
                  : 'bg-slate-100'
              }`}>
                <h3 className={`font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Notifications
                </h3>
                <p className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Configure how and when you receive notifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}