'use client'

import { useEffect, useState } from 'react'
import { useOptimizedLoading } from '@/contexts/OptimizedLoadingContext'
import { motion, AnimatePresence } from 'framer-motion'

interface OptimizedPageTransitionLoaderProps {
  isLoading?: boolean
  message?: string
}

export default function OptimizedPageTransitionLoader({ 
  isLoading: externalIsLoading, 
  message = 'Loading...' 
}: OptimizedPageTransitionLoaderProps) {
  const { isLoading: contextIsLoading, loadingMessage } = useOptimizedLoading()
  const [showLoader, setShowLoader] = useState(false)
  const [progress, setProgress] = useState(0)

  // Determine if we should show the loader
  const shouldShowLoader = externalIsLoading !== undefined ? externalIsLoading : contextIsLoading
  const displayMessage = loadingMessage || message

  // Handle loader visibility with delay to prevent flickering
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    if (shouldShowLoader) {
      // Show loader immediately if already loading
      setShowLoader(true)
      setProgress(0)
    } else {
      // Delay hiding to ensure smooth transitions
      timeoutId = setTimeout(() => {
        setShowLoader(false)
        setProgress(0)
      }, 300)
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [shouldShowLoader])

  // Simulate progress for better UX
  useEffect(() => {
    let intervalId: NodeJS.Timeout
    
    if (showLoader) {
      intervalId = setInterval(() => {
        setProgress(prev => {
          // Slow progress until 90%, then stop (let actual loading complete)
          if (prev < 90) {
            return prev + Math.random() * 5
          }
          return prev
        })
      }, 200)
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [showLoader])

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              duration: 0.3 
            }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 flex flex-col items-center space-y-6 shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            {/* Animated spinner with gradient */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
              <motion.div
                className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              ></motion.div>
              
              {/* Progress ring */}
              <svg className="absolute top-0 left-0 w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="2"
                />
                <motion.path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ strokeDasharray: `${progress} 100` }}
                  transition={{ duration: 0.3 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <div className="text-center">
              <motion.span 
                className="text-gray-800 dark:text-white text-lg font-medium block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {displayMessage}
              </motion.span>
              
              <motion.span 
                className="text-gray-500 dark:text-gray-400 text-sm block mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Please wait...
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}