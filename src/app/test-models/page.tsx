'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'

export default function TestModelsPage() {
  const { darkMode } = useDarkMode()
  const [modelData, setModelData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/test-models-availability')
        const data = await res.json()
        
        if (!res.ok) {
          setError(data.error || 'Failed to fetch model data')
        } else {
          setModelData(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchModelData()
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
            Model Availability Test
          </h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className={`rounded-2xl p-8 transition-colors duration-200 ${
              darkMode 
                ? 'bg-red-900/20 border border-red-700/50 text-red-200' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <h2 className="text-xl font-bold mb-3">Error</h2>
              <p>{error}</p>
            </div>
          ) : modelData ? (
            <div className={`rounded-2xl p-8 transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white border border-slate-200/50'
            }`}>
              <div className={`p-6 rounded-xl mb-6 text-center font-bold text-lg transition-colors duration-200 ${
                modelData.allModelsAvailable
                  ? darkMode 
                    ? 'bg-green-900/20 text-green-400 border border-green-700/50' 
                    : 'bg-green-50 text-green-600 border border-green-200'
                  : darkMode 
                    ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-700/50' 
                    : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
              }`}>
                {modelData.allModelsAvailable 
                  ? "✅ All configured models are available!" 
                  : "⚠️ Some configured models are not available"}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className={`p-6 rounded-xl transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-blue-900/20 border border-blue-700/50' 
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  <h3 className={`text-lg font-bold mb-3 transition-colors duration-200 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Available Models
                  </h3>
                  <p className={`mb-4 transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    These models are available and should work correctly:
                  </p>
                  <ul className="space-y-2">
                    {modelData.availableModels.map((model: any) => (
                      <li 
                        key={model.id} 
                        className={`flex items-start space-x-2 transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}
                      >
                        <span className="text-green-500">✓</span>
                        <span>
                          <span className="font-mono text-sm">{model.id}</span>
                          <br />
                          <span className="text-xs opacity-75">{model.name}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {modelData.unavailableModels.length > 0 && (
                  <div className={`p-6 rounded-xl transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-red-900/20 border border-red-700/50' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <h3 className={`text-lg font-bold mb-3 transition-colors duration-200 ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      Unavailable Models
                    </h3>
                    <p className={`mb-4 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      These models are not available and may cause errors:
                    </p>
                    <ul className="space-y-2">
                      {modelData.unavailableModels.map((modelId: string) => (
                        <li 
                          key={modelId} 
                          className={`flex items-start space-x-2 transition-colors duration-200 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}
                        >
                          <span className="text-red-500">✗</span>
                          <span className="font-mono text-sm">{modelId}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className={`p-6 rounded-xl transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700/30 border border-gray-600/50' 
                  : 'bg-slate-50 border border-slate-200'
              }`}>
                <h3 className={`text-lg font-bold mb-3 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-900'
                }`}>
                  Summary
                </h3>
                <ul className={`space-y-2 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  <li>Total models in OpenRouter: {modelData.totalModels}</li>
                  <li>Available configured models: {modelData.availableModels.length}</li>
                  <li>Unavailable configured models: {modelData.unavailableModels.length}</li>
                </ul>
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
                No data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}