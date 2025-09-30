'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  user_metadata: {
    full_name?: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for an existing session
    const checkSession = async () => {
      // In a real app, you would check for an existing session here
      // For now, we'll just set a mock user
      setUser({
        id: '1',
        email: 'user@example.com',
        user_metadata: {
          full_name: 'Test User'
        }
      })
      setLoading(false)
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simulate sign in
    setUser({
      id: '1',
      email,
      user_metadata: {
        full_name: 'Test User'
      }
    })
  }

  const signOut = async () => {
    // Simulate sign out
    setUser(null)
  }

  const signUp = async (email: string, password: string) => {
    // Simulate sign up
    setUser({
      id: '1',
      email,
      user_metadata: {
        full_name: 'Test User'
      }
    })
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    signUp
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}