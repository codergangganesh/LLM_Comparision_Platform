'use client'

import React, { useEffect, useState } from 'react'

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
    let progressTimer: NodeJS.Timeout | null = null

    if (isLoading) {
      // Show loader immediately to block content
      setShowLoader(true)
      
      // Animate progress
      progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            if (progressTimer) clearInterval(progressTimer)
            return prev
          }
          return prev + Math.random() * 10
        })
      }, 150)
    } else {
      // Complete progress and hide loader
      setProgress(100)
      // Keep loader visible for a minimum time to ensure smooth transition
      const hideTimer = setTimeout(() => {
        setShowLoader(false)
        setProgress(0)
      }, 300)
      
      return () => clearTimeout(hideTimer)
    }

    return () => {
      if (progressTimer) clearInterval(progressTimer)
    }
  }, [isLoading])

  if (!showLoader) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background with violet-purple theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-fuchsia-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-700/20 via-violet-700/15 to-fuchsia-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-gradient-to-r from-fuchsia-600/20 via-violet-500/15 to-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.8s' }}></div>
      </div>

      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo/Brand with glowing effect */}
        <div className="relative mb-10">
          <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl blur opacity-40 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-violet-700 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
        
        {/* Loading text with gradient */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-purple-200 to-fuchsia-300 bg-clip-text text-transparent mb-10">
          {message}
        </h2>
        
        {/* Modern progress bar */}
        <div className="w-80 h-3 bg-black/50 rounded-full overflow-hidden border border-violet-500/30 backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/50 via-purple-400/50 to-fuchsia-400/50 animate-pulse"></div>
          </div>
        </div>
        
        {/* Percentage indicator */}
        <div className="mt-4 text-violet-300 font-medium">
          {Math.min(Math.floor(progress), 100)}%
        </div>
      </div>
      
      {/* Subtle particles for depth */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-violet-400 rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}