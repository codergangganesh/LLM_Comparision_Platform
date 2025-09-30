'use client'

import ModernAuthForm from '@/components/auth/ModernAuthForm'
import AuthIllustration from '@/components/auth/AuthIllustration'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to chat
  useEffect(() => {
    if (user) {
      router.push('/chat')
    }
  }, [user, router])

  if (user) {
    return null // or a loading spinner while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Illustration */}
          <div className="hidden lg:block">
            <AuthIllustration />
          </div>

          {/* Auth Form */}
          <div className="bg-black/30 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  AI Fiesta
                </h1>
              </Link>
              
              <Link 
                href="/" 
                className="text-violet-300 hover:text-violet-200 text-sm font-medium transition-colors duration-200"
              >
                Back to Home
              </Link>
            </div>

            <ModernAuthForm />
          </div>
        </div>
      </div>
    </div>
  )
}