'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, LogOut, User, Settings, Plus, Trash2, CreditCard, ChevronDown } from 'lucide-react'
import DeleteAccountConfirmation from './DeleteAccountConfirmation'
import DeleteAccountPopup from './DeleteAccountPopup'
import { useAuth } from '@/contexts/AuthContext'
import { usePopup } from '@/contexts/PopupContext'

interface ProfileDropdownProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  onNewConversation: () => void
}

export default function ProfileDropdown({ 
  darkMode, 
  onToggleDarkMode,
  onNewConversation
}: ProfileDropdownProps) {
  const { signOut, user } = useAuth()
  const { openPaymentPopup } = usePopup()
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDeleteAccount = () => {
    // This is where you would implement the actual account deletion logic
    console.log('Account deleted')
    // For now, we'll just close the confirmation dialog
    setShowDeleteConfirmation(false)
  }

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

  // Function to get user display name
  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'User')
  }

  // Function to get user avatar or initial
  const getUserAvatar = (size: 'sm' | 'md' = 'sm') => {
    const dimensions = size === 'sm' ? 'w-8 h-8' : 'w-12 h-12'
    
    if (user?.user_metadata?.avatar_url) {
      return (
        <img 
          src={user.user_metadata.avatar_url} 
          alt="Profile" 
          className={`${dimensions} rounded-full object-cover`}
        />
      )
    }
    
    const displayName = getUserDisplayName()
    const initial = displayName.charAt(0).toUpperCase()
    
    return (
      <div className={`${dimensions} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md`}>
        <span className={`${size === 'sm' ? 'text-xs' : 'text-lg'} font-bold text-white`}>
          {initial}
        </span>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-gray-700/20 dark:hover:bg-gray-700/40 transition-all duration-300 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          {getUserAvatar('sm')}
          <div className="flex flex-col text-left min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {getUserDisplayName()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-all duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </div>

      {/* Modern Profile Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
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
                {getUserAvatar('md')}
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-lg truncate ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {getUserDisplayName()}
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
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNewConversation();
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
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-medium ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>New Conversation</p>
                  <p className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Start a new chat session</p>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  openPaymentPopup();
                }}
                className={`flex items-center space-x-4 w-full px-5 py-3 text-left transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-emerald-500/10' 
                    : 'hover:bg-emerald-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  darkMode 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-emerald-100 text-emerald-600'
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
              
              <Link href="/dashboard/profile">
                <div 
                  className={`flex items-center space-x-4 w-full px-5 py-3 text-left transition-all duration-200 ${
                    darkMode 
                      ? 'hover:bg-blue-500/10' 
                      : 'hover:bg-blue-50'
                  }`}
                  onClick={() => {
                    setIsOpen(false);
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
              
              <Link href="/dashboard/settings">
                <div 
                  className={`flex items-center space-x-4 w-full px-5 py-3 text-left transition-all duration-200 ${
                    darkMode 
                      ? 'hover:bg-violet-500/10' 
                      : 'hover:bg-violet-50'
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    darkMode 
                      ? 'bg-violet-500/20 text-violet-400' 
                      : 'bg-violet-100 text-violet-600'
                  }`}>
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-medium ${
                      darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>Settings</p>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Configure preferences</p>
                  </div>
                </div>
              </Link>
              
              {/* Theme Toggle */}
              <div 
                className={`flex items-center justify-between px-5 py-3 transition-all duration-200 ${
                  darkMode 
                    ? 'hover:bg-amber-500/10' 
                    : 'hover:bg-amber-50'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleDarkMode();
                  setIsOpen(false);
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
                  setIsOpen(false);
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
                  setIsOpen(false);
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
      
      <DeleteAccountConfirmation
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteAccount}
      />
      
      <DeleteAccountPopup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteAccountConfirm}
        isLoading={isDeleting}
      />
    </div>
  )
}