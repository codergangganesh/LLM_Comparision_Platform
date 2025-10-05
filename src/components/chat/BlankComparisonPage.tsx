'use client'

import { useDarkMode } from '@/contexts/DarkModeContext'
import { Sparkles, Zap } from 'lucide-react'

interface BlankComparisonPageProps {
  onStartNew?: (message?: string) => void
}

export default function BlankComparisonPage({ onStartNew }: BlankComparisonPageProps) {
  const { darkMode } = useDarkMode()

  // Suggested prompts for the chat interface
  const suggestedPrompts = [
    "Explain quantum computing in simple terms",
    "Write a creative story about time travel",
    "Compare the benefits of renewable energy sources",
    "Create a business plan for a tech startup"
  ]

  const handlePromptSelect = (prompt: string) => {
    if (onStartNew) {
      onStartNew(prompt)
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl transition-transform duration-300 ${
          darkMode ? 'shadow-blue-500/20' : 'shadow-blue-500/30'
        }`}>
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className={`text-3xl font-bold mb-4 transition-colors duration-200 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          New Comparison
        </h2>
        <p className={`text-lg mb-8 leading-relaxed transition-colors duration-200 ${
          darkMode ? 'text-gray-300' : 'text-slate-600'
        }`}>
          Click below to start a new AI model comparison
        </p>
        
        {/* Suggested Prompts Section */}
        <div className="mb-8 text-left">
          <h3 className={`text-lg font-semibold mb-4 ${
            darkMode ? 'text-gray-200' : 'text-slate-800'
          }`}>
            Try these prompts:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptSelect(prompt)}
                className={`p-4 text-left rounded-xl transition-all duration-200 hover:scale-[1.02] group w-full ${
                  darkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700/50 backdrop-blur-sm' 
                    : 'bg-white/70 hover:bg-white/90 border border-slate-200/50 shadow-sm backdrop-blur-sm'
                } hover:shadow-lg`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-violet-900/50 to-purple-900/50 group-hover:from-violet-800/70 group-hover:to-purple-800/70' 
                      : 'bg-gradient-to-br from-violet-100 to-purple-100 group-hover:from-violet-200 group-hover:to-purple-200'
                  }`}>
                    <Zap className={`w-3 h-3 ${
                      darkMode ? 'text-violet-400' : 'text-violet-600'
                    }`} />
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    darkMode ? 'text-gray-200' : 'text-slate-700'
                  }`}>{prompt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => onStartNew && onStartNew()}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Start New Comparison
        </button>
      </div>
    </div>
  )
}