'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface LoadingContextType {
  isLoading: boolean
  loadingMessage: string | null
  showLoading: (message?: string) => void
  hideLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null)

  const showLoading = (message?: string) => {
    setLoadingMessage(message || null)
    setIsLoading(true)
  }

  const hideLoading = () => {
    setIsLoading(false)
    setLoadingMessage(null)
  }

  return (
    <LoadingContext.Provider value={{ isLoading, loadingMessage, showLoading, hideLoading }}>
      {children}
      {isLoading && <LoadingSpinner fullScreen message={loadingMessage || 'Loading...'} />}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}