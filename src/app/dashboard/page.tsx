'use client'

import Link from 'next/link'
import { BarChart3, MessageSquare, Settings, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI Fiesta Dashboard
          </h1>
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Back to Comparison</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold">Model Analytics</h2>
            </div>
            <p className="text-zinc-400 mb-4">
              View performance metrics and comparison statistics for all AI models.
            </p>
            <button className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
              View Analytics
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold">Chat History</h2>
            </div>
            <p className="text-zinc-400 mb-4">
              Access your previous conversations and saved comparisons.
            </p>
            <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
              View History
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Settings className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-xl font-semibold">Preferences</h2>
            </div>
            <p className="text-zinc-400 mb-4">
              Customize your AI model preferences and application settings.
            </p>
            <button className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
              Manage Settings
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Comparisons</h2>
          <div className="text-zinc-500 text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
            <p>No comparisons yet. Start comparing AI models to see your history here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}