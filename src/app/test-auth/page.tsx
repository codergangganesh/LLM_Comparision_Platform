'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TestAuthPage() {
  const { user, loading, signIn, signOut } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  // Redirect authenticated users to chat
  useEffect(() => {
    if (!loading && user) {
      router.push('/chat')
    }
  }, [user, loading, router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await signIn(email, password)
      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('Signed in successfully!')
      }
    } catch (err) {
      setMessage('An unexpected error occurred')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setMessage('Signed out successfully!')
    } catch (err) {
      setMessage('Error signing out')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-md w-full space-y-8 p-10 bg-gray-900 rounded-xl">
        <h1 className="text-3xl font-bold text-center">Auth Test</h1>
        
        {message && (
          <div className="p-3 bg-blue-900/50 rounded-lg text-center">
            {message}
          </div>
        )}
        
        {user ? (
          <div className="space-y-4">
            <p>Welcome, {user.email}!</p>
            <button
              onClick={handleSignOut}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Sign In
            </button>
          </form>
        )}
        
        <div className="text-center">
          <a href="/auth" className="text-blue-400 hover:underline">
            Go to Auth Page
          </a>
        </div>
      </div>
    </div>
  )
}