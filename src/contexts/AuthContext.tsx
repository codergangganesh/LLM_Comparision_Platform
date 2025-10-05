'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface User {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string, showLoading?: (message?: string) => void, hideLoading?: () => void) => Promise<{ error?: { message: string } }>
  signInWithGoogle: (showLoading?: (message?: string) => void, hideLoading?: () => void) => Promise<void>
  signInWithGithub: (showLoading?: (message?: string) => void, hideLoading?: () => void) => Promise<void>
  signOut: (showLoading?: (message?: string) => void, hideLoading?: () => void) => Promise<void>
  signUp: (email: string, password: string, showLoading?: (message?: string) => void, hideLoading?: () => void) => Promise<{ error?: { message: string } }>
  deleteAccount: (password: string, showLoading?: (message?: string) => void, hideLoading?: () => void) => Promise<{ error?: { message: string } }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check for an existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setUser(session.user as User)
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user as User)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string, showLoadingFn?: (message?: string) => void, hideLoadingFn?: () => void) => {
    try {
      if (showLoadingFn) {
        showLoadingFn('Signing in...')
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        if (hideLoadingFn) {
          hideLoadingFn()
        }
        return { error }
      }
      
      if (data.session) {
        setUser(data.session.user as User)
        // Instead of automatically redirecting to chat, we'll let the user choose
        // Redirect to landing page after login so user can choose what to do
        router.push('/')
      }
      
      if (hideLoadingFn) {
        hideLoadingFn()
      }
      return { error: undefined }
    } catch (error) {
      if (hideLoadingFn) {
        hideLoadingFn()
      }
      console.error('Sign in error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const signInWithGoogle = async (showLoadingFn?: (message?: string) => void, hideLoadingFn?: () => void) => {
    try {
      if (showLoadingFn) {
        showLoadingFn('Redirecting to Google...')
      }
      // Only run on client side
      if (typeof window !== 'undefined') {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        })
      }
    } catch (error) {
      if (hideLoadingFn) {
        hideLoadingFn()
      }
      console.error('Google sign in error:', error)
    }
  }

  const signInWithGithub = async (showLoadingFn?: (message?: string) => void, hideLoadingFn?: () => void) => {
    try {
      if (showLoadingFn) {
        showLoadingFn('Redirecting to GitHub...')
      }
      // Only run on client side
      if (typeof window !== 'undefined') {
        await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        })
      }
    } catch (error) {
      if (hideLoadingFn) {
        hideLoadingFn()
      }
      console.error('GitHub sign in error:', error)
    }
  }

  const signOut = async (showLoadingFn?: (message?: string) => void, hideLoadingFn?: () => void) => {
    try {
      if (showLoadingFn) {
        showLoadingFn('Signing out...')
      }
      await supabase.auth.signOut()
      setUser(null)
      router.push('/')
      if (hideLoadingFn) {
        hideLoadingFn()
      }
    } catch (error) {
      if (hideLoadingFn) {
        hideLoadingFn()
      }
      console.error('Sign out error:', error)
    }
  }

  const signUp = async (email: string, password: string, showLoadingFn?: (message?: string) => void, hideLoadingFn?: () => void) => {
    try {
      if (showLoadingFn) {
        showLoadingFn('Creating account...')
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/`,
        },
      })
      
      if (error) {
        if (hideLoadingFn) {
          hideLoadingFn()
        }
        return { error }
      }
      
      if (data.session) {
        setUser(data.session.user as User)
        router.push('/chat')
      } else if (data.user) {
        // Email confirmation required
        router.push('/auth')
      }
      
      if (hideLoadingFn) {
        hideLoadingFn()
      }
      return { error: undefined }
    } catch (error) {
      if (hideLoadingFn) {
        hideLoadingFn()
      }
      console.error('Sign up error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const deleteAccount = async (password: string, showLoadingFn?: (message?: string) => void, hideLoadingFn?: () => void) => {
    try {
      if (showLoadingFn) {
        showLoadingFn('Deleting account...')
      }
      
      // First, re-authenticate the user with their password
      const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password,
      })
      
      if (signInError) {
        if (hideLoadingFn) {
          hideLoadingFn()
        }
        return { error: { message: 'Incorrect password. Please try again.' } }
      }
      
      if (!authUser) {
        if (hideLoadingFn) {
          hideLoadingFn()
        }
        return { error: { message: 'Failed to authenticate user.' } }
      }
      
      // Delete the user
      const { error } = await supabase.auth.admin.deleteUser(authUser.id)
      
      if (error) {
        if (hideLoadingFn) {
          hideLoadingFn()
        }
        return { error: { message: 'Failed to delete account. Please try again.' } }
      }
      
      // Sign out and clear local user data
      await supabase.auth.signOut()
      setUser(null)
      if (hideLoadingFn) {
        hideLoadingFn()
      }
      
      return { error: undefined }
    } catch (error) {
      if (hideLoadingFn) {
        hideLoadingFn()
      }
      console.error('Delete account error:', error)
      return { error: { message: 'An unexpected error occurred. Please try again.' } }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    signUp,
    deleteAccount
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