'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Brain } from 'lucide-react'

interface SiteFooterProps {
  darkMode: boolean
}

export default function SiteFooter({ darkMode }: SiteFooterProps) {
  return (
    <footer className={`relative overflow-hidden ${
      darkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
        : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'
    }`}>
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${darkMode ? 'white' : 'white'} 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Additional ambient lights for footer */}
      <div className={`absolute top-1/4 left-1/4 w-48 h-48 rounded-full blur-3xl ${
        darkMode ? 'bg-violet-500/10' : 'bg-blue-500/10'
      }`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl ${
        darkMode ? 'bg-purple-500/10' : 'bg-purple-500/10'
      }`}></div>

      {/* Main footer content */}
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
            {/* Brand section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  darkMode 
                    ? 'bg-gradient-to-br from-violet-600 to-purple-700 shadow-violet-500/30' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/30'
                }`}>
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <span className={`text-2xl font-bold bg-gradient-to-r transition-all duration-500 ${
                  darkMode
                    ? 'from-white to-blue-200'
                    : 'from-white to-blue-200'
                } bg-clip-text text-transparent`}>
                  AI Fiesta
                </span>
              </div>
              <p className={`leading-relaxed mb-6 max-w-md ${
                darkMode ? 'text-gray-400' : 'text-slate-400'
              }`}>
                The ultimate platform for comparing AI models. Send one message to multiple AI models and find the perfect response for every task.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
                <div className="text-sm text-slate-500">
                  <span className={`font-bold ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                    10K+
                  </span> active users
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>
                Platform
              </h4>
              <ul className="space-y-2">
                {[
                  { name: 'Compare Models', href: '/chat' },
                  { name: 'View Comparisons', href: '/dashboard' },
                  { name: 'Docs', href: '/docs' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className={`hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 ${
                        darkMode ? 'text-gray-400' : 'text-slate-400'
                      }`}
                    >
                      <ChevronRight className="w-3 h-3" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Models */}
            <div>
              <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>
                AI Models
              </h4>
              <ul className="space-y-2">
                {[
                  'GPT-5',
                  'Claude 4 Sonnet',
                  'Gemini 2.5',
                  'DeepSeek',
                  'Qwen 2.5',
                  'grok',
                  'Llama',
                  'Kimi',
                  'ShisaAI'

                ].map((model, index) => (
                  <li key={index}>
                    <Link
                      href="/compare"
                      className={`hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 group ${
                        darkMode ? 'text-gray-400' : 'text-slate-400'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full group-hover:bg-blue-300 transition-colors duration-200 ${
                        darkMode ? 'bg-blue-400' : 'bg-blue-400'
                      }`}></div>
                      <span className="hover:underline">{model}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Details removed */}
            <div>
              <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>
                Connect
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="mailto:mannamganeshbabu8@gmail.com.com"
                    className={`hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>
                    <ChevronRight className="w-3 h-3" />
                    <span>E-mail</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Payment Details */}
            <div>
              <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>
                Payment Details
              </h4>
              <ul className="space-y-2">
                {[
                  { name: 'Pricing', href: '/pricing' },
                  // { name: 'Payment Methods', href: '/payment' },
                  // { name: 'Billing', href: '/account-settings#billing' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className={`hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-slate-400'
                        }`}>
                      <ChevronRight className="w-3 h-3" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className={`border-t py-8 ${
        darkMode ? 'border-gray-800/50' : 'border-slate-700/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                © 2024 AI Fiesta. Built for AI enthusiasts, by AI enthusiasts.
              </div>
              <div className="hidden md:flex items-center space-x-4 text-xs text-slate-500">
                <Link
                  href="/privacy"
                  className={`hover:text-slate-300 transition-colors ${darkMode ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                  Privacy
                </Link>
                <span>•</span>
                <Link
                  href="/terms"
                  className={`hover:text-slate-300 transition-colors ${darkMode ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                  Terms
                </Link>
                <span>•</span>
                <Link
                  href="/support"
                  className={`hover:text-slate-300 transition-colors ${darkMode ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                  Support
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                Version 1.0.0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </footer>
  )
}