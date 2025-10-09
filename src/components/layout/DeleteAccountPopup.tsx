'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X } from 'lucide-react'

interface DeleteAccountPopupProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (password: string) => void
  isLoading?: boolean
}

export default function DeleteAccountPopup({ 
  isOpen, 
  onClose, 
  onConfirm,
  isLoading = false
}: DeleteAccountPopupProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError('Please enter your password')
      return
    }
    onConfirm(password)
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    onClose()
  }

  // Render nothing if not open or if we're on the server
  if (!isOpen) return null

  // Create the popup content
  const popupContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200/50 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Account</h3>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <p className="text-slate-700 dark:text-gray-300 mb-4">
              This action cannot be undone. This will permanently delete your account and all associated data.
            </p>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                  error 
                    ? 'border-red-500' 
                    : 'border-slate-200 dark:border-gray-600'
                }`}
                placeholder="Enter your password"
              />
              {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
              )}
            </div>
           
          </div>
          
          <div className="flex justify-end space-x-3 p-4 border-t border-slate-200/50 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{isLoading ? 'Deleting...' : 'Delete Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  // Use portal to render the popup at the document root
  if (typeof document !== 'undefined') {
    return createPortal(popupContent, document.body)
  }

  // Fallback for server-side rendering
  return popupContent
}