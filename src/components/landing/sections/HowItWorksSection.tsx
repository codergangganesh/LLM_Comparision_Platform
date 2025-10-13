'use client'

import React from 'react'
import { Play, Brain, MessageSquare, Star } from 'lucide-react'

interface Step {
  number: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

interface HowItWorksSectionProps {
  darkMode: boolean
  setShowVideoTutorial: (show: boolean) => void
}

export default function HowItWorksSection({ darkMode, setShowVideoTutorial }: HowItWorksSectionProps) {
  const steps: Step[] = [
    {
      number: '01',
      title: 'Choose Your Models',
      description: 'Select from 9+ premium AI models using our intuitive model selector.',
      icon: Brain
    },
    {
      number: '02',
      title: 'Send One Message',
      description: 'Type your question once and watch it reach all selected models instantly.',
      icon: MessageSquare
    },
    {
      number: '03',
      title: 'Compare & Choose',
      description: 'Review responses side-by-side and mark the best one for future reference.',
      icon: Star
    }
  ]

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div 
            onClick={() => setShowVideoTutorial(true)}
            className={`inline-flex items-center space-x-2 backdrop-blur-xl rounded-full px-5 py-2.5 mb-6 relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105 ${
              darkMode
                ? 'bg-gray-800/60 border border-gray-700/50 shadow-xl shadow-violet-500/10'
                : 'bg-white/70 border border-slate-200/50 shadow-xl shadow-blue-500/10'
            }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <Play className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
              How It Works
            </span>
          </div>
          <h2 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r transition-all duration-500 ${
            darkMode
              ? 'from-white to-gray-300'
              : 'from-slate-900 to-slate-700'
          } bg-clip-text text-transparent mb-6`}>
            Three Simple Steps
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            Get started with AI model comparison in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative group">
                {/* Enhanced Connection Line with gradient */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 transform translate-x-4 rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse opacity-50"></div>
                  </div>
                )}

                <div className="text-center relative">
                  {/* Enhanced icon container with animated rings */}
                  <div className="relative mx-auto mb-6">
                    <div className={`w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl relative overflow-hidden ${
                      darkMode ? 'shadow-violet-500/30' : 'shadow-blue-500/30'
                    }`}>
                      <Icon className="w-10 h-10 text-white relative z-10" />

                      {/* Animated background pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Enhanced animated rings around icon */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-blue-300/30 animate-ping" style={{ animationDuration: '3s', animationDelay: `${index * 0.5}s` }}></div>
                    <div className="absolute inset-0 rounded-3xl border border-purple-300/20 animate-pulse" style={{ animationDelay: `${index * 0.3}s` }}></div>
                  </div>

                  {/* Enhanced step number */}
                  <div className={`inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full mb-4 shadow-lg ${
                    darkMode ? 'shadow-violet-500/30' : 'shadow-blue-500/30'
                  }`}>
                    {step.number}
                  </div>

                  <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                    darkMode 
                      ? 'text-white group-hover:text-blue-300' 
                      : 'text-slate-900 group-hover:text-blue-600'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`leading-relaxed max-w-sm mx-auto ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    {step.description}
                  </p>

                  {/* Enhanced floating badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}