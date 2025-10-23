'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Sparkles, Cpu, MessageSquare, Infinity, Zap, Brain } from 'lucide-react'
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
  // Determine which handler to use based on authentication status
  const handleClick = () => {
    if (user) {
      handleGoToChat();
    } else {
      handleGetStarted();
    }
  };

  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-violet-500/20' : 'bg-blue-400/30'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-purple-500/20' : 'bg-purple-400/30'}`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-3/4 left-1/2 w-64 h-64 rounded-full blur-2xl animate-pulse ${darkMode ? 'bg-blue-500/15' : 'bg-pink-400/20'}`} style={{ animationDelay: '2s' }}></div>

        {/* Floating geometric shapes */}
        <div 
          onClick={handleClick}
          className={`absolute top-1/3 right-1/3 w-8 h-8 rounded-lg rotate-45 animate-bounce cursor-pointer ${darkMode
            ? 'bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50'
            : 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
          }`} style={{ animationDelay: '0.5s' }}></div>
        <div 
          onClick={handleClick}
          className={`absolute bottom-1/3 left-1/5 w-6 h-6 rounded-full animate-bounce cursor-pointer ${darkMode
            ? 'bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50'
            : 'bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50'
          }`} style={{ animationDelay: '1.5s' }}></div>
        <div 
          onClick={handleClick}
          className={`absolute top-1/2 left-3/4 w-4 h-12 rounded-full animate-pulse cursor-pointer ${darkMode
            ? 'bg-gradient-to-t from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50'
            : 'bg-gradient-to-t from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50'
          }`} style={{ animationDelay: '0.8s' }}></div>
        
        {/* Additional floating elements for more depth */}
        <div 
          onClick={handleClick}
          className={`absolute top-1/4 right-1/4 w-6 h-6 rounded-full animate-ping cursor-pointer ${darkMode
            ? 'bg-gradient-to-br from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400'
            : 'bg-gradient-to-br from-indigo-400 to-blue-400 hover:from-indigo-300 hover:to-blue-300'
          }`} style={{ animationDelay: '2.5s' }}></div>
        <div 
          onClick={handleClick}
          className={`absolute bottom-1/4 left-1/3 w-10 h-10 rounded-full animate-pulse cursor-pointer ${darkMode
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400'
            : 'bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300'
          }`} style={{ animationDelay: '3s' }}></div>
        
        {/* AI Response-like Floating Elements */}
        <div 
          onClick={handleClick}
          className={`absolute top-1/5 left-1/6 w-32 h-16 rounded-xl animate-float cursor-pointer ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30' 
              : 'bg-gradient-to-r from-blue-200/40 to-purple-200/40 border border-blue-300/50 hover:from-blue-200/60 hover:to-purple-200/60'
          }`}></div>
        <div 
          onClick={handleClick}
          className={`absolute top-2/5 right-1/5 w-24 h-12 rounded-xl animate-float-delayed cursor-pointer ${
            darkMode 
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30' 
              : 'bg-gradient-to-r from-purple-200/40 to-pink-200/40 border border-purple-300/50 hover:from-purple-200/60 hover:to-pink-200/60'
          }`}></div>
        <div 
          onClick={handleClick}
          className={`absolute bottom-1/4 left-1/3 w-28 h-14 rounded-xl animate-float-opposite cursor-pointer ${
            darkMode 
              ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 hover:from-green-500/30 hover:to-blue-500/30' 
              : 'bg-gradient-to-r from-green-200/40 to-blue-200/40 border border-green-300/50 hover:from-green-200/60 hover:to-blue-200/60'
          }`}></div>
        <div 
          onClick={handleClick}
          className={`absolute bottom-2/5 right-1/4 w-20 h-10 rounded-xl animate-float-delayed-opposite cursor-pointer ${
            darkMode 
              ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:from-yellow-500/30 hover:to-orange-500/30' 
              : 'bg-gradient-to-r from-yellow-200/40 to-orange-200/40 border border-yellow-300/50 hover:from-yellow-200/60 hover:to-orange-200/60'
          }`}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Enhanced Badge with 3D effect */}
          <div 
            onClick={handleClick}
            className={`inline-flex items-center space-x-2 backdrop-blur-xl rounded-full px-5 py-2.5 mb-8 relative overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer ${
              darkMode
                ? 'bg-gray-800/60 border border-gray-700/50 shadow-2xl shadow-violet-500/20'
                : 'bg-white/80 border border-slate-200/50 shadow-2xl shadow-blue-500/20'
            }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <Sparkles className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
              Compare 9+ Premium AI Models
            </span>
          </div>

          {/* Enhanced Title with 3D effect and gradient animation */}
          <div className="mb-8">
            <h1 
              onClick={handleClick}
              className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 cursor-pointer"
            >
              <span className={`block bg-gradient-to-r transition-all duration-500 ${
                darkMode
                  ? 'from-white via-blue-200 to-purple-200'
                  : 'from-slate-900 via-blue-800 to-purple-800'
              } bg-clip-text text-transparent hover:from-blue-200 hover:via-purple-200 hover:to-pink-200`}>
                AI Model
              </span>
              <span className={`block bg-gradient-to-r transition-all duration-500 ${
                darkMode
                  ? 'from-blue-400 via-purple-400 to-pink-400'
                  : 'from-blue-600 via-purple-600 to-pink-600'
              } bg-clip-text text-transparent hover:from-blue-500 hover:via-purple-500 hover:to-pink-500`}>
                Comparison
              </span>
              <span className={`block bg-gradient-to-r transition-all duration-500 ${
                darkMode
                  ? 'from-white to-gray-300'
                  : 'from-slate-900 to-slate-700'
              } bg-clip-text text-transparent hover:from-blue-200 hover:to-purple-200`}>
                Made Simple
              </span>
            </h1>
            
            {/* Subtitle with animated underline */}
            <div 
              onClick={handleClick}
              className="relative inline-block cursor-pointer"
            >
              <h2 className={`text-2xl sm:text-3xl font-bold mt-4 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Unleash the Power of AI
              </h2>
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}></div>
            </div>
          </div>

          {/* Enhanced Description with Highlight */}
          <div 
            onClick={handleClick}
            className={`text-xl sm:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed cursor-pointer ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}
          >
            <p>
              Send one message to multiple AI models and compare their responses instantly.
              <span className={`font-bold mx-2 px-2 py-1 rounded-lg ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300' 
                  : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
              }`}>
                Find the perfect AI
              </span> 
              for every task.
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
         

          {/* Enhanced Stats with Card Design */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div 
              onClick={handleClick}
              className={`group text-center p-6 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden transform hover:-translate-y-2 cursor-pointer ${
                darkMode
                  ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 shadow-xl shadow-violet-500/10'
                  : 'bg-white/70 border-white/30 hover:bg-white/90 shadow-xl shadow-blue-500/10'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className={`w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg ${
                darkMode ? 'shadow-blue-500/30' : 'shadow-blue-500/30'
              }`}>
                <Cpu className="w-7 h-7 text-white" />
              </div>
              <div className={`text-3xl font-extrabold mb-2 relative z-10 ${
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
            <div 
              onClick={handleClick}
              className={`group text-center p-6 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden transform hover:-translate-y-2 cursor-pointer ${
                darkMode
                  ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 shadow-xl shadow-violet-500/10'
                  : 'bg-white/70 border-white/30 hover:bg-white/90 shadow-xl shadow-blue-500/10'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className={`w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg ${
                darkMode ? 'shadow-green-500/30' : 'shadow-green-500/30'
              }`}>
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div className={`text-3xl font-extrabold mb-2 relative z-10 ${
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
            <div 
              onClick={handleClick}
              className={`group text-center p-6 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden transform hover:-translate-y-2 cursor-pointer ${
                darkMode
                  ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 shadow-xl shadow-violet-500/10'
                  : 'bg-white/70 border-white/30 hover:bg-white/90 shadow-xl shadow-blue-500/10'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className={`w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg ${
                darkMode ? 'shadow-pink-500/30' : 'shadow-pink-500/30'
              }`}>
                <Infinity className="w-7 h-7 text-white" />
              </div>
              <div className={`text-3xl font-extrabold mb-2 relative z-10 ${
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
            <div 
              onClick={handleClick}
              className={`group text-center p-6 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden transform hover:-translate-y-2 cursor-pointer ${
                darkMode
                  ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 shadow-xl shadow-violet-500/10'
                  : 'bg-white/70 border-white/30 hover:bg-white/90 shadow-xl shadow-blue-500/10'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className={`w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg ${
                darkMode ? 'shadow-orange-500/30' : 'shadow-orange-500/30'
              }`}>
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className={`text-3xl font-extrabold mb-2 relative z-10 ${
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
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) translateX(10px) rotate(5deg);
          }
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
        }
        
        @keyframes float-delayed {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) translateX(-10px) rotate(-5deg);
          }
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
        }
        
        @keyframes float-opposite {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) translateX(-15px) rotate(-3deg);
          }
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
        }
        
        @keyframes float-delayed-opposite {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) translateX(15px) rotate(3deg);
          }
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-float-opposite {
          animation: float-opposite 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-float-delayed-opposite {
          animation: float-delayed-opposite 6s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </section>
  )
}