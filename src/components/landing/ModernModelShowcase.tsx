'use client'

import { AVAILABLE_MODELS } from '@/lib/models'
import { Brain, Zap, Star } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

export default function ModernModelShowcase() {
  const { darkMode } = useDarkMode()
  // Get the first 6 models for showcase
  const featuredModels = AVAILABLE_MODELS.slice(0, 6)

  // Dispatch custom event to open the overlay in the parent component
  const handleViewAllModels = () => {
    window.dispatchEvent(new CustomEvent('openAllModelsOverlay'))
  }

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      'Google': 'from-blue-500 to-green-500',
      'Anthropic': 'from-orange-500 to-red-500',
      'OpenAI': 'from-green-500 to-blue-500',
      'Meta': 'from-blue-600 to-purple-600',
      'DeepSeek': 'from-purple-500 to-pink-500',
      'Alibaba': 'from-red-500 to-orange-500',
      'xAI': 'from-gray-700 to-gray-900',
      'Moonshot': 'from-cyan-500 to-blue-500',
      'Augmxnt': 'from-pink-500 to-purple-500',
      'Perplexity': 'from-purple-500 to-pink-500',
      'Cohere': 'from-indigo-500 to-blue-500',
      'Mistral AI': 'from-red-500 to-orange-500',
      'Microsoft': 'from-blue-500 to-cyan-500',
      'Nous Research': 'from-purple-500 to-pink-500'
    }
    return colors[provider] || 'from-slate-500 to-slate-700'
  }

  return (
    <div className={`py-24 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-violet-900/10 to-black' 
        : 'bg-gradient-to-br from-white to-blue-50'
    }`}>
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl ${
          darkMode ? 'bg-violet-500/10' : 'bg-blue-400/20'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl ${
          darkMode ? 'bg-purple-500/10' : 'bg-purple-400/20'
        }`}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className={`inline-flex items-center space-x-2 backdrop-blur-xl rounded-full px-5 py-2.5 mb-6 ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50 shadow-xl shadow-violet-500/10' 
              : 'bg-white/70 border border-slate-200/50 shadow-xl shadow-blue-500/10'
          }`}>
            <Brain className={`w-4 h-4 ${
              darkMode ? 'text-blue-400' : 'text-blue-500'
            }`} />
            <span className={`text-sm font-semibold ${
              darkMode ? 'text-blue-400' : 'text-blue-700'
            }`}>
              Premium AI Models
            </span>
          </div>
          <h2 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r transition-all duration-500 ${
            darkMode 
              ? 'from-white to-gray-300' 
              : 'from-slate-900 to-slate-700'
          } bg-clip-text text-transparent mb-6`}>
            World-Class AI Models
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            Access the latest and most powerful AI models from leading companies
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredModels.map((model, index) => (
            <div 
              key={index} 
              className={`group backdrop-blur-xl rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden cursor-pointer ${
                darkMode 
                  ? 'bg-gray-800/70 border border-gray-700/50 hover:border-white/30 shadow-xl shadow-violet-500/10' 
                  : 'bg-white/80 border border-slate-200/50 hover:border-blue-300/50 shadow-xl shadow-blue-500/10'
              }`}
            >
              {/* Enhanced animated background gradient on hover with smooth expansion */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getProviderColor(model.provider)} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${getProviderColor(model.provider)} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                    darkMode ? 'shadow-violet-500/30' : 'shadow-blue-500/30'
                  }`}>
                    {model.label.charAt(0)}
                  </div>
                  <div>
                    <div className={`font-bold text-lg transition-colors duration-300 ${
                      darkMode ? 'text-white group-hover:text-blue-200' : 'text-slate-900 group-hover:text-blue-600'
                    }`}>
                      {model.label}
                    </div>
                    <div className={`text-sm mt-1 transition-colors duration-300 ${
                      darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-slate-600 group-hover:text-slate-500'
                    }`}>
                      {model.provider}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Status indicator */}
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className={`text-xs font-semibold transition-colors duration-300 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    Active
                  </span>
                </div>
              </div>
              
              {/* Enhanced Model capabilities with smooth expansion */}
              <div className="relative mt-6 flex flex-wrap gap-2">
                {model.capabilities?.slice(0, 3).map((capability, idx) => (
                  <span 
                    key={idx} 
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700/80 text-gray-300 group-hover:bg-gray-600/80' 
                        : 'bg-slate-100/80 text-slate-700 group-hover:bg-slate-200/80'
                    }`}>
                    {capability}
                  </span>
                ))}
              </div>
              
              {/* Enhanced Performance indicators with smooth expansion */}
              <div className={`relative mt-4 pt-4 border-t transition-all duration-300 ${
                darkMode ? 'border-gray-700/50 group-hover:border-gray-600/50' : 'border-slate-200/50 group-hover:border-slate-300/50'
              }`}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Zap className={`w-4 h-4 transition-colors duration-300 ${
                      darkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-slate-500 group-hover:text-blue-500'
                    }`} />
                    <span className={`transition-colors duration-300 ${
                      darkMode ? 'text-gray-300 group-hover:text-blue-200' : 'text-slate-600 group-hover:text-blue-600'
                    }`}>
                      Speed: Medium
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className={`w-4 h-4 transition-colors duration-300 ${
                      darkMode ? 'text-gray-400 group-hover:text-yellow-400' : 'text-slate-500 group-hover:text-yellow-500'
                    }`} />
                    <span className={`transition-colors duration-300 ${
                      darkMode ? 'text-gray-300 group-hover:text-yellow-200' : 'text-slate-600 group-hover:text-yellow-600'
                    }`}>
                      Cost: Medium
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced hover effect overlay with smooth expansion */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-2xl transition-all duration-300"></div>
            </div>
          ))}
        </div>
        
        {/* Enhanced View all models button */}
        <div className="text-center mt-12">
          <button 
            onClick={handleViewAllModels}
            className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm ${
              darkMode
                ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-500/30'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
            }`}>
            <span>View All {AVAILABLE_MODELS.length} Models</span>
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}