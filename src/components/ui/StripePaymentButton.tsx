'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'

// Make sure to add your Stripe publishable key to your .env file
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface StripePaymentButtonProps {
  priceId: string
  children: React.ReactNode
  className?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function StripePaymentButton({
  priceId,
  children,
  className = '',
  onSuccess,
  onError
}: StripePaymentButtonProps) {
  const { user } = useAuth()
  const { darkMode } = useDarkMode()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    
    try {
      const stripe = await stripePromise
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }
      
      // Call your backend to create a checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user?.id,
        }),
      })
      
      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })
      
      if (error) {
        throw new Error(error.message)
      }
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      console.error('Payment error:', errorMessage)
      
      if (onError) {
        onError(errorMessage)
      } else {
        // You might want to show a toast notification or alert here
        alert(`Payment error: ${errorMessage}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center ${className} ${
        loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
      }`}
    >
      {loading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  )
}