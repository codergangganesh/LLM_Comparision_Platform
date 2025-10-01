'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import PageTransitionLoader from '@/components/ui/PageTransitionLoader'

export default function RouteChangeListener() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Listen for route changes
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true)
    }

    const handleRouteChangeComplete = () => {
      setLoading(false)
    }

    // For Next.js App Router, we listen to pathname and searchParams changes
    handleRouteChangeStart()

    // Simulate route change completion
    const timer = setTimeout(() => {
      handleRouteChangeComplete()
    }, 800)

    return () => {
      clearTimeout(timer)
    }
  }, [pathname, searchParams])

  return <PageTransitionLoader isLoading={loading} message="Loading page..." />
}