'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import BarChart from '@/components/dashboard/BarChart'
import LineChart from '@/components/dashboard/LineChart'
import DonutChart from '@/components/dashboard/DonutChart'
import ResponseTimeDistribution from '@/components/dashboard/ResponseTimeDistribution'
import { useRouter } from 'next/navigation'

import {
  TrendingUp,
  GitCompare,
  Brain,
  Activity,
  Sparkles,
  Download,
  Bell
} from 'lucide-react'
import SimpleProfileIcon from '@/components/layout/SimpleProfileIcon'
import NotificationBell from '@/components/ui/NotificationBell'

interface MetricCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: any
  color: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { darkMode } = useDarkMode()
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'Total Comparisons',
      value: '24',
      change: '+12.5%',
      trend: 'up',
      icon: GitCompare,
      color: 'blue'
    },
    {
      title: 'Models Analyzed',
      value: '8',
      change: '+8.2%',
      trend: 'up',
      icon: Brain,
      color: 'purple'
    },
    {
      title: 'Accuracy Score',
      value: '92%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'API Usage',
      value: '45%',
      change: '-5.4%',
      trend: 'down',
      icon: Activity,
      color: 'orange'
    }
  ])
  
  // Redirect unauthenticated users to the auth page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Show nothing while loading or redirecting
  if (loading || !user) {
    return null
  }
  
  const [usageData] = useState({
    apiCalls: 45,
    comparisons: 24,
    storage: 2.3
  })
  
  const [userPlan] = useState('free')
  
  const [isExportOpen, setIsExportOpen] = useState(false)
  
  // Mock data for charts
  const responseTimeData = [
    { name: 'GPT-4', value: 2.3, color: '#3B82F6' },
    { name: 'Claude-3', value: 1.8, color: '#3B82F6' },
    { name: 'LLaMA-3', value: 3.1, color: '#3B82F6' },
    { name: 'Qwen-2.5', value: 2.7, color: '#3B82F6' },
    { name: 'DeepSeek', value: 3.5, color: '#3B82F6' }
  ]

  const messagesTypedData = [
    { name: 'GPT-4', value: 12, color: '#10B981' },
    { name: 'Claude-3', value: 8, color: '#10B981' },
    { name: 'LLaMA-3', value: 15, color: '#10B981' },
    { name: 'Qwen-2.5', value: 10, color: '#10B981' },
    { name: 'DeepSeek', value: 18, color: '#10B981' }
  ]

  const modelDataTimeData = [
    { name: 'GPT-4', value: 0.4, color: '#8B5CF6' },
    { name: 'Claude-3', value: 0.3, color: '#8B5CF6' },
    { name: 'LLaMA-3', value: 0.7, color: '#8B5CF6' },
    { name: 'Qwen-2.5', value: 0.5, color: '#8B5CF6' },
    { name: 'DeepSeek', value: 0.8, color: '#8B5CF6' }
  ]

  const responseTimeDistributionData = [
    { name: 'GPT-4', value: 2.3, color: '#F59E0B' },
    { name: 'Claude-3', value: 1.8, color: '#F59E0B' },
    { name: 'LLaMA-3', value: 3.1, color: '#F59E0B' },
    { name: 'Qwen-2.5', value: 2.7, color: '#F59E0B' },
    { name: 'DeepSeek', value: 3.5, color: '#F59E0B' }
  ]

  const lineChartData = [
    { period: '2025-09-15', 'GPT-4': 2.3, 'Claude-3': 1.8, 'LLaMA-3': 3.1, 'Qwen-2.5': 2.7, 'DeepSeek': 3.5 },
    { period: '2025-09-16', 'GPT-4': 2.1, 'Claude-3': 1.9, 'LLaMA-3': 3.2, 'Qwen-2.5': 2.6, 'DeepSeek': 3.4 },
    { period: '2025-09-17', 'GPT-4': 2.5, 'Claude-3': 1.7, 'LLaMA-3': 3.0, 'Qwen-2.5': 2.8, 'DeepSeek': 3.6 },
    { period: '2025-09-18', 'GPT-4': 2.2, 'Claude-3': 1.8, 'LLaMA-3': 3.3, 'Qwen-2.5': 2.5, 'DeepSeek': 3.3 },
    { period: '2025-09-19', 'GPT-4': 2.4, 'Claude-3': 1.9, 'LLaMA-3': 3.1, 'Qwen-2.5': 2.9, 'DeepSeek': 3.7 },
    { period: '2025-09-20', 'GPT-4': 2.0, 'Claude-3': 1.7, 'LLaMA-3': 3.2, 'Qwen-2.5': 2.4, 'DeepSeek': 3.2 }
  ]
  
  const lineChartMetrics = ['GPT-4', 'Claude-3', 'LLaMA-3', 'Qwen-2.5', 'DeepSeek']
  const lineChartMetricLabels = {
    'GPT-4': 'GPT-4',
    'Claude-3': 'Claude-3',
    'LLaMA-3': 'LLaMA-3',
    'Qwen-2.5': 'Qwen-2.5',
    'DeepSeek': 'DeepSeek'
  }

  const getMetricColorClasses = (color: string) => {
    const colors = {
      blue: darkMode 
        ? 'from-blue-600 to-blue-700 text-white' 
        : 'from-blue-500 to-blue-600 text-white',
      purple: darkMode 
        ? 'from-purple-600 to-purple-700 text-white' 
        : 'from-purple-500 to-purple-600 text-white',
      green: darkMode 
        ? 'from-green-600 to-green-700 text-white' 
        : 'from-green-500 to-green-600 text-white',
      orange: darkMode 
        ? 'from-orange-600 to-orange-700 text-white' 
        : 'from-orange-500 to-orange-600 text-white'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  // Function to get plan display name
  const getPlanDisplayName = () => {
    switch (userPlan) {
      case 'pro':
      case 'pro_plus':
        return 'Pro Plus'
      default:
        return 'Free'
    }
  }

  // Function to get plan limits based on plan type
  const getPlanLimits = (planType: string) => {
    switch (planType) {
      case 'pro':
        return {
          apiCalls: 2500,
          comparisons: 500,
          storage: 10
        }
      case 'pro_plus':
        return {
          apiCalls: 10000,
          comparisons: Infinity, // unlimited
          storage: 100
        }
      default: // free plan
        return {
          apiCalls: 100,
          comparisons: 10,
          storage: 1
        }
    }
  }

  // Function to calculate usage percentage
  const calculateUsagePercentage = (current: number, limit: number) => {
    if (limit === Infinity) return 0
    return Math.min(100, (current / limit) * 100)
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <AdvancedSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300">
        {/* Header */}
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Dashboard
                </h1>
                <p className={`mt-1 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Welcome back! Here's your AI platform overview.
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <NotificationBell />
                
                {/* Simple Profile Icon */}
                <SimpleProfileIcon />
                
                {/* Export Dropdown - Modern Design */}
                <div className="relative">
                  <button 
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                      darkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span className="font-medium">Export</span>
                  </button>
                  
                  {/* Dropdown menu for export options */}
                  {isExportOpen && (
                    <div 
                      className={`absolute right-0 w-56 rounded-xl shadow-xl z-20 overflow-hidden transform transition-all duration-200 ease-in-out mt-2 ${
                        darkMode 
                          ? 'bg-gray-800/95 border border-gray-700 backdrop-blur-xl' 
                          : 'bg-white/95 border border-slate-200 backdrop-blur-xl'
                      }`}
                    >
                      <div className="py-1">
                        <div className={`px-4 py-3 border-b ${
                          darkMode ? 'border-gray-700' : 'border-slate-200'
                        }`}>
                          <h3 className={`text-sm font-semibold ${
                            darkMode ? 'text-gray-200' : 'text-slate-800'
                          }`}>
                            Export Dashboard Data
                          </h3>
                        </div>
                        <button
                          onClick={() => setIsExportOpen(false)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center justify-between ${
                            darkMode 
                              ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                              : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                              darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                            }`}>
                              <span className={`text-xs font-bold ${
                                darkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}>JSON</span>
                            </div>
                            <span>Export to JSON</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setIsExportOpen(false)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center justify-between ${
                            darkMode 
                              ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                              : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                              darkMode ? 'bg-green-900/30' : 'bg-green-100'
                            }`}>
                              <span className={`text-xs font-bold ${
                                darkMode ? 'text-green-400' : 'text-green-600'
                              }`}>CSV</span>
                            </div>
                            <span>Export to CSV</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setIsExportOpen(false)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center justify-between ${
                            darkMode 
                              ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                              : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                              darkMode ? 'bg-red-900/30' : 'bg-red-100'
                            }`}>
                              <span className={`text-xs font-bold ${
                                darkMode ? 'text-red-400' : 'text-red-600'
                              }`}>PDF</span>
                            </div>
                            <span>Export to PDF</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30' 
                    : 'bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Sparkles className={`w-4 h-4 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      {getPlanDisplayName()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div
                  key={index}
                  className={`rounded-2xl p-6 transition-all duration-200 hover:scale-105 ${
                    darkMode 
                      ? 'bg-gray-800/60 border border-gray-700/50' 
                      : 'bg-white/80 border border-slate-200/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getMetricColorClasses(metric.color)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${
                      metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      <TrendingUp className={`w-4 h-4 ${
                        metric.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      <span>{metric.change}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={`text-2xl font-bold mb-1 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {metric.value}
                    </h3>
                    <p className={`text-sm transition-colors duration-200 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {metric.title}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Usage Summary Section */}
          <div>
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Data Usage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* API Calls Usage */}
              <div className={`rounded-2xl p-6 transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${
                    darkMode 
                      ? 'from-blue-600 to-blue-700 text-white' 
                      : 'from-blue-500 to-blue-600 text-white'
                  }`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {usageData.apiCalls} / {getPlanLimits(userPlan).apiCalls === Infinity ? '∞' : getPlanLimits(userPlan).apiCalls}
                    </p>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-500' : 'text-slate-500'
                    }`}>
                      calls
                    </p>
                  </div>
                </div>
                
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  API Calls
                </h3>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${calculateUsagePercentage(usageData.apiCalls, getPlanLimits(userPlan).apiCalls)}%` 
                    }}
                  ></div>
                </div>
                
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  {calculateUsagePercentage(usageData.apiCalls, getPlanLimits(userPlan).apiCalls).toFixed(1)}% used
                </p>
              </div>

              {/* Model Comparisons Usage */}
              <div className={`rounded-2xl p-6 transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${
                    darkMode 
                      ? 'from-purple-600 to-purple-700 text-white' 
                      : 'from-purple-500 to-purple-600 text-white'
                  }`}>
                    <GitCompare className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {usageData.comparisons} / {getPlanLimits(userPlan).comparisons === Infinity ? '∞' : getPlanLimits(userPlan).comparisons}
                    </p>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-500' : 'text-slate-500'
                    }`}>
                      comparisons
                    </p>
                  </div>
                </div>
                
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Model Comparisons
                </h3>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ 
                      width: `${calculateUsagePercentage(usageData.comparisons, getPlanLimits(userPlan).comparisons)}%` 
                    }}
                  ></div>
                </div>
                
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  {calculateUsagePercentage(usageData.comparisons, getPlanLimits(userPlan).comparisons).toFixed(1)}% used
                </p>
              </div>

              {/* Storage Usage */}
              <div className={`rounded-2xl p-6 transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${
                    darkMode 
                      ? 'from-green-600 to-green-700 text-white' 
                      : 'from-green-500 to-green-600 text-white'
                  }`}>
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-4 h-4 rounded border-2 border-white"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {usageData.storage.toFixed(2)} / {getPlanLimits(userPlan).storage}
                    </p>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-500' : 'text-slate-500'
                    }`}>
                      GB
                    </p>
                  </div>
                </div>
                
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Storage
                </h3>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${calculateUsagePercentage(usageData.storage, getPlanLimits(userPlan).storage)}%` 
                    }}
                  ></div>
                </div>
                
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  {calculateUsagePercentage(usageData.storage, getPlanLimits(userPlan).storage).toFixed(1)}% used
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart 
              data={responseTimeData} 
              title="Response Time Comparison" 
              unit="s"
            />
            <DonutChart 
              data={messagesTypedData} 
              title="Messages Typed per Model" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart 
              data={modelDataTimeData} 
              title="Model Data Processing Time" 
              unit="s"
            />
            <LineChart 
              data={lineChartData} 
              title="Response Time Trends Over Time" 
              metrics={lineChartMetrics}
              metricLabels={lineChartMetricLabels}
            />
          </div>

          {/* Response Time Distribution Chart */}
          <div className="grid grid-cols-1 gap-6">
            <ResponseTimeDistribution 
              data={responseTimeDistributionData} 
              title="Response Time Distribution" 
              unit="s"
            />
          </div>
        </div>
      </div>
    </div>
  )
}