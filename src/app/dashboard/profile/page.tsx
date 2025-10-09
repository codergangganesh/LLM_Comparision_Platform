'use client'

import { useEffect } from 'react'
import { useOptimizedRouter } from '@/hooks/useOptimizedRouter'

export default function DashboardProfileRedirect() {
  const router = useOptimizedRouter()

  useEffect(() => {
    // Redirect to the new profile page
    router.replace('/profile')
  }, [router])

  return null
}
