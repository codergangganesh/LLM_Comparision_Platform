'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import AIResponseCard from '@/components/chat/AIResponseCard'
import { AIModel } from '@/types/app'

export default function VerifyResponsePage() {
  const { darkMode } = useDarkMode()
  const [responses, setResponses] = useState<Array<{model: string, content: string, error?: string}>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sample models to test with
  const testModels: AIModel[] = [
    {
      id: 'openai/gpt-3.5-turbo',
      displayName: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      description: 'Fast and cost-effective model for simple tasks',
      capabilities: ['text', 'code']
    },
    {
      id: 'anthropic/claude-3-haiku:free',
      displayName: 'Claude 3 Haiku (Free)',
      provider: 'Anthropic',
      description: 'Anthropic\'s balanced intelligence model with free tier',
      capabilities: ['text', 'analysis', 'reasoning']
    },
    {
      id: 'google/gemini-flash-1.5:free',
      displayName: 'Gemini Flash 1.5 (Free)',
      provider: 'Google',
      description: 'Google\'s fast multimodal AI model with free tier',
      capabilities: ['text', 'image', 'video', 'audio']
    }
  ]

  const testMessage = "What are the benefits of using AI for content creation?"

  const handleTest = async () => {
    setLoading(true)
    setError('')
    setResponses([])
    
    try {
      const res = await fetch('/api/verify-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testMessage,
          models: testModels.map(m => m.id)
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Failed to test response display')
        console.error('Test error:', data)
      } else {
        setResponses(data.results)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('Test error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Run test automatically when component mounts
  useEffect(() => {
    handleTest()
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className={`text-3xl font-bold mb-8 text-center transition-colors duration-200 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Response Display Verification
          </h1>
          
          <div className={`rounded-2xl p-8 mb-8 transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-white border border-slate-200/50'
          }`}>
            <h2 className={`text-xl font-bold mb-4 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Test Message
            </h2>
            <p className={`mb-6 transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-700'
            }`}>
              &quot;{testMessage}&quot;
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
              {loading ? 'Testing...' : 'Test Response Display'}
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
          
          {responses.length > 0 && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Responses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {responses.map((response, index) => {
                  const model = testModels.find(m => m.id === response.model)
                  if (!model) return null
                  
                  return (
                    <AIResponseCard
                      key={index}
                      model={model}
                      content={response.content}
                      loading={false}
                      error={response.error}
                      responseTime={0.5}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}