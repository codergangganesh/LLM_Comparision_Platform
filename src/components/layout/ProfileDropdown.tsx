'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, LogOut, User, Settings, Plus, Trash2, CreditCard } from 'lucide-react'
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center space-x-3 w-full p-2 rounded-xl hover:bg-gray-700/30 transition-all duration-300 ease-out"
        aria-label="User profile menu"
      >
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
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-white">
            {user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'User')}
          </p>
          <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onMouseEnter={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className={`absolute bottom-full right-0 mb-2 w-64 rounded-2xl border shadow-xl z-20 transition-all duration-300 transform origin-bottom backdrop-blur-xl ${
            darkMode 
              ? 'bg-gray-800/90 border-gray-700/50' 
              : 'bg-white/90 border-slate-200/50'
          }`}>
            {/* User Profile Header */}
            <div className={`px-4 py-4 border-b ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-slate-200/30'
            }`}>
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
                <div>
                  <p className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'User')}
                  </p>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="py-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNewConversation();
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700/50 text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white transition-all duration-200"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-indigo-100'
                }`}>
                  <Plus className={`w-4 h-4 ${
                    darkMode ? 'text-indigo-400' : 'text-indigo-600'
                  }`} />
                </div>
                <span className="font-medium">New Conversation</span>
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  onToggleDarkMode();
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700/50 text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white transition-all duration-200"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-indigo-100'
                }`}>
                  {darkMode ? (
                    <Sun className={`w-4 h-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                  ) : (
                    <Moon className={`w-4 h-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                  )}
                </div>
                <span className="font-medium">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  openPaymentPopup();
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700/50 text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white transition-all duration-200"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-indigo-100'
                }`}>
                  <CreditCard className={`w-4 h-4 ${
                    darkMode ? 'text-indigo-400' : 'text-indigo-600'
                  }`} />
                </div>
                <span className="font-medium">Pricing Plans</span>
              </button>
              
              <Link href="/dashboard/profile">
                <div 
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700/50 text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-gray-700' : 'bg-indigo-100'
                  }`}>
                    <User className={`w-4 h-4 ${
                      darkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                  </div>
                  <span className="font-medium">Profile</span>
                </div>
              </Link>
              
              <Link href="/dashboard/settings">
                <div 
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700/50 text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-gray-700' : 'bg-indigo-100'
                  }`}>
                    <Settings className={`w-4 h-4 ${
                      darkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                  </div>
                  <span className="font-medium">Settings</span>
                </div>
              </Link>
              
              <div className={`px-4 py-2 ${
                darkMode ? 'border-gray-700/50' : 'border-slate-200/30'
              }`}>
                <div className={`h-px ${
                  darkMode ? 'bg-gray-700/50' : 'bg-slate-200/30'
                } my-1`}></div>
              </div>
              
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setShowDeletePopup(true);
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700 dark:hover:text-red-500 transition-all duration-200"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-red-900/20' : 'bg-red-100'
                }`}>
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-500" />
                </div>
                <span className="font-medium">Delete Account</span>
              </button>
              
              <button 
                onClick={() => {
                  signOut()
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700 dark:hover:text-red-500 transition-all duration-200"
                aria-label="Sign out"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-red-900/20' : 'bg-red-100'
                }`}>
                  <LogOut className="w-4 h-4 text-red-600 dark:text-red-500" />
                </div>
                <span className="font-medium">Sign Out</span>
              </button>
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