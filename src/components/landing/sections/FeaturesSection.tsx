'use client'

import React from 'react'
import { MessageSquare, Zap, BarChart3, Shield, Clock, Users } from 'lucide-react'

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  gradient: string
  stats: string
}

interface FeaturesSectionProps {
  darkMode: boolean
}

export default function FeaturesSection({ darkMode }: FeaturesSectionProps) {
  const features: Feature[] = [
    {
      icon: MessageSquare,
      title: 'Universal Input',
      description: 'One message box sends to all selected AI models simultaneously. No need to repeat yourself.',
      gradient: 'from-blue-500 to-cyan-500',
      stats: '1 Input → 9+ Models'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant responses from multiple AI models in real-time with optimized parallel processing.',
      gradient: 'from-yellow-500 to-orange-500',
      stats: '<0.5s Response Time'
    },
    {
      icon: BarChart3,
      title: 'Smart Comparison',
      description: 'Side-by-side cards make it easy to compare quality, style, and accuracy of responses.',
      gradient: 'from-green-500 to-emerald-500',
      stats: 'Visual Side-by-Side'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted storage and user authentication.',
      gradient: 'from-purple-500 to-violet-500',
      stats: 'End-to-End Encrypted'
    },
    {
      icon: Clock,
      title: 'Fast Responses',
      description: 'Get instant responses from multiple AI models simultaneously with optimized performance.',
      gradient: 'from-pink-500 to-rose-500',
      stats: 'Under 1 Second'
    },
    {
      icon: Users,
      title: 'Premium Models',
      description: 'Access to cutting-edge AI models including GPT-5, Claude 4, and emerging models.',
      gradient: 'from-indigo-500 to-blue-500',
      stats: '9+ AI Providers'
    }
  ]

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className={`inline-flex items-center space-x-2 backdrop-blur-xl rounded-full px-5 py-2.5 mb-6 relative overflow-hidden transition-all duration-300 ${
            darkMode
              ? 'bg-gray-800/60 border border-gray-700/50 shadow-xl shadow-violet-500/10'
              : 'bg-white/70 border border-slate-200/50 shadow-xl shadow-blue-500/10'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <Zap className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
              Powerful Features
            </span>
          </div>
          <h2 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r transition-all duration-500 ${
            darkMode
              ? 'from-white to-gray-300'
              : 'from-slate-900 to-slate-700'
          } bg-clip-text text-transparent mb-6`}>
            Everything You Need
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            Built for researchers, developers, and AI enthusiasts who demand the best
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`group relative backdrop-blur-xl border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
                  darkMode
                    ? 'bg-gray-800/60 border-gray-700/50 shadow-lg shadow-violet-500/10'
                    : 'bg-white/70 border-slate-200/50 shadow-lg shadow-blue-500/10'
                }`}
              >
                {/* Enhanced glowing effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg relative z-10 ${
                  darkMode ? 'shadow-violet-500/30' : 'shadow-blue-500/30'
                }`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <div className={`px-3 py-1 bg-gradient-to-r ${feature.gradient} text-white text-xs font-bold rounded-full opacity-90 shadow ${
                    darkMode ? 'shadow-violet-500/30' : 'shadow-blue-500/30'
                  }`}>
                    {feature.stats}
                  </div>
                </div>
                <p className={`leading-relaxed relative z-10 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  {feature.description}
                </p>
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                {/* Enhanced floating indicator */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}