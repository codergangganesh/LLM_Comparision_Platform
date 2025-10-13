'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface EnvData {
  environment: Record<string, string>
  allRequiredSet: boolean
}

export default function TestEnvPage() {
  const { darkMode } = useDarkMode()
  const [envData, setEnvData] = useState<EnvData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnvData = async () => {
      try {
        const res = await fetch('/api/test-env')
        const data = await res.json()
        setEnvData(data)
      } catch (error) {
        console.error('Error fetching environment data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnvData()
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold mb-8 text-center transition-colors duration-200 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Environment Variables Test
          </h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : envData ? (
            <div className={`rounded-2xl p-8 transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white border border-slate-200/50'
            }`}>
              <h2 className={`text-xl font-bold mb-6 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Environment Variables Status
              </h2>
              
              <div className="space-y-4">
                {Object.entries(envData.environment).map(([key, value]) => (
                  <div 
                    key={key} 
                    className={`flex items-center justify-between p-4 rounded-xl transition-colors duration-200 ${
                      value === "MISSING" || (typeof value === "string" && value.includes("MISSING"))
                        ? darkMode 
                          ? 'bg-red-900/20 border border-red-700/50' 
                          : 'bg-red-50 border border-red-200'
                        : darkMode 
                          ? 'bg-green-900/20 border border-green-700/50' 
                          : 'bg-green-50 border border-green-200'
                    }`}
                  >
                    <span className={`font-mono text-sm transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      {key}
                    </span>
                    <span className={`font-medium transition-colors duration-200 ${
                      value === "MISSING" || (typeof value === "string" && value.includes("MISSING"))
                        ? darkMode ? 'text-red-400' : 'text-red-600'
                        : darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {typeof value === "string" && value !== "MISSING" && value !== "SET" 
                        ? "SET (hidden for security)" 
                        : value}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className={`mt-8 p-6 rounded-xl text-center font-bold text-lg transition-colors duration-200 ${
                envData.allRequiredSet
                  ? darkMode 
                    ? 'bg-green-900/20 text-green-400 border border-green-700/50' 
                    : 'bg-green-50 text-green-600 border border-green-200'
                  : darkMode 
                    ? 'bg-red-900/20 text-red-400 border border-red-700/50' 
                    : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                {envData.allRequiredSet 
                  ? "✅ All required environment variables are set!" 
                  : "❌ Some required environment variables are missing!"}
              </div>
            </div>
          ) : (
            <div className={`rounded-2xl p-8 text-center transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white border border-slate-200/50'
            }`}>
              <p className={`transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-700'
              }`}>
                Failed to load environment data
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}