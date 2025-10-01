'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Settings, Plus, MessageSquare, Sparkles, Brain, BarChart3, ChevronDown, User, LogOut, Cog, Clock, Trash2, CreditCard } from 'lucide-react'
import { AVAILABLE_MODELS } from '@/lib/models'
import { AIModel } from '@/types/app'
import { ChatSession, ChatResponse } from '@/types/chat'
import AIResponseCard from './AIResponseCard'
import ModelSelector from './ModelSelector'
import BlankComparisonPage from './BlankComparisonPage'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { usePopup } from '@/contexts/PopupContext'
import { chatHistoryService } from '@/services/chatHistory.service'
import DeleteAccountPopup from '../layout/DeleteAccountPopup'

interface ModernChatInterfaceProps {
  initialConversation?: any | null
}

export default function ModernChatInterface({ initialConversation }: ModernChatInterfaceProps) {
  const { signOut, user } = useAuth()
  const { darkMode } = useDarkMode()
  const { openPaymentPopup } = usePopup()
  const [message, setMessage] = useState('')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>(
    AVAILABLE_MODELS.slice(0, 3).map(model => model.id)
  )
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [showBlankPage, setShowBlankPage] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load chat sessions from API on component mount
  useEffect(() => {
    const loadChatSessions = async () => {
      // Try to load from API
      const apiSessions = await chatHistoryService.getChatSessions()
      if (apiSessions && apiSessions.length > 0) {
        // Ensure timestamp is properly converted to Date objects
        const sessionsWithDates: ChatSession[] = apiSessions.map((session: any) => ({
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
      
      // Fallback to localStorage if no API sessions
      const savedSessions = localStorage.getItem('aiFiestaChatSessions')
      if (savedSessions) {
        try {
          const parsedSessions = JSON.parse(savedSessions)
          // Convert timestamp strings back to Date objects
          const sessionsWithDates: ChatSession[] = parsedSessions.map((session: any) => ({
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
        } catch (e) {
          console.error('Failed to parse saved sessions:', e)
        }
      }
    }

    loadChatSessions()
  }, [])

  // Save chat sessions to API whenever they change
  useEffect(() => {
    const saveChatSessions = async () => {
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
      }
    }

    saveChatSessions()
  }, [chatSessions])

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

  const handleNewChat = () => {
    setShowBlankPage(true)
    setMessage('')
  }

  const startNewComparison = () => {
    setChatSessions([])
    setCurrentSessionId(null)
    localStorage.removeItem('aiFiestaChatSessions')
    setShowBlankPage(false)
  }

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
      
      // Update session with responses and response time
      setChatSessions(prev => prev.map(session => 
        session.id === newSessionId 
          ? { 
              ...session, 
              responses: data.results,
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
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleMarkBest = (modelId: string) => {
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
  }

  const getModelById = (modelId: string) => {
    return AVAILABLE_MODELS.find(model => model.id === modelId)
  }

  // Add the delete account confirmation handler
  const handleDeleteAccountConfirm = async (password: string) => {
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
  }

  return (
    <div className={`flex h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Left Sidebar */}
      <div className={`w-80 backdrop-blur-xl border-r transition-colors duration-200 relative ${
        darkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-slate-200/50'
      }`}>
        {/* Sidebar Content Container */}
        <div className="flex flex-col h-full pb-20"> {/* Added bottom padding for dropdown */}
        {/* Header with Logo */}
        <div className={`p-6 border-b transition-colors duration-200 ${
          darkMode ? 'border-gray-700' : 'border-slate-200/30'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-200 ${
                darkMode 
                  ? 'from-white to-gray-200' 
                  : 'from-slate-900 to-slate-700'
              }`}>
                AI Fiesta
              </h1>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] group relative"
            title="Start New Comparison"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>New Comparison</span>
            {/* Tooltip for hover */}
            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
              Start a new AI model comparison
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 -mr-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-r-gray-900 border-t-transparent border-b-transparent"></div>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <Link
            href="/chat"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
            title="Current Chat"
          >
            <MessageSquare className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">Current Chat</span>
            {/* Tooltip for hover */}
            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
              View your current chat session
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 -mr-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-r-gray-900 border-t-transparent border-b-transparent"></div>
            </div>
          </Link>
          
          <Link
            href="/history"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
            title="History"
          >
            <Clock className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">History</span>
            {/* Tooltip for hover */}
            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
              View your chat history
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 -mr-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-r-gray-900 border-t-transparent border-b-transparent"></div>
            </div>
          </Link>
          
          <Link
            href="/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
            title="Dashboard"
          >
            <BarChart3 className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">Dashboard</span>
            {/* Tooltip for hover */}
            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
              View analytics and statistics
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 -mr-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-r-gray-900 border-t-transparent border-b-transparent"></div>
            </div>
          </Link>
        </div>
        </div>
        
        {/* Profile Section at Bottom */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl' 
            : 'bg-white/95 border-slate-200/30 backdrop-blur-xl'
        }`}>
          <div className="relative" ref={profileDropdownRef}>
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-gray-700/10 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-all duration-300 ease-out"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              title="User Profile"
            >
              <div className="text-sm text-slate-700 dark:text-gray-300 truncate">
                {user?.email || 'user@example.com'}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  {user?.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-white">
                      {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-gray-400 transition-all duration-300 ease-out ${
                  showProfileDropdown ? 'rotate-180' : ''
                }`} />
              </div>
            </div>
            
            {/* Modern Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute bottom-full right-0 mb-2 w-64 rounded-2xl border shadow-xl transition-all duration-300 transform origin-bottom bg-white border-slate-200/50 dark:bg-gray-800 dark:border-gray-700/50 backdrop-blur-xl overflow-hidden">
                <div className="py-2">
                  {/* User Profile Header */}
                  <div className="px-4 py-4 border-b border-slate-200/30 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-gray-700/30 dark:to-gray-800/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                        {user?.user_metadata?.avatar_url ? (
                          <img 
                            src={user.user_metadata.avatar_url} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-white">
                            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'User')}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-gray-400 truncate">
                          {user?.email || 'user@example.com'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <Link href="/dashboard/profile">
                    <div 
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
                      onClick={() => {
                        setShowProfileDropdown(false);
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="font-medium">Profile</span>
                    </div>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      openPaymentPopup();
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-slate-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-gray-700 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="font-medium">Pricing Plans</span>
                  </button>
                  
                  <Link href="/dashboard/settings">
                    <div 
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
                      onClick={() => {
                        setShowProfileDropdown(false);
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-gray-700 flex items-center justify-center">
                        <Cog className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="font-medium">Settings</span>
                    </div>
                  </Link>
                  
                  <div className="px-4 py-2">
                    <div className="h-px bg-slate-200/30 dark:bg-gray-700/50 my-1"></div>
                  </div>
                  
                  {/* Add Delete Account option */}
                  <div 
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setShowDeletePopup(true); // Show delete popup
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="font-medium">Delete Account</span>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      signOut();
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="font-medium">Logout</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar with Model Selection */}
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
                                  User
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
                  Click "New Comparison" to begin.
                </p>
                
                <button
                  onClick={startNewComparison}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start New Comparison
                </button>
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