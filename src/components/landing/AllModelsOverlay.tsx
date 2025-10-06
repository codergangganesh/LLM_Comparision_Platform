'use client'

import { AVAILABLE_MODELS } from '@/lib/models'
import { X, Brain, Zap, Star } from 'lucide-react'

interface AllModelsOverlayProps {
  show: boolean
  onClose: () => void
  darkMode: boolean
}

export default function AllModelsOverlay({ show, onClose, darkMode }: AllModelsOverlayProps) {
  if (!show) return null

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className={`relative rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-white to-gray-100'
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
        
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 flex items-center justify-between border-b backdrop-blur-xl ${
          darkMode 
            ? 'bg-gray-900/80 border-gray-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode 
                ? 'bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg shadow-violet-500/30' 
                : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30'
            }`}>
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              All AI Models
            </h2>
          </div>
          
          <button 
            onClick={onClose}
            aria-label="Close"
            title="Close"
            className={`p-2 rounded-full hover:bg-opacity-20 transition-colors backdrop-blur-sm ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Models Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_MODELS.map((model, index) => (
              <div 
                key={index} 
                className={`group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden backdrop-blur-xl ${
                  darkMode 
                    ? 'bg-gray-800/70 hover:bg-gray-800/90 border border-gray-700/50 shadow-xl shadow-violet-500/10' 
                    : 'bg-white/80 hover:bg-white/90 border border-slate-200/50 shadow-xl shadow-blue-500/10'
                }`}>
                {/* Enhanced gradient border effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getProviderColor(model.provider)} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${getProviderColor(model.provider)} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform ${
                      darkMode ? 'shadow-violet-500/30' : 'shadow-blue-500/30'
                    }`}>
                      {model.label.charAt(0)}
                    </div>
                    <div>
                      <div className={`font-bold text-lg ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {model.label}
                      </div>
                      <div className={`text-sm mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        {model.provider}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Status indicator */}
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className={`text-xs font-semibold ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      Active
                    </span>
                  </div>
                </div>
                
                {/* Enhanced Model description */}
                <div className={`relative mt-4 text-sm ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  {model.description}
                </div>
                
                {/* Enhanced Model capabilities */}
                <div className="relative mt-4 flex flex-wrap gap-2">
                  {model.capabilities?.slice(0, 3).map((capability, idx) => (
                    <span 
                      key={idx} 
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        darkMode 
                          ? 'bg-gray-700/80 text-gray-300' 
                          : 'bg-slate-100/80 text-slate-700'
                      }`}>
                      {capability}
                    </span>
                  ))}
                </div>
                
                {/* Enhanced Performance indicators */}
                <div className={`relative mt-4 pt-4 border-t ${
                  darkMode ? 'border-gray-700' : 'border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Zap className={`w-4 h-4 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`} />
                      <span className={
                        darkMode ? 'text-gray-300' : 'text-slate-600'
                      }>
                        Speed: Medium
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className={`w-4 h-4 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`} />
                      <span className={
                        darkMode ? 'text-gray-300' : 'text-slate-600'
                      }>
                        Cost: Medium
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Context window - only show if available */}
                <div className={`relative mt-3 text-xs ${
                  darkMode ? 'text-gray-400' : 'text-slate-500'
                }`}>
                  Context: {model.contextWindowK}K tokens
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}