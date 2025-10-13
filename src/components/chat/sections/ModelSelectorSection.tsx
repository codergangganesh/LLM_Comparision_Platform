'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'
import ModelSelector from '../ModelSelector'

interface ModelSelectorSectionProps {
  darkMode: boolean
  showModelSelector: boolean
  setShowModelSelector: (show: boolean) => void
  selectedModels: string[]
  handleModelToggle: (modelId: string) => void
}

export default function ModelSelectorSection({ 
  darkMode, 
  showModelSelector, 
  setShowModelSelector, 
  selectedModels, 
  handleModelToggle 
}: ModelSelectorSectionProps) {
  return (
    <div className={`backdrop-blur-sm border-b p-4 transition-colors duration-200 ${
      darkMode 
        ? 'bg-gray-800/60 border-gray-700/30' 
        : 'bg-white/60 border-slate-200/30'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Only show model count badge when models are selected */}
          {selectedModels.length > 0 && (
            <div className={`px-4 py-2 bg-gradient-to-r rounded-full text-sm font-medium transition-colors duration-200 ${
              darkMode 
                ? 'from-blue-900/50 to-purple-900/50 text-blue-300 border border-blue-700/30' 
                : 'from-blue-100 to-purple-100 text-blue-700'
            }`}>
              {selectedModels.length} models selected
            </div>
          )}
          <button
            onClick={() => setShowModelSelector(!showModelSelector)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-xl transition-all duration-200 hover:shadow-md relative group ${
              darkMode 
                ? 'bg-gray-700/50 hover:bg-gray-600/50 border-gray-600 text-gray-300 hover:text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
            title="Configure AI Models"
          >
            <Settings className={`w-4 h-4 transition-colors duration-200 ${
              darkMode ? 'text-gray-400' : 'text-slate-600'
            }`} />
            <span className={`font-medium transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-700'
            }`}>Configure Models</span>
            {/* Dropdown indicator */}
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${
                showModelSelector ? 'rotate-180' : ''
              } ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {/* Tooltip for hover */}
            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
              Select AI models for comparison
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 -mr-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-r-gray-900 border-t-transparent border-b-transparent"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Model Selector Dropdown */}
      {showModelSelector && (
        <div className={`mt-4 p-4 rounded-2xl border shadow-xl transition-all duration-300 transform origin-top animate-fadeIn ${
          darkMode 
            ? 'bg-gray-800/95 border-gray-700/50 backdrop-blur-xl' 
            : 'bg-white border-slate-200/50'
        }`}>
          <ModelSelector 
            selectedModels={selectedModels}
            onModelToggle={handleModelToggle}
          />
        </div>
      )}
    </div>
  )
}