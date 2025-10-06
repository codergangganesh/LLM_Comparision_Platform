'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Copy, User, Sparkles, Clock, Check } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { ChatResponse } from '@/types/chat'
import { AIModel } from '@/types/app'
import { getModelById, AVAILABLE_MODELS, AiModel } from '@/lib/models'

interface HistoryDetailModalProps {
  session: {
    id: string
    message: string
    timestamp: Date
    selectedModels: string[]
    responses?: ChatResponse[]
    bestResponse?: string
    responseTime?: number
  }
  onClose: () => void
}

export default function HistoryDetailModal({ session, onClose }: HistoryDetailModalProps) {
  const { darkMode } = useDarkMode()
  const [copied, setCopied] = useState(false)
  const [copiedResponses, setCopiedResponses] = useState<Record<string, boolean>>({})
  const [isVisible, setIsVisible] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    return () => setIsVisible(false)
  }, [])

  const handleCopyAll = async () => {
    if (session.responses) {
      const allResponses = session.responses.map((response: ChatResponse) => {
        const model = getModelById(response.model)
        return `${model?.provider || response.model}:\n${response.content || 'No response'}\n\n`
      }).join('')
      
      try {
        await navigator.clipboard.writeText(allResponses)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const getModelDetails = (modelId: string) => {
    const model = getModelById(modelId)
    if (!model) return null
    
    // Convert AiModel to AIModel type
    const aiModel: AIModel = {
      id: model.id,
      displayName: model.label,
      provider: model.provider,
      description: model.description || '',
      capabilities: model.capabilities || []
    }
    
    return aiModel
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isVisible ? 'bg-black/70 backdrop-blur-sm animate-fadeIn' : 'bg-black/0'} transition-all duration-300`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
    >
      <div 
        ref={modalRef}
        className={`relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-sm ${isVisible ? 'animate-scaleIn' : 'scale-95 opacity-0'} transition-all duration-300 ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700' 
            : 'bg-gradient-to-br from-white/90 to-gray-100/90 border-gray-200'
        } md:max-w-5xl lg:max-w-6xl`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="p-6 h-full flex flex-col">
          {/* Modal Header */}
          <div className={`mb-6 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Conversation Details
              </h2>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatTime(session.timestamp)}
              </div>
            </div>
            
            {/* User Message Section */}
            <div className={`rounded-xl p-5 mb-6 border-2 ${
              darkMode ? 'bg-gradient-to-r from-blue-900/30 to-blue-900/10 border-blue-700/50' : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
            }`}>
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-blue-600' : 'bg-blue-500'
                }`}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      Your Message
                    </span>
                    <div className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      darkMode ? 'bg-blue-800 text-blue-300' : 'bg-blue-200 text-blue-700'
                    }`}>
                      {session.selectedModels.length} models
                    </div>
                  </div>
                  <p className={`whitespace-pre-wrap font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {session.message}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Copy All Button */}
            <div className="flex justify-end">
              <button
                onClick={handleCopyAll}
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  copied 
                    ? 'text-green-500' 
                    : darkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-200 text-gray-700'
                }`}
                title="Copy all responses"
              >
                {copied ? (
                  <div className="flex items-center animate-pulse">
                    <Check className="w-5 h-5" />
                    <span className="ml-2 text-sm">Copied!</span>
                  </div>
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* AI Responses Section */}
          <div className="flex-1 overflow-hidden">
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Responses
            </h3>
            
            {session.responses && session.responses.length > 0 ? (
              <div className="h-full flex flex-col">
                {/* Scrollable container for responses */}
                <div className="flex-1 overflow-y-auto pb-4 pr-2 -mr-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600" style={{ maxHeight: '60vh' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {session.selectedModels.map((modelId: string) => {
                      const model = getModelDetails(modelId)
                      const response = session.responses?.find((r: ChatResponse) => r.model === modelId)
                      
                      if (!model) return null
                      
                      return (
                        <div 
                          key={`${session.id}-${modelId}`}
                          className={`rounded-xl border-2 transition-all duration-200 ${
                            session.bestResponse === modelId
                              ? darkMode
                                ? 'border-amber-500/70 bg-gradient-to-br from-amber-900/30 to-amber-900/10 shadow-lg shadow-amber-500/20'
                                : 'border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg shadow-amber-200'
                              : darkMode
                                ? 'border-gray-700/70 bg-gradient-to-br from-gray-800/50 to-gray-800/30 hover:border-gray-600/70'
                                : 'border-gray-300 bg-gradient-to-br from-white to-gray-50 hover:border-gray-400 shadow-sm'
                          }`}
                        >
                          <div className="p-4 flex flex-col h-full">
                            {/* Model Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                                  session.bestResponse === modelId
                                    ? 'bg-gradient-to-br from-amber-500 to-yellow-500'
                                    : darkMode
                                      ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                                      : 'bg-gradient-to-br from-blue-500 to-purple-500'
                                }`}>
                                  {model.displayName.charAt(0)}
                                </div>
                                <div>
                                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {model.displayName}
                                  </h4>
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-xs ${
                                      darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                      {model.provider}
                                    </span>
                                    {session.bestResponse === modelId && (
                                      <div className={`flex items-center space-x-1 text-xs ${
                                        darkMode ? 'text-amber-400' : 'text-amber-600'
                                      }`}>
                                        <Sparkles className="w-3 h-3" />
                                        <span>Best</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {response?.responseTime !== undefined && response?.responseTime > 0 && (
                                <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                                  darkMode
                                    ? 'bg-blue-900/40 text-blue-300' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  <span>{response.responseTime.toFixed(2)}s</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Response Content */}
                            <div className={`rounded-lg p-4 flex-1 flex flex-col ${
                              darkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                            }`}>
                              <div className="flex items-center mb-2">
                                <div className={`text-xs font-semibold px-2 py-1 rounded ${
                                  darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
                                }`}>
                                  AI Response
                                </div>
                              </div>
                              {response?.error ? (
                                <div className={`text-sm p-3 rounded flex-1 flex items-center ${
                                  darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-500'
                                }`}>
                                  <div>{response.error}</div>
                                </div>
                              ) : response?.content ? (
                                <div className="flex-1 flex flex-col">
                                  <div className={`whitespace-pre-wrap text-sm flex-1 overflow-y-auto max-h-[300px] ${
                                    darkMode ? 'text-gray-200' : 'text-gray-700'
                                  }`} style={{ maxHeight: '300px' }}>
                                    {response.content}
                                  </div>
                                  <div className="mt-2 flex justify-end">
                                    <button
                                      onClick={async () => {
                                        if (response.content) {
                                          await navigator.clipboard.writeText(response.content);
                                          // Set copied state for this specific response
                                          setCopiedResponses(prev => ({ ...prev, [`${session.id}-${modelId}`]: true }));
                                          // Reset after 2 seconds
                                          setTimeout(() => {
                                            setCopiedResponses(prev => {
                                              const newCopied = { ...prev };
                                              delete newCopied[`${session.id}-${modelId}`];
                                              return newCopied;
                                            });
                                          }, 2000);
                                        }
                                      }}
                                      className={`p-1.5 rounded transition-all duration-300 transform hover:scale-110 ${
                                        copiedResponses[`${session.id}-${modelId}`] 
                                          ? 'text-green-500 animate-pulse' 
                                          : darkMode 
                                            ? 'text-gray-400 hover:bg-gray-600' 
                                            : 'text-gray-500 hover:bg-gray-200'
                                      }`}
                                      title="Copy response"
                                    >
                                      <div className="transition-all duration-300">
                                      {copiedResponses[`${session.id}-${modelId}`] ? (
                                        <Check className="w-4 h-4" />
                                      ) : (
                                        <Copy className="w-4 h-4" />
                                      )}
                                    </div>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className={`text-sm italic flex-1 flex items-center ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  No response
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`text-center py-12 rounded-xl ${
                darkMode ? 'bg-gray-800/30' : 'bg-gray-50'
              }`}>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  No responses found for this session.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}