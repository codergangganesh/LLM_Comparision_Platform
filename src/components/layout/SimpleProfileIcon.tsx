'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, User, Settings, LogOut, Trash2, CreditCard, Moon, Sun } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePopup } from '@/contexts/PopupContext'
import Link from 'next/link'
import DeleteAccountPopup from './DeleteAccountPopup'
import { useDarkMode } from '@/contexts/DarkModeContext'

export default function SimpleProfileIcon() {
  const { signOut, user } = useAuth()
  const { openPaymentPopup } = usePopup()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [isOpen, setIsOpen] = useState(false)
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-700/20 dark:hover:bg-gray-700/40 transition-all duration-300 group"
        aria-label="User profile menu"
      >
        <div className="flex items-center space-x-3">
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
          <div className="flex flex-col text-left min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'User')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-all duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl transition-all duration-300 transform origin-top z-50 ${
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
              <button
                onClick={() => {
                  setIsOpen(false);
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
              
              <Link href="/profile">
                <div 
                  className={`flex items-center space-x-4 w-full px-5 py-3 text-left transition-all duration-200 ${
                    darkMode 
                      ? 'hover:bg-blue-500/10' 
                      : 'hover:bg-blue-50'
                  }`}
                  onClick={() => setIsOpen(false)}
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
              
              {/* Theme Toggle */}
              <div 
                className={`flex items-center justify-between px-5 py-3 transition-all duration-200 ${
                  darkMode 
                    ? 'hover:bg-amber-500/10' 
                    : 'hover:bg-amber-50'
                }`}
                onClick={() => {
                  setIsOpen(false);
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
                  setIsOpen(false)
                  setShowDeletePopup(true)
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
                  setIsOpen(false)
                  signOut()
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
      
      <DeleteAccountPopup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteAccountConfirm}
        isLoading={isDeleting}
      />
    </div>
  )
}