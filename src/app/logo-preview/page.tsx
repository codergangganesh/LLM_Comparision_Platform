'use client'

import AIFiestaLogo from '@/components/landing/AIFiestaLogo'
import Link from 'next/link'
import { useState } from 'react'

export default function LogoPreview() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Fiesta Logo Preview
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg font-medium ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
            }`}
          >
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Regular Logo */}
          <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Regular Logo
            </h2>
            <div className="flex flex-col items-center space-y-8">
              <div className="flex items-center space-x-4">
                <AIFiestaLogo size="sm" darkMode={darkMode} />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Small (sm)</span>
              </div>
              <div className="flex items-center space-x-4">
                <AIFiestaLogo size="md" darkMode={darkMode} />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Medium (md)</span>
              </div>
              <div className="flex items-center space-x-4">
                <AIFiestaLogo size="lg" darkMode={darkMode} />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Large (lg)</span>
              </div>
              <div className="flex items-center space-x-4">
                <AIFiestaLogo size="xl" darkMode={darkMode} />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Extra Large (xl)</span>
              </div>
            </div>
          </div>

          {/* Simplified Logo */}
          <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Simplified Logo
            </h2>
            <div className="flex flex-col items-center space-y-8">
              <div className="flex items-center space-x-4">
                <AIFiestaLogo size="sm" darkMode={darkMode} simplified />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Small (sm)</span>
              </div>
              <div className="flex items-center space-x-4">
                <AIFiestaLogo size="md" darkMode={darkMode} simplified />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Medium (md)</span>
              </div>
              <div className="flex items-center space-x-4">
                <AIFiestaLogo size="lg" darkMode={darkMode} simplified />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Large (lg)</span>
              </div>
              <div className="flex items-center space-x-4">
                <AIFiestaLogo size="xl" darkMode={darkMode} simplified />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Extra Large (xl)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logo in Context */}
        <div className={`mt-12 p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Logo in Context
          </h2>
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-4">
              <AIFiestaLogo size="lg" darkMode={darkMode} />
              <h1 className={`text-3xl font-bold bg-gradient-to-r ${
                darkMode
                  ? 'from-white to-gray-300'
                  : 'from-gray-900 to-gray-700'
              } bg-clip-text text-transparent`}>
                AI Fiesta
              </h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}