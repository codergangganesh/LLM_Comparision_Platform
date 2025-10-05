'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { MessageSquare, BarChart3, Brain, Plus, Clock, ChevronDown, User, LogOut, Cog, Trash2, CreditCard, Moon, Sun, Bell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import DeleteAccountPopup from './DeleteAccountPopup'
import { usePopup } from '@/contexts/PopupContext'
import NotificationBell from '@/components/ui/NotificationBell'

interface SharedSidebarProps {
  onDeletePopupOpen?: () => void
  showDeletePopup?: boolean
  onDeletePopupClose?: () => void
  onDeleteConfirm?: (password: string) => void
  isDeleting?: boolean
}

export default function SharedSidebar({ 
  onDeletePopupOpen,
  showDeletePopup = false,
  onDeletePopupClose,
  onDeleteConfirm,
  isDeleting = false
}: SharedSidebarProps) {
  const { signOut, user } = useAuth()
  const { openPaymentPopup } = usePopup()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const pathname = usePathname()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [localShowDeletePopup, setLocalShowDeletePopup] = useState(false)
  const [localIsDeleting, setLocalIsDeleting] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDeleteAccountConfirm = async (password: string) => {
    setLocalIsDeleting(true)
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
      setLocalIsDeleting(false)
      setLocalShowDeletePopup(false)
      if (onDeletePopupClose) onDeletePopupClose()
    }
  }

  // Determine which delete popup to use
  const handleDeleteClick = () => {
    setShowProfileDropdown(false)
    if (onDeletePopupOpen) {
      // Use the parent-provided popup handler
      onDeletePopupOpen()
    } else {
      // Use the local popup state
      setLocalShowDeletePopup(true)
    }
  }

  const handleCloseDeletePopup = () => {
    setLocalShowDeletePopup(false)
    setLocalIsDeleting(false)
    if (onDeletePopupClose) onDeletePopupClose()
  }

  // Use the appropriate props or local state
  const shouldShowDeletePopup = onDeletePopupOpen ? showDeletePopup : localShowDeletePopup
  const handleDeleteConfirm = onDeleteConfirm || handleDeleteAccountConfirm
  const isLoading = isDeleting || localIsDeleting
  const handleClose = onDeletePopupClose || handleCloseDeletePopup

  return (
    <div className="fixed left-0 top-0 h-full w-80 backdrop-blur-xl border-r transition-colors duration-200 z-10 bg-white/80 border-slate-200/50 dark:bg-gray-800/80 dark:border-gray-700">
      <div className="flex flex-col h-full pb-20">
        {/* Header with Logo */}
        <div className="p-6 border-b border-slate-200/30 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-gray-200">
                  AI Fiesta
                </h1>
              </div>
            </div>
            <NotificationBell />
          </div>

          {/* New Chat Button */}
          <Link href="/chat">
            <button
              className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] group relative"
              title="Start New Comparison"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              <span>New Comparison</span>
            </button>
          </Link>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <Link
            href="/chat"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
              pathname === '/chat'
                ? 'dark:text-white dark:bg-gray-700/50 dark:border dark:border-gray-600 text-slate-900 bg-slate-100/50 border border-slate-200'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Current Chat</span>
          </Link>
          
          <Link
            href="/history"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
              pathname === '/history'
                ? 'dark:text-white dark:bg-gray-700/50 dark:border dark:border-gray-600 text-slate-900 bg-slate-100/50 border border-slate-200'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/50'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-medium">History</span>
          </Link>
          
          <Link
            href="/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
              pathname === '/dashboard'
                ? 'dark:text-white dark:bg-gray-700/50 dark:border dark:border-gray-600 text-slate-900 bg-slate-100/50 border border-slate-200'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
        </div>
      </div>
      
      {/* Profile Section at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200/30 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
        <div className="relative" ref={profileDropdownRef}>
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-gray-700/10 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-all duration-300 ease-out"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
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
                      <div className="text-xs text-slate-500 dark:text-gray-300 truncate">
                        {user?.email || 'user@example.com'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}                
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    openPaymentPopup();
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-slate-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-gray-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="font-medium">Pricing Plans</span>
                </button>
                
                <Link href="/dashboard/profile">
                  <div 
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setShowProfileDropdown(false)
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-gray-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="font-medium">Profile</span>
                  </div>
                </Link>
                
                <Link href="/dashboard/settings">
                  <div 
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setShowProfileDropdown(false)
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
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDarkMode();
                    setShowProfileDropdown(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-gray-700 flex items-center justify-center">
                      {darkMode ? (
                        <Sun className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <span className="font-medium">Dark Mode</span>
                  </div>
                  <div className="relative">
                    <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                      darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                        darkMode ? 'translate-x-6' : ''
                      }`}></div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-2">
                  <div className="h-px bg-slate-200/30 dark:bg-gray-700/50 my-1"></div>
                </div>
                
                <div 
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all duration-200"
                  onClick={handleDeleteClick}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="font-medium">Delete Account</span>
                </div>
                
                <div 
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all duration-200"
                  onClick={() => {
                    setShowProfileDropdown(false)
                    signOut()
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
      
      {/* Always render the popup but control visibility with props */}
      <DeleteAccountPopup
        isOpen={shouldShowDeletePopup}
        onClose={handleClose}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}