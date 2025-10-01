'use client'

import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface PageTransitionLoaderProps {
  isLoading: boolean
  message?: string
}

export default function PageTransitionLoader({ 
  isLoading, 
  message = 'Loading...' 
}: PageTransitionLoaderProps) {
  const [showLoader, setShowLoader] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let progressTimer: NodeJS.Timeout
    let showTimer: NodeJS.Timeout

    if (isLoading) {
      // Show loader after a short delay to avoid flickering
      showTimer = setTimeout(() => {
        setShowLoader(true)
        
        // Animate progress
        progressTimer = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressTimer)
              return prev
            }
            return prev + Math.random() * 15
          })
        }, 100)
      }, 300)
    } else {
      // Complete progress and hide loader
      setProgress(100)
      setTimeout(() => {
        setShowLoader(false)
        setProgress(0)
      }, 300)
    }

    return () => {
      clearTimeout(showTimer)
      clearInterval(progressTimer)
    }
  }, [isLoading])

  if (!showLoader) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="w-32 h-32 mb-8">
        <LoadingSpinner size="lg" color="white" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-6">{message}</h2>
      
      {/* Progress bar with gradient */}
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-4 text-gray-400">
        {Math.min(Math.floor(progress), 100)}%
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  )
}