'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

interface OptimizedLoadingContextType {
  isLoading: boolean
  loadingMessage: string
  showLoading: (message?: string) => void
  hideLoading: () => void
  setPageLoading: (loading: boolean, message?: string) => void
}

const OptimizedLoadingContext = createContext<OptimizedLoadingContextType | undefined>(undefined)

export function OptimizedLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Loading...')

  const showLoading = useCallback((message = 'Loading...') => {
    setLoadingMessage(message)
    setIsLoading(true)
  }, [])

  const hideLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const setPageLoading = useCallback((loading: boolean, message = 'Loading...') => {
    setLoadingMessage(message)
    setIsLoading(loading)
  }, [])

  const value = {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    setPageLoading
  }

  return (
    <OptimizedLoadingContext.Provider value={value}>
      {children}
    </OptimizedLoadingContext.Provider>
  )
}

export function useOptimizedLoading() {
  const context = useContext(OptimizedLoadingContext)
  if (context === undefined) {
    throw new Error('useOptimizedLoading must be used within an OptimizedLoadingProvider')
  }
  return context
}