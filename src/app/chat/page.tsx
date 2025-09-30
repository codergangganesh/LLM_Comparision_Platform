'use client'

import ModernChatInterface from '@/components/chat/ModernChatInterface'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect unauthenticated users to the auth page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Show nothing while loading or redirecting
  if (loading || !user) {
    return null
  }

  return (
    <div className="h-screen">
      <ModernChatInterface />
    </div>
  )
}