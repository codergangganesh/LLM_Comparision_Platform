'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { AVAILABLE_MODELS } from '@/lib/models'
import { AIModel } from '@/types/app'
import { ChatSession, ChatResponse } from '@/types/chat'
import AIResponseCard from './AIResponseCard'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { usePopup } from '@/contexts/PopupContext'
import { chatHistoryService } from '@/services/chatHistory.service'
import DeleteAccountPopup from '../layout/DeleteAccountPopup'
import BlankComparisonPage from './BlankComparisonPage'
import ChatSidebar from './sections/ChatSidebar'
import ModelSelectorSection from './sections/ModelSelectorSection'

interface ModernChatInterfaceProps {
  initialConversation?: ChatSession | null
}

export default function ModernChatInterface({ initialConversation }: ModernChatInterfaceProps) {
  const { signOut, user } = useAuth()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { openPaymentPopup } = usePopup()
  const [message, setMessage] = useState('')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>(
    AVAILABLE_MODELS.slice(0, 2).map(model => model.id)
  )
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [showBlankPage, setShowBlankPage] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Memoize suggested prompts to prevent unnecessary re-renders
  const suggestedPrompts = useMemo(() => [
    "Explain quantum computing in simple terms",
    "Write a creative story about time travel",
    "Compare the benefits of renewable energy sources",
    "Create a business plan for a tech startup"
  ], [])

  // Memoize popular prompts to prevent unnecessary re-renders
  const popularPrompts = useMemo(() => [
    "How does machine learning work?",
    "Write a business proposal for sustainable energy",
    "Explain blockchain technology simply",
    "Create a workout plan for beginners"
  ], [])

  // Memoize session cache to prevent unnecessary re-renders
  const [sessionCache, setSessionCache] = useState<{[key: string]: ChatSession[]}>({})

  // Memoize the loadChatSessions function to prevent recreation on every render
  const loadChatSessions = useCallback(async () => {
    // Check if we're in a fresh comparison state
    const isFreshComparison = localStorage.getItem('freshComparison') === 'true'
    if (isFreshComparison) {
      // Clear the flag and initialize empty state
      localStorage.removeItem('freshComparison')
      setChatSessions([])
      setCurrentSessionId(null)
      return
    }
    
    // First check memory cache for instant display
    const cachedKey = `user_${user?.id}`
    if (sessionCache[cachedKey]) {
      const sessionsWithDates: ChatSession[] = sessionCache[cachedKey].map((session) => ({
        ...session,
        timestamp: session.timestamp instanceof Date ? session.timestamp : new Date(session.timestamp),
        selectedModels: session.selectedModels || []
      }))
      setChatSessions(sessionsWithDates)
      
      // Set the most recent session as the current session
      if (sessionsWithDates.length > 0 && !currentSessionId) {
        const mostRecentSession = sessionsWithDates.reduce((latest: ChatSession, session: ChatSession) => 
          new Date(session.timestamp) > new Date(latest.timestamp) ? session : latest,
          sessionsWithDates[0]
        )
        setCurrentSessionId(mostRecentSession.id)
      }
      return
    }
    
    // If not in memory cache, try localStorage for faster retrieval
    const savedSessions = localStorage.getItem('aiFiestaChatSessions')
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions)
        // Convert timestamp strings back to Date objects
        const sessionsWithDates: ChatSession[] = parsedSessions.map((session: {id: string, message: string, responses: ChatResponse[], timestamp: string | Date, selectedModels?: string[], bestResponse?: string, responseTime?: number}) => ({
          ...session,
          timestamp: session.timestamp instanceof Date ? session.timestamp : new Date(session.timestamp),
          selectedModels: session.selectedModels || []
        }))
        setChatSessions(sessionsWithDates)
        
        // Set the most recent session as the current session
        if (sessionsWithDates.length > 0 && !currentSessionId) {
          const mostRecentSession = sessionsWithDates.reduce((latest: ChatSession, session: ChatSession) => 
            new Date(session.timestamp) > new Date(latest.timestamp) ? session : latest,
            sessionsWithDates[0]
          )
          setCurrentSessionId(mostRecentSession.id)
        }
        
        // Cache in memory for next time
        setSessionCache(prev => ({
          ...prev,
          [cachedKey]: sessionsWithDates
        }))
        
        return
      } catch (e) {
        console.error('Failed to parse saved sessions:', e)
      }
    }
    
    // Only make API call if no local data available
    const apiSessions = await chatHistoryService.getChatSessions()
    if (apiSessions && apiSessions.length > 0) {
      // Ensure timestamp is properly converted to Date objects
      const sessionsWithDates: ChatSession[] = apiSessions.map((session: {id: string, message: string, responses: ChatResponse[], timestamp: string | Date, selectedModels?: string[], bestResponse?: string, responseTime?: number}) => ({
        ...session,
        timestamp: session.timestamp instanceof Date ? session.timestamp : new Date(session.timestamp),
        selectedModels: session.selectedModels || []
      }))
      setChatSessions(sessionsWithDates)
      
      // Set the most recent session as the current session
      if (sessionsWithDates.length > 0 && !currentSessionId) {
        const mostRecentSession = sessionsWithDates.reduce((latest: ChatSession, session: ChatSession) => 
          new Date(session.timestamp) > new Date(latest.timestamp) ? session : latest,
          sessionsWithDates[0]
        )
        setCurrentSessionId(mostRecentSession.id)
      }
      
      // Cache in both memory and localStorage
      setSessionCache(prev => ({
        ...prev,
        [cachedKey]: sessionsWithDates
      }))
      
      // Save to localStorage for offline access
      const sessionsToSave = sessionsWithDates.map(session => ({
        ...session,
        timestamp: session.timestamp.toISOString()
      }))
      localStorage.setItem('aiFiestaChatSessions', JSON.stringify(sessionsToSave))
    }
  }, [user?.id, sessionCache, currentSessionId])

  // Load chat sessions from API on component mount
  useEffect(() => {
    loadChatSessions()
  }, [loadChatSessions])

  // Memoize the saveChatSessions function to prevent recreation on every render
  const saveChatSessions = useCallback(async () => {
    if (chatSessions.length > 0) {
      // Save the most recent session to API
      const mostRecentSession = chatSessions.reduce((latest: ChatSession, session: ChatSession) => 
        new Date(session.timestamp) > new Date(latest.timestamp) ? session : latest,
        chatSessions[0]
      )
      
      console.log('Attempting to save session to database:', JSON.stringify(mostRecentSession, null, 2));
      const saveResult = await chatHistoryService.saveChatSession(mostRecentSession)
      console.log('Database save result:', saveResult);
      
      if (!saveResult) {
        console.warn('Failed to save to database, data will only be available locally');
      }
    }
    
    // Also save to localStorage for offline access
    if (chatSessions.length > 0) {
      // When saving, convert Date objects to strings
      const sessionsToSave = chatSessions.map(session => {
        // Ensure timestamp is a Date object before calling toISOString
        const timestamp = session.timestamp instanceof Date 
          ? session.timestamp 
          : new Date(session.timestamp);
          
        return {
          ...session,
          timestamp: timestamp.toISOString(),
          selectedModels: session.selectedModels
        }
      })
      localStorage.setItem('aiFiestaChatSessions', JSON.stringify(sessionsToSave))
      
      // Update memory cache
      setSessionCache(prev => ({
        ...prev,
        [`user_${user?.id}`]: chatSessions
      }))
    }
  }, [chatSessions, user?.id])

  // Save chat sessions to API and cache whenever they change
  useEffect(() => {
    saveChatSessions()
  }, [saveChatSessions])

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNewChat = useCallback(() => {
    setShowBlankPage(true)
    setMessage('')
  }, [])

  const startNewComparison = useCallback((initialMessage?: string) => {
    setChatSessions([])
    setCurrentSessionId(null)
    // Clear localStorage and set a flag for fresh session
    localStorage.removeItem('aiFiestaChatSessions')
    localStorage.setItem('freshComparison', 'true')
    setShowBlankPage(false)
    if (initialMessage) {
      setMessage(initialMessage)
    }
  }, [])

  const handleModelToggle = useCallback((modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || selectedModels.length === 0) return

    const currentMsg = message.trim()
    setLoading(selectedModels)
    
    // Create new session with current selected models
    const newSessionId = Date.now().toString()
    const newSession: ChatSession = {
      id: newSessionId,
      message: currentMsg,
      responses: [],
      timestamp: new Date(),
      selectedModels: [...selectedModels]
    }
    
    // Add to sessions list
    setChatSessions(prev => [...prev, newSession])
    setCurrentSessionId(newSessionId)
    setMessage('')

    try {
      const startTime = Date.now()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMsg,
          models: selectedModels
        })
      })

      const endTime = Date.now()
      const responseTime = (endTime - startTime) / 1000

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      
      // Fix: Ensure we're accessing the correct data structure
      const results = data.results || []
      
      // Process responses to match ChatResponse structure
      const processedResponses: ChatResponse[] = results.map((result: {model: string, content: string, error?: string}) => ({
        model: result.model,
        content: result.content || '',
        error: result.error,
        success: !result.error
      }))
      
      // Update session with responses and response time
      setChatSessions(prev => prev.map(session => 
        session.id === newSessionId 
          ? { 
              ...session, 
              responses: processedResponses,
              responseTime: data.responseTime || responseTime
            } 
          : session
      ))
    } catch (error: unknown) {
      // Type the error properly
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('Error sending message:', errorMessage)
      
      // Log more detailed error information
      console.error('Full error details:', {
        message: errorMessage,
        timestamp: new Date().toISOString(),
        selectedModels: selectedModels,
        userMessage: currentMsg
      })
      
      const errorResponses = selectedModels.map(model => ({
        model,
        content: '',
        error: `Failed to send message: ${errorMessage}`,
        success: false
      }))
      
      setChatSessions(prev => prev.map(session => 
        session.id === newSessionId 
          ? { ...session, responses: errorResponses } 
          : session
      ))
    } finally {
      setLoading([])
    }
  }, [message, selectedModels])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }, [handleSubmit])

  const handleMarkBest = useCallback((modelId: string) => {
    if (!currentSessionId) return
    
    setChatSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        const newBestResponse = session.bestResponse === modelId ? undefined : modelId
        return {
          ...session,
          bestResponse: newBestResponse
        }
      }
      return session
    }))
  }, [currentSessionId])

  const getModelById = useCallback((modelId: string) => {
    return AVAILABLE_MODELS.find(model => model.id === modelId)
  }, [])

  // Add the delete account confirmation handler
  const handleDeleteAccountConfirm = useCallback(async (password: string) => {
    setIsDeleting(true)
    try {
      // Here you would implement the actual account deletion logic
      // This might involve:
      // 1. Verifying the password with your authentication service
      // 2. Deleting user data from your database
      // 3. Deleting the user from your authentication service
      // 4. Signing out the user
      console.log('Deleting account with password:', password)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // After successful deletion, sign out the user
      await signOut()
    } catch (error) {
      console.error('Error deleting account:', error)
      // Handle error (show error message to user)
    } finally {
      setIsDeleting(false)
      setShowDeletePopup(false)
    }
  }, [signOut])

  // Memoize the ChatSidebar component props to prevent unnecessary re-renders
  const chatSidebarProps = useMemo(() => ({
    darkMode,
    showBlankPage,
    setShowBlankPage,
    showDeletePopup,
    setShowDeletePopup,
    isDeleting,
    setIsDeleting,
    user,
    signOut
  }), [darkMode, showBlankPage, showDeletePopup, isDeleting, user, signOut])

  // Memoize the ModelSelectorSection component props to prevent unnecessary re-renders
  const modelSelectorProps = useMemo(() => ({
    darkMode,
    showModelSelector,
    setShowModelSelector,
    selectedModels,
    handleModelToggle
  }), [darkMode, showModelSelector, selectedModels, handleModelToggle])

  return (
    <div className={`flex h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <ChatSidebar {...chatSidebarProps} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ModelSelectorSection {...modelSelectorProps} />

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          {showBlankPage ? (
            <BlankComparisonPage onStartNew={startNewComparison} />
          ) : chatSessions.length > 0 ? (
            <div className="h-full flex flex-col">
              {/* All Chat Sessions */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto space-y-8">
                  {chatSessions.map((session) => (
                    <div key={session.id} className={`rounded-2xl border transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-800/30 border-gray-700/30' 
                        : 'bg-white/30 border-slate-200/30'
                    }`}>
                      {/* User Message */}
                      <div className={`border-b p-6 transition-colors duration-200 ${
                        darkMode 
                          ? 'border-gray-700/30' 
                          : 'border-slate-200/30'
                      }`}>
                        <div className="max-w-4xl mx-auto">
                          <div className="flex items-start space-x-4">
                            <div className={`w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center transition-colors duration-200 ${
                              darkMode 
                                ? 'from-blue-600 to-purple-600' 
                                : 'from-slate-600 to-slate-700'
                            }`}>
                              <span className="text-white text-sm font-bold">U</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <p className={`font-medium transition-colors duration-200 ${
                                  darkMode ? 'text-white' : 'text-slate-900'
                                }`}>
                                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                                </p>
                              </div>
                              <p className={`mt-2 transition-colors duration-200 ${
                                darkMode ? 'text-gray-200' : 'text-slate-800'
                              }`}>{session.message}</p>
                              <p className={`text-xs mt-1 transition-colors duration-200 ${
                                darkMode ? 'text-gray-400' : 'text-slate-500'
                              }`}>
                                {session.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Responses */}
                      <div className="p-6">
                        <div className={`grid gap-6 ${
                          session.selectedModels.length === 1 ? 'grid-cols-1 max-w-4xl' :
                          session.selectedModels.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
                          session.selectedModels.length === 3 ? 'grid-cols-1 lg:grid-cols-3' :
                          session.selectedModels.length <= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                          session.selectedModels.length <= 6 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        }`}>
                          {session.selectedModels.map((modelId) => {
                            const model = getModelById(modelId)
                            const response = session.responses.find(r => r.model === modelId)
                            const isLoading = loading.includes(modelId) && session.id === currentSessionId
                            
                            if (!model) return null

                            // Convert our model type to the AIModel type expected by AIResponseCard
                            const aiModel: AIModel = {
                              id: model.id,
                              displayName: model.label,
                              provider: model.provider,
                              description: model.description || '',
                              capabilities: model.capabilities || []
                            }

                            return (
                              <AIResponseCard
                                key={`${session.id}-${modelId}`}
                                model={aiModel}
                                content={response?.content || ''}
                                loading={isLoading}
                                error={response?.error}
                                isBestResponse={session.bestResponse === modelId}
                                onMarkBest={() => handleMarkBest(modelId)}
                                responseTime={response?.responseTime}
                              />
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Welcome State
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <div className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl transition-transform duration-300 hover:scale-105 ${
                  darkMode ? 'shadow-blue-500/20' : 'shadow-blue-500/30'
                }`}>
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className={`text-3xl font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Start Your AI Comparison
                </h2>
                <p className={`text-lg mb-8 leading-relaxed transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Send one message to multiple AI models and compare their responses side by side. 
                  Click &quot;New Comparison&quot; to begin.
                </p>
                
                {/* Suggested Prompts Section */}
                <div className="mb-8">
                  <h3 className={`text-lg font-semibold mb-4 text-left ${
                    darkMode ? 'text-gray-200' : 'text-slate-800'
                  }`}>
                    Try these prompts:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(prompt)}
                        className={`p-4 text-left rounded-xl transition-all duration-200 hover:scale-[1.02] group ${
                          darkMode 
                            ? 'bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700/50 backdrop-blur-sm' 
                            : 'bg-white/70 hover:bg-white/90 border border-slate-200/50 shadow-sm backdrop-blur-sm'
                        } hover:shadow-lg`}>
                        <div className="flex items-start space-x-3">
                          <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
                            darkMode 
                              ? 'bg-gradient-to-br from-violet-900/50 to-purple-900/50 group-hover:from-violet-800/70 group-hover:to-purple-800/70' 
                              : 'bg-gradient-to-br from-violet-100 to-purple-100 group-hover:from-violet-200 group-hover:to-purple-200'
                          }`}>
                            <Sparkles className={`w-3 h-3 ${
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
                
               
              </div>
            </div>
          )}
        </div>

        {/* Message Input - Only show when not on blank page */}
        {!showBlankPage && (
          <div className={`border-t backdrop-blur-sm p-6 transition-colors duration-200 ${
            darkMode 
              ? 'border-gray-700/30 bg-gray-800/60' 
              : 'border-slate-200/30 bg-white/60'
          }`}>
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything to compare AI models... (Enter to send, Shift+Enter for new line)"
                    className={`w-full px-6 py-4 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm placeholder:text-slate-500 ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 hover:bg-gray-700/70' 
                        : 'bg-white border-slate-200/50 text-slate-900 hover:border-slate-300/50'
                    }`}
                    rows={1}
                    style={{ minHeight: '56px', maxHeight: '120px' }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Only show model status when models are selected */}
                    {selectedModels.length > 0 && (
                      <div className={`text-sm transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-600'
                      }`}>
                        {selectedModels.length === 1 
                          ? '1 model ready' 
                          : `${selectedModels.length} models ready`
                        }
                      </div>
                    )}
                    {loading.length > 0 && (
                      <div className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        <div className={`w-4 h-4 border-2 rounded-full animate-spin transition-colors duration-200 ${
                          darkMode 
                            ? 'border-blue-800 border-t-blue-400' 
                            : 'border-blue-200 border-t-blue-600'
                        }`}></div>
                        <span>Processing...</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!message.trim() || selectedModels.length === 0 || loading.length > 0}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      
      {/* Add DeleteAccountPopup at the end of the component */}
      <DeleteAccountPopup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteAccountConfirm}
        isLoading={isDeleting}
      />
    </div>
  )
}