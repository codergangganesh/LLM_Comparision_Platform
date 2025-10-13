'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Clock, MessageSquare, Trash2, User, LogOut, Cog, Brain, Plus, BarChart3, ChevronDown, CreditCard, Moon, Sun, X, Filter, SortDesc, Calendar, ArrowUpDown, Sparkles, AlertCircle, Copy, Grid3X3, List, Check } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { usePopup } from '@/contexts/PopupContext'
import { chatHistoryService } from '@/services/chatHistory.service'
import DeleteAccountPopup from '../layout/DeleteAccountPopup'
import AIResponseCard from '../chat/AIResponseCard'
import HistoryDetailModal from './HistoryDetailModal'
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

// Add cache for chat sessions
let chatSessionsCache: ChatSession[] | null = null
let lastFetchTime: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

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
  const [selectedResponse, setSelectedResponse] = useState<{model: AIModel, content: string, error?: string, responseTime?: number, isBestResponse?: boolean} | null>(null);
  // New state for sort and filter
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostResponses'>('newest')
  const [filterByModel, setFilterByModel] = useState<string>('all')
  const [showDeleteAllPopup, setShowDeleteAllPopup] = useState(false)
  const [showSortFilterDropdown, setShowSortFilterDropdown] = useState<'sort' | 'filter' | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [modalSession, setModalSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false); // New state for delete all loading

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

  // Optimized function to load chat sessions with caching
  const loadChatSessions = useCallback(async () => {
    // Check if we have valid cached data
    const now = Date.now();
    if (chatSessionsCache && lastFetchTime && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('Using cached chat sessions');
      setChatSessions(chatSessionsCache);
      setFilteredSessions(chatSessionsCache);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Try to load from API
      const apiSessions = await chatHistoryService.getChatSessions();
      if (apiSessions) {
        // Convert to the format expected by the history interface
        const sessionsWithResponseCount: ChatSession[] = apiSessions.map((session: {id: string, message: string, responses: ChatResponse[], timestamp: string | Date, selectedModels: string[], bestResponse?: string, responseTime?: number}) => ({
          ...session,
          // Ensure timestamp is a proper Date object
          timestamp: session.timestamp instanceof Date ? session.timestamp : new Date(session.timestamp),
          responseCount: session.responses ? session.responses.length : 0
        }));
        
        // Update cache
        chatSessionsCache = sessionsWithResponseCount;
        lastFetchTime = now;
        
        setChatSessions(sessionsWithResponseCount);
        setFilteredSessions(sessionsWithResponseCount);
        setIsLoading(false);
        return;
      }
      
      // Fallback to localStorage if no API sessions
      const savedSessions = localStorage.getItem('aiFiestaChatSessions');
      if (savedSessions) {
        try {
          const parsedSessions = JSON.parse(savedSessions);
          // Convert timestamp strings back to Date objects
          const sessionsWithDates: ChatSession[] = parsedSessions.map((session: {id: string, message: string, responses: ChatResponse[], timestamp: string | Date, selectedModels: string[], bestResponse?: string, responseTime?: number}) => ({
            ...session,
            // Ensure timestamp is a proper Date object
            timestamp: session.timestamp instanceof Date ? session.timestamp : new Date(session.timestamp),
            responseCount: session.responses ? session.responses.length : 0
          }));
          
          // Update cache
          chatSessionsCache = sessionsWithDates;
          lastFetchTime = now;
          
          setChatSessions(sessionsWithDates);
          setFilteredSessions(sessionsWithDates);
        } catch (e) {
          console.error('Failed to parse saved sessions:', e);
        }
      }
    } catch (err) {
      console.error('Error loading chat sessions:', err);
      setError('Failed to load chat history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load chat sessions from API with caching
  useEffect(() => {
    loadChatSessions();
  }, [loadChatSessions]);

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
        const updatedLocalSessions = parsedSessions.filter((session: {id: string, message: string, responses: ChatResponse[], timestamp: string | Date, selectedModels: string[], bestResponse?: string, responseTime?: number}) => session.id !== id)
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
    setIsDeletingAll(true); // Set loading state to true
    try {
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
    } catch (error) {
      console.error('Error deleting all sessions:', error)
    } finally {
      // Close the delete all popup and reset loading state
      setShowDeleteAllPopup(false)
      setIsDeletingAll(false)
    }
  }

  const formatTimeAgo = (date: Date) => {
    // Ensure we have a proper Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86600) return `${Math.floor(seconds / 3600)}h ago`;
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sortButton = document.getElementById('sort-button');
      const filterButton = document.getElementById('filter-button');
      const sortDropdown = document.getElementById('sort-dropdown');
      const filterDropdown = document.getElementById('filter-dropdown');
      
      // Check if click is outside both button and dropdown
      if (showSortFilterDropdown === 'sort') {
        if (sortButton && !sortButton.contains(event.target as Node) &&
            sortDropdown && !sortDropdown.contains(event.target as Node)) {
          setShowSortFilterDropdown(null);
        }
      }
      
      if (showSortFilterDropdown === 'filter') {
        if (filterButton && !filterButton.contains(event.target as Node) &&
            filterDropdown && !filterDropdown.contains(event.target as Node)) {
          setShowSortFilterDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortFilterDropdown]);

  return (
    <div className={`flex h-screen transition-all duration-700 ease-in-out ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-violet-900/90 to-black' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      {/* Left Sidebar */}
      <div className={`w-80 backdrop-blur-xl border-r transition-all duration-300 relative ${
        darkMode 
          ? 'bg-gray-800/90 border-gray-700/50' 
          : 'bg-white/90 border-slate-200/50'
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
                <Link href="/">
                  <h1 className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-200 ${
                    darkMode 
                      ? 'from-white to-gray-200' 
                      : 'from-slate-900 to-slate-700'
                  }`}>
                    AI Fiesta
                  </h1>
                </Link>
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
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/90 border-gray-700/50 backdrop-blur-xl' 
            : 'bg-white/90 border-slate-200/50 backdrop-blur-xl'
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
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileDropdown(false)}
                  aria-hidden="true"
                />
                <div className={`absolute bottom-full right-0 mb-2 w-72 rounded-2xl shadow-2xl transition-all duration-300 transform origin-bottom z-50 ${
                  darkMode
                    ? 'bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50 backdrop-blur-2xl' 
                    : 'bg-gradient-to-b from-white to-gray-50 border border-gray-200/70 backdrop-blur-2xl'
                }`}>
                  {/* User Profile Header */}
                  <div className={`px-5 py-4 rounded-t-2xl ${
                    darkMode 
                      ? 'bg-gradient-to-r from-gray-800/80 to-gray-900/80' 
                      : 'bg-gradient-to-r from-gray-50/80 to-white/80'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        {user?.user_metadata?.avatar_url ? (
                          <img 
                            src={user.user_metadata.avatar_url} 
                            alt="Profile" 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold text-white">
                            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-lg truncate ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'User')}
                        </p>
                        <p className={`text-sm truncate ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {user?.email || 'user@example.com'}
                        </p>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            darkMode 
                              ? 'bg-indigo-900/40 text-indigo-300' 
                              : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            Member
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    {/* Action Items */}
                    <Link href="/dashboard/profile">
                      <div 
                        className={`flex items-center space-x-4 w-full px-5 py-3 text-left transition-all duration-200 ${
                          darkMode 
                            ? 'hover:bg-blue-500/10' 
                            : 'hover:bg-blue-50'
                        }`}
                        onClick={() => {
                          setShowProfileDropdown(false);
                        }}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          darkMode 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-medium ${
                            darkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>Profile</p>
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>View and edit profile</p>
                        </div>
                      </div>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        openPaymentPopup();
                      }}
                      className={`flex items-center space-x-4 w-full px-5 py-3 text-left transition-all duration-200 group ${
                        darkMode 
                          ? 'hover:bg-indigo-500/10' 
                          : 'hover:bg-indigo-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        darkMode 
                          ? 'bg-indigo-500/20 text-indigo-400' 
                          : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`font-medium ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>Pricing Plans</p>
                        <p className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Manage your subscription</p>
                      </div>
                    </button>
                    
                    {/* Theme Toggle */}
                    <div 
                      className={`flex items-center justify-between px-5 py-3 transition-all duration-200 ${
                        darkMode 
                          ? 'hover:bg-amber-500/10' 
                          : 'hover:bg-amber-50'
                      }`}
                      onClick={() => {
                        setShowProfileDropdown(false);
                        toggleDarkMode();
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          darkMode 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-amber-100 text-amber-600'
                        }`}>
                          {darkMode ? (
                            <Sun className="w-5 h-5" />
                          ) : (
                            <Moon className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${
                            darkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>Theme</p>
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                          </p>
                        </div>
                      </div>
                      <div className={`relative w-12 h-6 rounded-full transition-colors ${
                        darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                          darkMode ? 'transform translate-x-7' : 'translate-x-1'
                        }`}></div>
                      </div>
                    </div>
                    
                    <div className={`px-5 py-2 ${
                      darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}>
                      <div className={`h-px ${
                        darkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'
                      } my-1`}></div>
                    </div>
                    
                    {/* Account Actions */}
                    <div 
                      className={`flex items-center space-x-4 w-full px-5 py-3 text-left transition-all duration-200 ${
                        darkMode 
                          ? 'hover:bg-rose-500/10' 
                          : 'hover:bg-rose-50'
                      }`}
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setShowDeletePopup(true);
                      }}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        darkMode 
                          ? 'bg-rose-500/20 text-rose-400' 
                          : 'bg-rose-100 text-rose-600'
                      }`}>
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`font-medium ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>Delete Account</p>
                        <p className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Permanently remove account</p>
                      </div>
                    </div>
                    
                    <div 
                      className={`flex items-center space-x-4 w-full px-5 py-3 text-left transition-all duration-200 ${
                        darkMode 
                          ? 'hover:bg-rose-500/10' 
                          : 'hover:bg-rose-50'
                      }`}
                      onClick={() => {
                        setShowProfileDropdown(false);
                        signOut();
                      }}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        darkMode 
                          ? 'bg-rose-500/20 text-rose-400' 
                          : 'bg-rose-100 text-rose-600'
                      }`}>
                        <LogOut className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`font-medium ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>Logout</p>
                        <p className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Sign out of your account</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main History Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className={`backdrop-blur-xl border-b p-6 transition-all duration-300 z-50 ${
          darkMode 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-slate-200/50'
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
                  className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 text-sm placeholder:text-slate-500 backdrop-blur-sm ${
                    darkMode 
                      ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder:text-gray-400 hover:bg-gray-700/70' 
                      : 'bg-white border border-slate-200/50 text-slate-900 hover:border-slate-300/50'
                  }`}
                />
              </div>
              
              {/* Sort and Filter Controls */}
              <div className="flex items-center space-x-3 relative">
                {/* Refresh Button */}
                <button
                  onClick={() => {
                    // Clear cache and reload
                    chatSessionsCache = null;
                    lastFetchTime = null;
                    chatHistoryService.clearCache();
                    loadChatSessions();
                  }}
                  className={`p-3 rounded-xl transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm ${
                    darkMode 
                      ? 'bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:border-gray-600/70 hover:shadow-lg' 
                      : 'bg-white/80 border border-slate-200/50 text-slate-700 hover:border-slate-300/70 hover:shadow-lg'
                  }`}
                  title="Refresh history"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <span className="hidden sm:inline font-medium">Refresh</span>
                </button>
                
                {/* Delete All Button - Only show when there are sessions */}
                {chatSessions.length > 0 && (
                  <button
                    onClick={() => setShowDeleteAllPopup(true)}
                    className={`p-3 rounded-xl transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm ${
                      darkMode 
                        ? 'bg-red-600/80 hover:bg-red-700/90 text-white border border-red-500/30 hover:border-red-400/50 hover:shadow-lg' 
                        : 'bg-red-500 hover:bg-red-600 text-white border border-red-400/30 hover:border-red-300/50 hover:shadow-lg'
                    }`}
                    title="Delete all history"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="hidden sm:inline font-medium">Delete All</span>
                  </button>
                )}
                
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    id="sort-button"
                    onClick={() => setShowSortFilterDropdown(showSortFilterDropdown === 'sort' ? null : 'sort')}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:bg-gray-700/70' 
                        : 'bg-white border border-slate-200/50 text-slate-700 hover:border-slate-300/50'
                    }`}
                  >
                    <SortDesc className="w-4 h-4" />
                    <span className="hidden sm:inline">Sort</span>
                  </button>
                  
                  {/* Sort Dropdown Menu */}
                  {showSortFilterDropdown === 'sort' && (
                    <div id="sort-dropdown" className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-2xl z-[9999] overflow-hidden backdrop-blur-xl ${
                      darkMode 
                        ? 'bg-gray-800/90 border-gray-700/50' 
                        : 'bg-white/90 border-slate-200/50'
                    }`}>
                      <div className="py-2">
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
                                setShowSortFilterDropdown(null)
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-between ${
                                sortBy === 'newest'
                                  ? darkMode 
                                    ? 'bg-blue-900/30 text-blue-300' 
                                    : 'bg-blue-100 text-blue-700'
                                  : darkMode 
                                    ? 'text-gray-300 hover:bg-gray-700/50' 
                                    : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>Newest First</span>
                              {sortBy === 'newest' && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSortBy('oldest')
                                setShowSortFilterDropdown(null)
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-between ${
                                sortBy === 'oldest'
                                  ? darkMode 
                                    ? 'bg-blue-900/30 text-blue-300' 
                                    : 'bg-blue-100 text-blue-700'
                                  : darkMode 
                                    ? 'text-gray-300 hover:bg-gray-700/50' 
                                    : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>Oldest First</span>
                              {sortBy === 'oldest' && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSortBy('mostResponses')
                                setShowSortFilterDropdown(null)
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-between ${
                                sortBy === 'mostResponses'
                                  ? darkMode 
                                    ? 'bg-blue-900/30 text-blue-300' 
                                    : 'bg-blue-100 text-blue-700'
                                  : darkMode 
                                    ? 'text-gray-300 hover:bg-gray-700/50' 
                                    : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>Most Responses</span>
                              {sortBy === 'mostResponses' && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    id="filter-button"
                    onClick={() => setShowSortFilterDropdown(showSortFilterDropdown === 'filter' ? null : 'filter')}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:bg-gray-700/70' 
                        : 'bg-white border border-slate-200/50 text-slate-700 hover:border-slate-300/50'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </button>
                  
                  {/* Filter Dropdown Menu */}
                  {showSortFilterDropdown === 'filter' && (
                    <div id="filter-dropdown" className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-2xl z-[9999] overflow-hidden backdrop-blur-xl ${
                      darkMode 
                        ? 'bg-gray-800/90 border-gray-700/50' 
                        : 'bg-white/90 border-slate-200/50'
                    }`}>
                      <div className="py-2">
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
                                setShowSortFilterDropdown(null)
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-between ${
                                filterByModel === 'all'
                                  ? darkMode 
                                    ? 'bg-blue-900/30 text-blue-300' 
                                    : 'bg-blue-100 text-blue-700'
                                  : darkMode 
                                    ? 'text-gray-300 hover:bg-gray-700/50' 
                                    : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>All Models</span>
                              {filterByModel === 'all' && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            {getUniqueModels().map(modelId => {
                              const model = getModelById(modelId)
                              return (
                                <button
                                  key={modelId}
                                  onClick={() => {
                                    setFilterByModel(modelId)
                                    setShowSortFilterDropdown(null)
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-between ${
                                    filterByModel === modelId
                                      ? darkMode 
                                        ? 'bg-blue-900/30 text-blue-300' 
                                        : 'bg-blue-100 text-blue-700'
                                      : darkMode 
                                        ? 'text-gray-300 hover:bg-gray-700/50' 
                                        : 'text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <span>{model?.provider || modelId}</span>
                                  {filterByModel === modelId && (
                                    <Check className="w-4 h-4" />
                                  )}
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
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                  <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Loading history...
                  </h2>
                  <p className={`text-lg transition-colors duration-200 ${
                    darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Retrieving your chat history
                  </p>
                </div>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm ${
                    darkMode ? 'bg-gray-800/50' : 'bg-white/50'
                  }`}>
                    <AlertCircle className={`w-12 h-12 ${
                      darkMode ? 'text-red-500' : 'text-red-500'
                    }`} />
                  </div>
                  <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Error Loading History
                  </h2>
                  <p className={`text-lg mb-6 text-center max-w-md transition-colors duration-200 ${
                    darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    {error}
                  </p>
                  <button 
                    onClick={() => loadChatSessions()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm ${
                    darkMode ? 'bg-gray-800/50' : 'bg-white/50'
                  }`}>
                    <Clock className={`w-12 h-12 ${
                      darkMode ? 'text-gray-500' : 'text-slate-400'
                    }`} />
                  </div>
                  <h2 className={`text-3xl font-bold mb-4 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {searchTerm || filterByModel !== 'all' ? 'No matching conversations' : 'No conversation history'}
                  </h2>
                  <p className={`text-xl mb-8 text-center max-w-md transition-colors duration-200 ${
                    darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    {searchTerm || filterByModel !== 'all'
                      ? 'Try adjusting your search terms or filters' 
                      : 'Start a new conversation to see it appear here'}
                  </p>
                  <Link href="/chat">
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] text-lg flex items-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>Start New Chat</span>
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pb-6">
                  {/* View Toggle Button */}
                  <div className="flex justify-end mb-4">
                    <div className={`inline-flex rounded-xl p-1 ${
                      darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/50 backdrop-blur-sm'
                    }`}>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'grid'
                            ? darkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-500 text-white shadow'
                            : darkMode
                              ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                        title="Grid View"
                      >
                        <Grid3X3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'list'
                            ? darkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-500 text-white shadow'
                            : darkMode
                              ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                        title="List View"
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {viewMode === 'grid' ? (
                    // Enhanced Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSessions.map((session: ChatSession) => (
                        <div 
                          key={session.id}
                          className={`rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-sm overflow-hidden ${
                            darkMode
                              ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 hover:border-gray-600/70'
                              : 'bg-gradient-to-br from-white/60 to-slate-50/60 border-slate-200/50 hover:border-slate-300/70'
                          }`}
                        >
                          <div 
                            className="p-5 cursor-pointer h-full flex flex-col transition-all duration-200 active:scale-[0.98]"
                            onClick={() => setModalSession(session)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <MessageSquare className={`w-5 h-5 ${
                                  darkMode ? 'text-blue-400' : 'text-blue-500'
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
                                className={`p-1.5 rounded-lg transition-colors duration-200 ${
                                  darkMode 
                                    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                                    : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
                                }`}
                                title="Delete conversation"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className={`mb-3 transition-colors duration-200 ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              <div className="font-bold mb-2 line-clamp-2">{session.message}</div>
                              <div className="text-sm line-clamp-3 mt-2">
                                {session.responses && session.responses.length > 0 ? (
                                  <div>
                                    <span className="font-medium">AI Responses:</span>
                                    <div className="mt-1 space-y-1">
                                      {session.responses.slice(0, 2).map((response, idx) => (
                                        <div key={idx} className="flex items-start">
                                          <span className="mr-2">•</span>
                                          <span className="line-clamp-1">
                                            {response.content.substring(0, 80)}
                                            {response.content.length > 80 ? '...' : ''}
                                          </span>
                                        </div>
                                      ))}
                                      {session.responses.length > 2 && (
                                        <div className="text-xs italic">
                                          +{session.responses.length - 2} more responses
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="italic text-gray-500">No responses yet</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1 flex items-center justify-center my-3">
                              <div className={`flex flex-wrap gap-2 justify-center ${
                                darkMode ? 'text-gray-300' : 'text-slate-600'
                              }`}>
                                {session.selectedModels.slice(0, 3).map((modelId: string) => {
                                  const model = getModelById(modelId)
                                  return (
                                    <span 
                                      key={modelId}
                                      className={`text-xs px-2.5 py-1 rounded-full flex items-center space-x-1 ${
                                        darkMode 
                                          ? 'bg-gray-700/50' 
                                          : 'bg-slate-100'
                                      }`}
                                    >
                                      <span>{model?.provider.charAt(0) || modelId.charAt(0)}</span>
                                      <span>{model?.provider || modelId}</span>
                                    </span>
                                  )
                                })}
                                {session.selectedModels.length > 3 && (
                                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                                    darkMode 
                                      ? 'bg-gray-700/50' 
                                      : 'bg-slate-100'
                                  }`}>
                                    +{session.selectedModels.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className={`flex items-center justify-between pt-3 border-t ${
                              darkMode ? 'border-gray-700/30' : 'border-slate-200/30'
                            }`}>
                              <div className={`flex items-center space-x-1 text-sm font-medium ${
                                darkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}>
                                <MessageSquare className="w-4 h-4" />
                                <span>{session.responseCount} responses</span>
                              </div>
                              <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                                darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                              }`}>
                                <span>Click to view</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          
                        </div>
                      ))}
                    </div>
                  ) : (
                    // List View
                    <div className="space-y-6">
                      {filteredSessions.map((session: ChatSession) => (
                        <div 
                          key={session.id}
                          className={`rounded-2xl border transition-all duration-300 backdrop-blur-sm ${
                            darkMode
                              ? 'bg-gray-800/60 border-gray-700/50 hover:border-gray-600/70 hover:shadow-xl'
                              : 'bg-white/60 border-slate-200/50 hover:border-slate-300/70 hover:shadow-lg'
                          }`}
                        >
                          <div 
                            className="p-5 cursor-pointer transition-all duration-200 active:scale-[0.98]"
                            onClick={() => setModalSession(session)}
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
                                {session.selectedModels.slice(0, 3).map((modelId: string) => {
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
                              <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                                darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                              }`}>
                                <span>View details</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete All Confirmation Popup */}
      {showDeleteAllPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl border shadow-2xl max-w-md w-full backdrop-blur-xl ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50' 
              : 'bg-gradient-to-br from-white/80 to-gray-100/80 border-slate-200/50'
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
                  disabled={isDeletingAll} // Disable close button during deletion
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  } ${isDeletingAll ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {isDeletingAll ? (
                // Loading state content
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className={`text-lg font-medium mb-2 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Deleting All History
                  </p>
                  <p className={`${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Please wait while we remove all your chat history...
                  </p>
                </div>
              ) : (
                // Confirmation content
                <>
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
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Delete All
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Modern Popup for Detailed Response View */}
      {selectedResponse && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedResponse(null)}
        >
          <div 
            className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' 
                : 'bg-gradient-to-br from-white to-gray-100 border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedResponse(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            <div className="p-8 h-full flex flex-col">
              {/* Popup Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                    selectedResponse?.isBestResponse 
                      ? 'bg-gradient-to-br from-amber-500 to-yellow-500' 
                      : darkMode 
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                        : 'bg-gradient-to-br from-blue-500 to-purple-500'
                  }`}>
                    {selectedResponse?.model?.displayName?.charAt(0)}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedResponse?.model?.displayName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        selectedResponse?.isBestResponse 
                          ? darkMode
                            ? 'bg-amber-900/40 text-amber-300' 
                            : 'bg-amber-100 text-amber-700'
                          : darkMode
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        {selectedResponse?.model?.provider}
                      </span>
                      {selectedResponse?.isBestResponse && (
                        <div className={`flex items-center space-x-1 ${
                          darkMode ? 'text-amber-400' : 'text-amber-600'
                        }`}>
                          <Sparkles className="w-4 h-4" />
                          <span className="text-sm font-semibold">Best Response</span>
                        </div>
                      )}
                      {selectedResponse?.responseTime !== undefined && selectedResponse?.responseTime > 0 && (
                        <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                          darkMode
                            ? 'bg-blue-900/40 text-blue-300' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          Response Time: {selectedResponse?.responseTime?.toFixed(2)}s
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Response Content */}
              <div className="flex-1 overflow-hidden">
                {selectedResponse?.error ? (
                  <div className="h-full flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                      <div className="w-20 h-20 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                      </div>
                      <h3 className={`text-2xl font-bold mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Error Loading Response
                      </h3>
                      <p className={`text-lg mb-6 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Failed to load the response from this model
                      </p>
                      <div className={`text-sm p-6 rounded-xl text-left max-h-40 overflow-y-auto ${
                        darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-500'
                      }`}>
                        {selectedResponse?.error}
                      </div>
                    </div>
                  </div>
                ) : selectedResponse?.content ? (
                  <div className="h-full flex flex-col">
                    {/* Response Content with Scrolling */}
                    <div className={`flex-1 rounded-xl p-6 mb-6 overflow-y-auto max-h-[70vh] ${
                      darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                    }`}>
                      <div className={`prose max-w-none ${
                        darkMode ? 'prose-invert' : ''
                      }`}>
                        <div className={`whitespace-pre-wrap text-lg ${
                          darkMode ? 'text-slate-100' : 'text-slate-700'
                        }`}>
                          {selectedResponse?.content}
                        </div>
                      </div>
                    </div>
                    
                    {/* Response Stats and Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className={`flex flex-wrap gap-4 text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <span>{selectedResponse?.content?.split(' ').length} words</span>
                        <span>•</span>
                        <span>{selectedResponse?.content?.length} characters</span>
                      </div>
                      <button
                        onClick={async () => {
                          if (selectedResponse?.content) {
                            await navigator.clipboard.writeText(selectedResponse.content);
                            // Could add a toast notification here
                          }
                        }}
                        className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy Response</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                        selectedResponse?.isBestResponse 
                          ? 'bg-gradient-to-br from-amber-100 to-yellow-100' 
                          : darkMode
                            ? 'bg-gray-700' 
                            : 'bg-gradient-to-br from-slate-100 to-slate-200'
                      }`}>
                        <Sparkles className={`w-10 h-10 ${
                          selectedResponse?.isBestResponse ? 'text-amber-500' : darkMode ? 'text-slate-400' : 'text-slate-400'
                        }`} />
                      </div>
                      <h3 className={`text-2xl font-bold mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        No Response Content
                      </h3>
                      <p className={`text-lg ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        This model did not return any content
                      </p>
                    </div>
                  </div>
                )}
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
      
      {/* History Detail Modal */}
      {modalSession && (
        <HistoryDetailModal 
          session={modalSession} 
          onClose={() => setModalSession(null)} 
        />
      )}
    </div>
  )
}