'use client'

import { useEffect } from 'react'

interface PageTransitionLoaderProps {
  isLoading: boolean
  message?: string
}

export default function PageTransitionLoader({ isLoading, message = 'Loading...' }: PageTransitionLoaderProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-800 dark:text-white">{message}</span>
      </div>
    </div>
  )
}