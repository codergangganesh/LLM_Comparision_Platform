'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Shield, Award, TrendingUp, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface CallToActionSectionProps {
  darkMode: boolean
  user: { email?: string; user_metadata?: { full_name?: string } } | null
}

export default function CallToActionSection({ darkMode, user }: CallToActionSectionProps) {
  const { signOut } = useAuth()

  return (
    <section className={`py-24 relative overflow-hidden ${
      darkMode
        ? 'bg-gradient-to-br from-violet-900 via-purple-900 to-black'
        : 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'
    }`}>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${darkMode ? 'white' : 'white'} 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Enhanced gradient overlay for depth */}
      <div className={`absolute inset-0 bg-gradient-to-t ${
        darkMode ? 'from-black/30 via-transparent to-transparent' : 'from-black/20 via-transparent to-transparent'
      }`}></div>

      {/* Additional ambient lights */}
      <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl ${
        darkMode ? 'bg-blue-500/20' : 'bg-blue-400/30'
      }`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl ${
        darkMode ? 'bg-purple-500/20' : 'bg-purple-400/30'
      }`}></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Enhanced heading with animated underline */}
        <div className="relative inline-block mb-6">
          <h2 className={`text-4xl sm:text-5xl font-bold relative z-10 transition-all duration-500 ${
            darkMode ? 'text-white' : 'text-white'
          }`}>
            Ready to Compare AI Models?
          </h2>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
        </div>

        <p className={`text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${
          darkMode ? 'text-blue-200' : 'text-blue-100'
        }`}>
          Join thousands of researchers and developers who trust AI Fiesta for their AI model comparisons.
          <span className={`block mt-2 font-bold ${
            darkMode ? 'text-white/90' : 'text-white/90'
          }`}>
            Start your journey to AI excellence today.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
          <Link
            href={user ? "/chat" : "/auth"}
            className="group relative bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 overflow-hidden backdrop-blur-sm"
          >
            {/* Animated background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>

            {/* Enhanced glowing effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

            <Sparkles className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10">Start Free Today</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />

            {/* Enhanced shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
          </Link>

          <div className={`text-sm space-y-1 backdrop-blur-sm px-4 py-3 rounded-xl ${
            darkMode ? 'bg-white/10' : 'bg-white/20'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">Free to use</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span>No credit card required</span>
            </div>
          </div>
        </div>

        {/* Enhanced Trust badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-90">
          <div className="flex items-center space-x-2 text-white/90 backdrop-blur-sm px-4 py-2 rounded-full bg-white/10">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">SOC 2 Compliant</span>
          </div>
          <div className="flex items-center space-x-2 text-white/90 backdrop-blur-sm px-4 py-2 rounded-full bg-white/10">
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold">99.9% Uptime</span>
          </div>
          <div className="flex items-center space-x-2 text-white/90 backdrop-blur-sm px-4 py-2 rounded-full bg-white/10">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">10K+ Users</span>
          </div>
        </div>
      </div>
    </section>
  )
}