'use client'

import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { usePopup } from '@/contexts/PopupContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Plan {
  name: string
  description: string
  price: number
  yearlyPrice: number
  buttonText: string
  includes: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    name: "Free",
    description: "Basic features at no cost",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Start Free",
    includes: [
      "Access to 2 AI models",
      "10 comparisons per month",
      "Basic metrics & analytics",
      "Export results (CSV)",
      "Community support",
    ],
  },
  {
    name: "Pro",
    description: "Great for professionals who need more power",
    price: 1500,
    yearlyPrice: 15000,
    buttonText: "Get Pro",
    popular: true,
    includes: [
      "Access to 4+ models",
      "200 comparisons per month",
      "Advanced comparison matrix",
      "Advanced visualizations",
      "Priority support",
      "Unlimited projects",
    ],
  },
  {
    name: "Pro Plus",
    description: "Advanced features for scaling your business",
    price: 3000,
    yearlyPrice: 30000,
    buttonText: "Get Pro Plus",
    includes: [
      "Access to all AI models",
      "Unlimited comparisons",
      "Advanced AutoML capabilities",
      "Team collaboration",
      "All Pro features",
      "Advanced analytics",
    ],
  },
]

export default function PricingPopup() {
  const { isPaymentPopupOpen, closePaymentPopup } = usePopup()
  const { darkMode } = useDarkMode()
  const [isYearly, setIsYearly] = useState(false)

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (isPaymentPopupOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isPaymentPopupOpen])

  if (!isPaymentPopupOpen) return null

  const togglePricingPeriod = (value: boolean) => {
    setIsYearly(value)
  }

  const handleGetStarted = (planName: string) => {
    // Handle plan selection
    console.log(`Selected plan: ${planName}`)
    closePaymentPopup()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' 
            : 'bg-gradient-to-br from-white to-gray-100 border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closePaymentPopup}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="p-8">
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Choose the Perfect Plan
            </h2>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Flexible options for individuals and teams
            </p>

            {/* Pricing toggle */}
            <div className="flex justify-center">
              <div className={`relative flex items-center rounded-full p-1 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <button
                  onClick={() => togglePricingPeriod(false)}
                  className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all ${
                    !isYearly 
                      ? darkMode 
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                        : 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                      : darkMode 
                        ? 'text-gray-300' 
                        : 'text-gray-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => togglePricingPeriod(true)}
                  className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all ${
                    isYearly 
                      ? darkMode 
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                        : 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                      : darkMode 
                        ? 'text-gray-300' 
                        : 'text-gray-600'
                  }`}
                >
                  Yearly
                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative overflow-hidden ${
                  plan.popular 
                    ? 'ring-2 ring-blue-500 dark:ring-blue-400 scale-105' 
                    : ''
                } ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </CardTitle>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹{isYearly ? plan.yearlyPrice : plan.price}
                      </span>
                      <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                    {isYearly && plan.price > 0 && (
                      <p className="text-sm text-green-500 mt-1">
                        Save ₹{(plan.price * 12 - plan.yearlyPrice).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleGetStarted(plan.name)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all mb-6 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                        : darkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                  
                  <ul className="space-y-3">
                    {plan.includes.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className={`w-5 h-5 mr-2 flex-shrink-0 mt-0.5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}