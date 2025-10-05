'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Clock, MessageSquare, Trash2, User, LogOut, Cog, Brain, Plus, BarChart3, ChevronDown, CreditCard, Moon, Sun, X, Filter, SortDesc, Calendar, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { usePopup } from '@/contexts/PopupContext'
import { chatHistoryService } from '@/services/chatHistory.service'
import DeleteAccountPopup from '../layout/DeleteAccountPopup'
import AIResponseCard from '../chat/AIResponseCard'
import { AVAILABLE_MODELS } from '@/lib/models'
import { AIModel } from '@/types/app'
import { ChatResponse } from '@/types/chat'

interface ChatSession {
  id: string
  message: string
  timestamp: Date
  selectedModels: string[]
  responseCount: number
  responses?: ChatResponse[]
  bestResponse?: string
  responseTime?: number
}

export default function ModernHistoryInterface() {
  const { signOut, user } = useAuth()
  const pathname = usePathname()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { openPaymentPopup } = usePopup()
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [expandedSession, setExpandedSession] = useState<string | null>(null)
  // New state for sort and filter
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostResponses'>('newest')
  const [filterByModel, setFilterByModel] = useState<string>('all')
  const [showDeleteAllPopup, setShowDeleteAllPopup] = useState(false)
  const [showSortFilterDropdown, setShowSortFilterDropdown] = useState(false)

  const handleDeleteAccountConfirm = async (password: string) => {
    setIsDeleting(true)
    try {
      console.log('Deleting account with password:', password)
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      await signOut()
    } catch (error) {
      console.error('Error deleting account:', error)
    } finally {
      setIsDeleting(false)
      setShowDeletePopup(false)
    }
  }

  // Load chat sessions from API
  useEffect(() => {
    const loadChatSessions = async () => {
      // Try to load from API
      const apiSessions = await chatHistoryService.getChatSessions()
      if (apiSessions) {
        // Convert to the format expected by the history interface
        const sessionsWithResponseCount: ChatSession[] = apiSessions.map((session: any) => ({
          ...session,
          // Ensure timestamp is a proper Date object
          timestamp: session.timestamp instanceof Date ? session.timestamp : new Date(session.timestamp),
          responseCount: session.responses ? session.responses.length : 0
        }))
        setChatSessions(sessionsWithResponseCount)
        setFilteredSessions(sessionsWithResponseCount)
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
            // Ensure timestamp is a proper Date object
            timestamp: session.timestamp instanceof Date ? session.timestamp : new Date(session.timestamp),
            responseCount: session.responses ? session.responses.length : 0
          }))
          setChatSessions(sessionsWithDates)
          setFilteredSessions(sessionsWithDates)
        } catch (e) {
          console.error('Failed to parse saved sessions:', e)
        }
      }
    }

    loadChatSessions()
  }, [])

  // Filter and sort sessions based on search term, sort, and filter options
  useEffect(() => {
    let result = [...chatSessions]
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(session => 
        session.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.selectedModels.some(model => model.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    // Apply model filter
    if (filterByModel !== 'all') {
      result = result.filter(session => 
        session.selectedModels.includes(filterByModel)
      )
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        break
      case 'mostResponses':
        result.sort((a, b) => b.responseCount - a.responseCount)
        break
    }
    
    setFilteredSessions(result)
  }, [searchTerm, sortBy, filterByModel, chatSessions])

  const handleDeleteSession = async (id: string) => {
    // Delete from API
    await chatHistoryService.deleteChatSession(id)
    
    // Delete from local state
    const updatedSessions = chatSessions.filter(session => session.id !== id)
    setChatSessions(updatedSessions)
    setFilteredSessions(updatedSessions)
    
    // Also remove from localStorage
    const savedSessions = localStorage.getItem('aiFiestaChatSessions')
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions)
        const updatedLocalSessions = parsedSessions.filter((session: any) => session.id !== id)
        localStorage.setItem('aiFiestaChatSessions', JSON.stringify(updatedLocalSessions))
      } catch (e) {
        console.error('Failed to update localStorage:', e)
      }
    }
    
    // If the deleted session was expanded, close it
    if (expandedSession === id) {
      setExpandedSession(null)
    }
  }

  const handleDeleteAllSessions = async () => {
    // Delete all sessions from API
    for (const session of chatSessions) {
      await chatHistoryService.deleteChatSession(session.id)
    }
    
    // Clear local state
    setChatSessions([])
    setFilteredSessions([])
    
    // Clear localStorage
    localStorage.removeItem('aiFiestaChatSessions')
    
    // Close expanded session if any
    setExpandedSession(null)
    
    // Close the delete all popup
    setShowDeleteAllPopup(false)
  }

  const formatTimeAgo = (date: Date) => {
    // Ensure we have a proper Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  // Function to get model by ID
  const getModelById = (modelId: string) => {
    return AVAILABLE_MODELS.find(model => model.id === modelId)
  }

  // Function to convert our model type to the AIModel type expected by AIResponseCard
  const convertToAIModel = (modelId: string) => {
    const model = getModelById(modelId)
    if (!model) return null
    
    const aiModel: AIModel = {
      id: model.id,
      displayName: model.label,
      provider: model.provider,
      description: model.description || '',
      capabilities: model.capabilities || []
    }
    
    return aiModel
  }

  // Get unique models for filter dropdown
  const getUniqueModels = () => {
    const models = new Set<string>()
    chatSessions.forEach(session => {
      session.selectedModels.forEach(model => models.add(model))
    })
    return Array.from(models)
  }

  return (
    <div className={`flex h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Left Sidebar */}
      <div className={`w-80 backdrop-blur-xl border-r transition-colors duration-200 relative ${
        darkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-slate-200/50'
      }`}>
        {/* Sidebar Content Container */}
        <div className="flex flex-col h-full pb-20">
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
            <Link href="/chat">
              <button
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
            </Link>
          </div>

          {/* Navigation */}
          <div className="p-4 space-y-2">
            <Link
              href="/chat"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                pathname === '/chat'
                  ? darkMode 
                    ? 'text-white bg-gray-700/50 border border-gray-600' 
                    : 'text-slate-900 bg-slate-100/50 border border-slate-200'
                  : darkMode 
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
                pathname === '/history'
                  ? darkMode 
                    ? 'text-white bg-gray-700/50 border border-gray-600' 
                    : 'text-slate-900 bg-slate-100/50 border border-slate-200'
                  : darkMode 
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
                pathname === '/dashboard'
                  ? darkMode 
                    ? 'text-white bg-gray-700/50 border border-gray-600' 
                    : 'text-slate-900 bg-slate-100/50 border border-slate-200'
                  : darkMode 
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
          <div className="relative">
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
                  
                  {/* Dark Mode Toggle */}
                  <div 
                    className="flex items-center justify-between px-4 py-3 text-sm text-slate-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      toggleDarkMode();
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-gray-700 flex items-center justify-center">
                        {darkMode ? (
                          <Sun className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Moon className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                      <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2">
                    <div className="h-px bg-slate-200/30 dark:bg-gray-700/50 my-1"></div>
                  </div>
                  
                  {/* Add Delete Account option */}
                  <div 
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setShowDeletePopup(true);
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

      {/* Main History Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className={`backdrop-blur-sm border-b p-6 transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="max-w-7xl mx-auto">
            <h1 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Chat History
            </h1>
            
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search Bar */}
              <div className="relative max-w-md flex-1">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  darkMode ? 'text-gray-400' : 'text-slate-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm placeholder:text-slate-500 ${
                    darkMode 
                      ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder:text-gray-400 hover:bg-gray-700/70' 
                      : 'bg-white border border-slate-200/50 text-slate-900 hover:border-slate-300/50'
                  }`}
                />
              </div>
              
              {/* Sort and Filter Controls */}
              <div className="flex items-center space-x-3">
                {/* Delete All Button - Only show when there are sessions */}
                {chatSessions.length > 0 && (
                  <button
                    onClick={() => setShowDeleteAllPopup(true)}
                    className={`p-3 rounded-xl transition-colors duration-200 ${
                      darkMode 
                        ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                        : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
                    }`}
                    title="Delete all history"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                
                {/* Sort and Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortFilterDropdown(!showSortFilterDropdown)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:bg-gray-700/70' 
                        : 'bg-white border border-slate-200/50 text-slate-700 hover:border-slate-300/50'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Sort & Filter</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                  
                  {/* Sort and Filter Dropdown Menu */}
                  {showSortFilterDropdown && (
                    <div className={`absolute right-0 mt-2 w-64 rounded-xl border shadow-xl z-20 overflow-hidden ${
                      darkMode 
                        ? 'bg-gray-800/95 border-gray-700/50 backdrop-blur-xl' 
                        : 'bg-white/95 border-slate-200/50 backdrop-blur-xl'
                    }`}>
                      <div className="py-2">
                        {/* Sort Options */}
                        <div className="px-4 py-2">
                          <h3 className={`text-sm font-semibold mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            Sort By
                          </h3>
                          <div className="space-y-1">
                            <button
                              onClick={() => {
                                setSortBy('newest')
                                setShowSortFilterDropdown(false)
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                sortBy === 'newest'
                                  ? darkMode 
                                    ? 'bg-blue-900/30 text-blue-300' 
                                    : 'bg-blue-100 text-blue-700'
                                  : darkMode 
                                    ? 'text-gray-300 hover:bg-gray-700/50' 
                                    : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              Newest First
                            </button>
                            <button
                              onClick={() => {
                                setSortBy('oldest')
                                setShowSortFilterDropdown(false)
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                sortBy === 'oldest'
                                  ? darkMode 
                                    ? 'bg-blue-900/30 text-blue-300' 
                                    : 'bg-blue-100 text-blue-700'
                                  : darkMode 
                                    ? 'text-gray-300 hover:bg-gray-700/50' 
                                    : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              Oldest First
                            </button>
                            <button
                              onClick={() => {
                                setSortBy('mostResponses')
                                setShowSortFilterDropdown(false)
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                sortBy === 'mostResponses'
                                  ? darkMode 
                                    ? 'bg-blue-900/30 text-blue-300' 
                                    : 'bg-blue-100 text-blue-700'
                                  : darkMode 
                                    ? 'text-gray-300 hover:bg-gray-700/50' 
                                    : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              Most Responses
                            </button>
                          </div>
                        </div>
                        
                        <div className={`px-4 py-2 border-t ${
                          darkMode ? 'border-gray-700/50' : 'border-slate-200/50'
                        }`}>
                          <h3 className={`text-sm font-semibold mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            Filter By Model
                          </h3>
                          <div className="space-y-1">
                            <button
                              onClick={() => {
                                setFilterByModel('all')
                                setShowSortFilterDropdown(false)
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                filterByModel === 'all'
                                  ? darkMode 
                                    ? 'bg-blue-900/30 text-blue-300' 
                                    : 'bg-blue-100 text-blue-700'
                                  : darkMode 
                                    ? 'text-gray-300 hover:bg-gray-700/50' 
                                    : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              All Models
                            </button>
                            {getUniqueModels().map(modelId => {
                              const model = getModelById(modelId)
                              return (
                                <button
                                  key={modelId}
                                  onClick={() => {
                                    setFilterByModel(modelId)
                                    setShowSortFilterDropdown(false)
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                    filterByModel === modelId
                                      ? darkMode 
                                        ? 'bg-blue-900/30 text-blue-300' 
                                        : 'bg-blue-100 text-blue-700'
                                      : darkMode 
                                        ? 'text-gray-300 hover:bg-gray-700/50' 
                                        : 'text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  {model?.provider || modelId}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <div className="max-w-7xl mx-auto">
              {filteredSessions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
                    darkMode ? 'bg-gray-800' : 'bg-slate-100'
                  }`}>
                    <Clock className={`w-10 h-10 ${
                      darkMode ? 'text-gray-500' : 'text-slate-400'
                    }`} />
                  </div>
                  <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {searchTerm || filterByModel !== 'all' ? 'No matching conversations' : 'No conversation history'}
                  </h2>
                  <p className={`text-lg mb-8 text-center max-w-md transition-colors duration-200 ${
                    darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    {searchTerm || filterByModel !== 'all'
                      ? 'Try adjusting your search terms or filters' 
                      : 'Start a new conversation to see it appear here'}
                  </p>
                  <Link href="/chat">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]">
                      Start New Chat
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredSessions.map((session) => (
                    <div 
                      key={session.id}
                      className={`rounded-2xl border transition-all duration-200 ${
                        selectedSession === session.id
                          ? darkMode
                            ? 'border-blue-500 bg-blue-900/10'
                            : 'border-blue-500 bg-blue-50'
                          : darkMode
                            ? 'bg-gray-800/30 border-gray-700/30 hover:border-gray-600/50'
                            : 'bg-white/30 border-slate-200/30 hover:border-slate-300/50'
                      }`}
                    >
                      <div 
                        className="p-5 cursor-pointer"
                        onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className={`w-5 h-5 ${
                              darkMode ? 'text-gray-400' : 'text-slate-500'
                            }`} />
                            <span className={`text-sm font-medium ${
                              darkMode ? 'text-gray-300' : 'text-slate-600'
                            }`}>
                              {formatTimeAgo(session.timestamp)}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSession(session.id);
                            }}
                            className={`p-1 rounded-lg transition-colors duration-200 ${
                              darkMode 
                                ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                                : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
                            }`}
                            title="Delete conversation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <h3 className={`font-semibold mb-3 line-clamp-2 transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {session.message}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {session.selectedModels.slice(0, 3).map((modelId) => {
                              const model = getModelById(modelId)
                              return (
                                <span 
                                  key={modelId}
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    darkMode 
                                      ? 'bg-gray-700 text-gray-300' 
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {model?.provider || modelId}
                                </span>
                              )
                            })}
                            {session.selectedModels.length > 3 && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                darkMode 
                                  ? 'bg-gray-700 text-gray-300' 
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                +{session.selectedModels.length - 3}
                              </span>
                            )}
                          </div>
                          
                          <div className={`flex items-center space-x-1 text-xs ${
                            darkMode ? 'text-gray-400' : 'text-slate-500'
                          }`}>
                            <MessageSquare className="w-4 h-4" />
                            <span>{session.responseCount}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded Session Content */}
                      {expandedSession === session.id && (
                        <div className={`border-t p-5 transition-all duration-300 ${
                          darkMode ? 'border-gray-700/30' : 'border-slate-200/30'
                        }`}>
                          {/* Close button */}
                          <div className="flex justify-end mb-4">
                            <button
                              onClick={() => setExpandedSession(null)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                darkMode 
                                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                              }`}
                              title="Close"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          
                          {/* User Message */}
                          <div className={`mb-6 p-4 rounded-xl ${
                            darkMode ? 'bg-gray-700/30' : 'bg-slate-50'
                          }`}>
                            <div className="flex items-start space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                darkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                              }`}>
                                <span className={`font-bold text-sm ${
                                  darkMode ? 'text-blue-300' : 'text-blue-700'
                                }`}>U</span>
                              </div>
                              <div>
                                <p className={`font-medium mb-1 ${
                                  darkMode ? 'text-gray-300' : 'text-slate-700'
                                }`}>Your Message</p>
                                <p className={`${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                  {session.message}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* AI Responses */}
                          {session.responses && session.responses.length > 0 ? (
                            <div>
                              <h4 className={`text-lg font-semibold mb-4 ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                AI Responses
                              </h4>
                              <div className={`grid gap-6 ${
                                session.selectedModels.length === 1 ? 'grid-cols-1 max-w-4xl' :
                                session.selectedModels.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
                                session.selectedModels.length === 3 ? 'grid-cols-1 lg:grid-cols-3' :
                                session.selectedModels.length <= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                                session.selectedModels.length <= 6 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                              }`}>
                                {session.selectedModels.map((modelId) => {
                                  const model = convertToAIModel(modelId)
                                  const response = session.responses?.find((r: any) => r.model === modelId)
                                  
                                  if (!model) return null
                                  
                                  return (
                                    <AIResponseCard
                                      key={`${session.id}-${modelId}`}
                                      model={model}
                                      content={response?.content || ''}
                                      loading={false}
                                      error={response?.error}
                                      isBestResponse={session.bestResponse === modelId}
                                      responseTime={response?.responseTime}
                                    />
                                  )
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className={`text-center py-8 rounded-xl ${
                              darkMode ? 'bg-gray-700/30' : 'bg-slate-50'
                            }`}>
                              <p className={darkMode ? 'text-gray-400' : 'text-slate-500'}>
                                No responses found for this session.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete All Confirmation Popup */}
      {showDeleteAllPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl border shadow-xl max-w-md w-full ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Delete All History
                </h3>
                <button
                  onClick={() => setShowDeleteAllPopup(false)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className={`mb-6 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Are you sure you want to delete all chat history? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteAllPopup(false)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAllSessions}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-200"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <DeleteAccountPopup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteAccountConfirm}
        isLoading={isDeleting}
      />
    </div>
  )
}