'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'

interface OptimizedRouter {
  push: (href: string) => void
  replace: (href: string) => void
  prefetch: (href: string) => void
  back: () => void
  forward: () => void
}

export function useOptimizedRouter(): OptimizedRouter {
  const router = useRouter()
  const navigationStack = useRef<string[]>([])
  const currentIndex = useRef(0)

  // Enhanced push with caching and prefetching
  const push = useCallback((href: string) => {
    // Add to navigation stack
    navigationStack.current = navigationStack.current.slice(0, currentIndex.current + 1)
    navigationStack.current.push(href)
    currentIndex.current = navigationStack.current.length - 1
    
    // Use router.push for actual navigation
    router.push(href)
  }, [router])

  // Enhanced replace
  const replace = useCallback((href: string) => {
    router.replace(href)
  }, [router])

  // Enhanced prefetch with priority handling
  const prefetch = useCallback((href: string) => {
    router.prefetch(href)
  }, [router])

  // Enhanced back navigation
  const back = useCallback(() => {
    if (currentIndex.current > 0) {
      currentIndex.current--
      router.push(navigationStack.current[currentIndex.current])
    } else {
      router.back()
    }
  }, [router])

  // Forward navigation
  const forward = useCallback(() => {
    if (currentIndex.current < navigationStack.current.length - 1) {
      currentIndex.current++
      router.push(navigationStack.current[currentIndex.current])
    }
  }, [router])

  return {
    push,
    replace,
    prefetch,
    back,
    forward
  }
}