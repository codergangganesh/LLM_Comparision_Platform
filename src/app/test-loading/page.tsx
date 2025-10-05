'use client'

import { useLoading } from '@/contexts/LoadingContext'
import { useState, useEffect } from 'react'

export default function TestLoadingPage() {
  const { isLoading, loadingMessage, showLoading, hideLoading } = useLoading()
  const [count, setCount] = useState(0)

  const handleShowLoading = () => {
    showLoading('Loading test message...')
    setTimeout(() => {
      hideLoading()
    }, 2000)
  }

  useEffect(() => {
    // Test the loading context
    console.log('Loading context test:', { isLoading, loadingMessage })
  }, [isLoading, loadingMessage])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white space-y-6">
      <h1 className="text-3xl font-bold">Loading Context Test</h1>
      
      <div className="p-6 bg-gray-900 rounded-xl space-y-4">
        <p>Count: {count}</p>
        <button
          onClick={() => setCount(c => c + 1)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Increment
        </button>
      </div>
      
      <div className="p-6 bg-gray-900 rounded-xl space-y-4">
        <p>Loading State: {isLoading ? 'true' : 'false'}</p>
        <p>Loading Message: {loadingMessage}</p>
        <button
          onClick={handleShowLoading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
        >
          Show Loading for 2 seconds
        </button>
        <button
          onClick={hideLoading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
        >
          Hide Loading
        </button>
      </div>
      
      <div className="text-center">
        <a href="/" className="text-blue-400 hover:underline">
          Go to Home
        </a>
      </div>
    </div>
  )
}