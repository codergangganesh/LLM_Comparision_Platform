'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ModernHistoryInterface from '@/components/history/ModernHistoryInterface'
import { useRouter } from 'next/navigation'

export default function HistoryPage() {
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
      <ModernHistoryInterface />
    </div>
  )
}