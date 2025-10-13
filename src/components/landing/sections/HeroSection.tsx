'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Sparkles, Cpu, MessageSquare, Infinity, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AIFiestaLogo from '../AIFiestaLogo'

interface HeroSectionProps {
  darkMode: boolean
  handleGetStarted: () => void
  handleGoToChat: () => void
  user: { email?: string; user_metadata?: { full_name?: string } } | null
}

export default function HeroSection({ 
  darkMode, 
  handleGetStarted, 
  handleGoToChat, 
  user 
}: HeroSectionProps) {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-violet-500/20' : 'bg-blue-400/30'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-purple-500/20' : 'bg-purple-400/30'}`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-3/4 left-1/2 w-64 h-64 rounded-full blur-2xl animate-pulse ${darkMode ? 'bg-blue-500/15' : 'bg-pink-400/20'}`} style={{ animationDelay: '2s' }}></div>

        {/* Floating geometric shapes */}
        <div className={`absolute top-1/3 right-1/3 w-8 h-8 rounded-lg rotate-45 animate-bounce ${darkMode
            ? 'bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30'
            : 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30'
          }`} style={{ animationDelay: '0.5s' }}></div>
        <div className={`absolute bottom-1/3 left-1/5 w-6 h-6 rounded-full animate-bounce ${darkMode
            ? 'bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-500/30'
            : 'bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-500/30'
          }`} style={{ animationDelay: '1.5s' }}></div>
        <div className={`absolute top-1/2 left-3/4 w-4 h-12 rounded-full animate-pulse ${darkMode
            ? 'bg-gradient-to-t from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30'
            : 'bg-gradient-to-t from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30'
          }`} style={{ animationDelay: '0.8s' }}></div>
        
        {/* Additional floating elements for more depth */}
        <div className={`absolute top-1/4 right-1/4 w-6 h-6 rounded-full animate-ping ${darkMode
            ? 'bg-gradient-to-br from-indigo-500 to-blue-500'
            : 'bg-gradient-to-br from-indigo-400 to-blue-400'
          }`} style={{ animationDelay: '2.5s' }}></div>
        <div className={`absolute bottom-1/4 left-1/3 w-10 h-10 rounded-full animate-pulse ${darkMode
            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
            : 'bg-gradient-to-br from-purple-400 to-pink-400'
          }`} style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge with enhanced glowing effect */}
          <div className={`inline-flex items-center space-x-2 backdrop-blur-xl rounded-full px-5 py-2.5 mb-8 relative overflow-hidden transition-all duration-300 ${
            darkMode
              ? 'bg-gray-800/60 border border-gray-700/50 shadow-xl shadow-violet-500/10'
              : 'bg-white/70 border border-slate-200/50 shadow-xl shadow-blue-500/10'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <Sparkles className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
              Compare 9+ Premium AI Models
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8">
            <span className={`bg-gradient-to-r transition-all duration-500 ${
              darkMode
                ? 'from-white via-blue-200 to-purple-200'
                : 'from-slate-900 via-blue-800 to-purple-800'
            } bg-clip-text text-transparent`}>
              AI Model
            </span>
            <br />
            <span className={`bg-gradient-to-r transition-all duration-500 ${
              darkMode
                ? 'from-blue-400 via-purple-400 to-pink-400'
                : 'from-blue-600 via-purple-600 to-pink-600'
            } bg-clip-text text-transparent`}>
              Comparison
            </span>
            <br />
            <span className={`bg-gradient-to-r transition-all duration-500 ${
              darkMode
                ? 'from-white to-gray-300'
                : 'from-slate-900 to-slate-700'
            } bg-clip-text text-transparent`}>
              Made Simple
            </span>
          </h1>

          <p className={`text-xl sm:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            Send one message to multiple AI models and compare their responses instantly.
            <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Find the perfect AI
            </span> for every task.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={user ? handleGoToChat : handleGetStarted}
              className="group bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 relative overflow-hidden backdrop-blur-sm"
            >
              {/* Enhanced glowing effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <Play className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Start Comparing</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              
              {/* Enhanced shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
            </button>

            <div className={`flex items-center space-x-4 ${
              darkMode ? 'text-gray-400' : 'text-slate-600'
            }`}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 backdrop-blur-sm ${
                    darkMode 
                      ? 'bg-gradient-to-br from-blue-400 to-purple-500 border-gray-900 shadow-lg shadow-blue-500/30' 
                      : 'bg-gradient-to-br from-blue-400 to-purple-500 border-white shadow-lg shadow-blue-500/30'
                  }`}></div>
                ))}
              </div>
              <span className="text-sm font-semibold">9+ AI Models Available</span>
            </div>
          </div>

          {/* Enhanced Stats with more advanced glowing effect */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className={`group text-center p-6 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden ${
              darkMode
                ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 shadow-lg shadow-violet-500/10'
                : 'bg-white/60 border-white/30 hover:bg-white/80 shadow-lg shadow-blue-500/10'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10 shadow-lg ${
                darkMode ? 'shadow-blue-500/30' : 'shadow-blue-500/30'
              }`}>
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div className={`text-3xl font-bold mb-2 relative z-10 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                9+
              </div>
              <div className={`text-sm font-semibold relative z-10 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                AI Models
              </div>
            </div>
            <div className={`group text-center p-6 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden ${
              darkMode
                ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 shadow-lg shadow-violet-500/10'
                : 'bg-white/60 border-white/30 hover:bg-white/80 shadow-lg shadow-blue-500/10'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className={`w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10 shadow-lg ${
                darkMode ? 'shadow-green-500/30' : 'shadow-green-500/30'
              }`}>
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className={`text-3xl font-bold mb-2 relative z-10 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                1
              </div>
              <div className={`text-sm font-semibold relative z-10 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Universal Input
              </div>
            </div>
            <div className={`group text-center p-6 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden ${
              darkMode
                ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 shadow-lg shadow-violet-500/10'
                : 'bg-white/60 border-white/30 hover:bg-white/80 shadow-lg shadow-blue-500/10'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className={`w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10 shadow-lg ${
                darkMode ? 'shadow-pink-500/30' : 'shadow-pink-500/30'
              }`}>
                <Infinity className="w-6 h-6 text-white" />
              </div>
              <div className={`text-3xl font-bold mb-2 relative z-10 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                ∞
              </div>
              <div className={`text-sm font-semibold relative z-10 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Comparisons
              </div>
            </div>
            <div className={`group text-center p-6 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden ${
              darkMode
                ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 shadow-lg shadow-violet-500/10'
                : 'bg-white/60 border-white/30 hover:bg-white/80 shadow-lg shadow-blue-500/10'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className={`w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10 shadow-lg ${
                darkMode ? 'shadow-orange-500/30' : 'shadow-orange-500/30'
              }`}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className={`text-3xl font-bold mb-2 relative z-10 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                0.5s
              </div>
              <div className={`text-sm font-semibold relative z-10 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Avg Response
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}