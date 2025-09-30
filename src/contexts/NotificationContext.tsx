'use client'

import React, { createContext, useContext, ReactNode } from 'react'

interface NotificationContextType {
  success: (title: string, message: string) => void
  error: (title: string, message: string) => void
  warning: (title: string, message: string) => void
  info: (title: string, message: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const showNotification = (title: string, message: string, type: string) => {
    // In a real implementation, this would trigger a notification UI
    console.log(`[${type}] ${title}: ${message}`)
    
    // For now, we'll just show an alert
    alert(`${title}: ${message}`)
  }

  const success = (title: string, message: string) => {
    showNotification(title, message, 'SUCCESS')
  }

  const error = (title: string, message: string) => {
    showNotification(title, message, 'ERROR')
  }

  const warning = (title: string, message: string) => {
    showNotification(title, message, 'WARNING')
  }

  const info = (title: string, message: string) => {
    showNotification(title, message, 'INFO')
  }

  const value = {
    success,
    error,
    warning,
    info
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useToast() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a NotificationProvider')
  }
  return context
}