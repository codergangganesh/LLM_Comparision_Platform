'use client'

import { usePopup } from '@/contexts/PopupContext'

export default function TestPricingPage() {
  const { openPaymentPopup } = usePopup()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white space-y-6">
      <h1 className="text-3xl font-bold">Pricing Popup Test</h1>
      
      <div className="p-6 bg-gray-900 rounded-xl space-y-4">
        <p>Click the button below to test the pricing popup:</p>
        <button
          onClick={openPaymentPopup}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Open Pricing Popup
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