'use client'

import { useState } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'

export default function TestChatPage() {
  const { darkMode } = useDarkMode()
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const handleTest = async () => {
    setLoading(true)
    setResponse('')
    setError('')
    
    try {
      const res = await fetch('/api/test-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Failed to test chat functionality')
        console.error('Test error:', data)
      } else {
        setResponse(data.response)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('Test error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className={`text-3xl font-bold mb-8 text-center transition-colors duration-200 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Chat Functionality Test
          </h1>
          
          <div className={`rounded-2xl p-8 mb-8 transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-white border border-slate-200/50'
          }`}>
            <p className={`mb-6 transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-700'
            }`}>
              Click the button below to test if the chat functionality is working correctly with your OpenRouter API key.
            </p>
            
            <button
              onClick={handleTest}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
              } text-white shadow-lg`}
            >
              {loading ? 'Testing...' : 'Test Chat Functionality'}
            </button>
          </div>
          
          {error && (
            <div className={`rounded-2xl p-6 mb-8 border transition-colors duration-200 ${
              darkMode 
                ? 'bg-red-900/20 border-red-700/50 text-red-200' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <h2 className="text-xl font-bold mb-3">Error</h2>
              <p className="whitespace-pre-wrap">{error}</p>
            </div>
          )}
          
          {response && (
            <div className={`rounded-2xl p-6 border transition-colors duration-200 ${
              darkMode 
                ? 'bg-green-900/20 border-green-700/50 text-green-200' 
                : 'bg-green-50 border-green-200 text-green-800'
            }`}>
              <h2 className="text-xl font-bold mb-3">Response</h2>
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}