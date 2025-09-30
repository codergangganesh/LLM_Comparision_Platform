'use client'

import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, LogOut, User, Settings, Plus, Trash2 } from 'lucide-react'
import DeleteAccountConfirmation from './DeleteAccountConfirmation'

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
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
        aria-label="User profile menu"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">U</span>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-white">User</p>
          <p className="text-xs text-gray-400">user@example.com</p>
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onMouseEnter={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className={`absolute bottom-full right-0 mb-2 w-64 rounded-xl border shadow-lg z-20 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">U</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">User</p>
                  <p className="text-sm text-slate-500 dark:text-gray-400">user@example.com</p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNewConversation();
                }}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-gray-700/50 text-slate-700 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Conversation</span>
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  onToggleDarkMode();
                }}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-gray-700/50 text-slate-700 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
              
              <button 
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-gray-700/50 text-slate-700 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors"
                aria-label="Profile"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              
              <button 
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-gray-700/50 text-slate-700 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              
              <div className="border-t dark:border-gray-700 my-2" />
              
              <button 
                onClick={() => setShowDeleteConfirmation(true)}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-600 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
              
              <button 
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-600 hover:text-red-500 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
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
    </div>
  )
}