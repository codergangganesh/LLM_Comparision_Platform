'use client'

import ModernChatInterface from '@/components/chat/ModernChatInterface'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useOptimizedRouter } from '@/hooks/useOptimizedRouter'
import OptimizedPageTransitionLoader from '@/components/ui/OptimizedPageTransitionLoader'
import { useOptimizedLoading } from '@/contexts/OptimizedLoadingContext'

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useOptimizedRouter()
  const { setPageLoading } = useOptimizedLoading()

  // Redirect unauthenticated users to the auth page
  useEffect(() => {
    if (!loading && !user) {
      setPageLoading(true, "Redirecting to authentication...");
      router.push('/auth')
    } else if (user && !loading) {
      setPageLoading(false);
    }
  }, [user, loading, router, setPageLoading])

  // Show loading while checking auth status
  if (loading) {
    return <OptimizedPageTransitionLoader message="Loading chat interface..." />;
  }

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen">
      <ModernChatInterface />
    </div>
  )
}