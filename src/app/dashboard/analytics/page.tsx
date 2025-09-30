'use client'

import { useDarkMode } from '@/contexts/DarkModeContext'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default function AnalyticsPage() {
  const { darkMode } = useDarkMode()

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <DashboardSidebar />
      
      <div className="ml-80 transition-all duration-300">
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="px-6 py-6">
            <h1 className={`text-3xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Analytics
            </h1>
            <p className={`mt-1 transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Detailed analytics and insights
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
              Analytics Dashboard
            </h2>
            <p className={`transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              This is the analytics page. Here you would see detailed charts and metrics about your AI model usage, performance, and comparisons.
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
                  Usage Statistics
                </h3>
                <p className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  View detailed usage statistics for all your AI models.
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
                  Performance Metrics
                </h3>
                <p className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Compare performance metrics across different AI models.
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
                  Trend Analysis
                </h3>
                <p className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Analyze trends in your AI model usage over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}