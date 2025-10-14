'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import SharedSidebar from '@/components/layout/SharedSidebar'
import BarChart from '@/components/dashboard/BarChart'
import LineChart from '@/components/dashboard/LineChart'
import SimpleCircleChart from '@/components/dashboard/SimpleCircleChart'
import ResponseTimeDistribution from '@/components/dashboard/ResponseTimeDistribution'
import { useOptimizedRouter } from '@/hooks/useOptimizedRouter'
import OptimizedPageTransitionLoader from '@/components/ui/OptimizedPageTransitionLoader'
import { useOptimizedLoading } from '@/contexts/OptimizedLoadingContext'
import { dashboardService } from '@/services/dashboard.service'
import { chatHistoryService } from '@/services/chatHistory.service'
import { ChatSession } from '@/types/chat'
import { createClient } from '@/utils/supabase/client'
import { AI_MODELS } from '@/config/ai-models'

import {
  TrendingUp,
  GitCompare,
  Brain,
  Activity,
  Sparkles,
  Download,
  Bell,
  MessageSquare
} from 'lucide-react'
import SimpleProfileIcon from '@/components/layout/SimpleProfileIcon'
import NotificationBell from '@/components/ui/NotificationBell'

interface MetricCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useOptimizedRouter()
  const { darkMode } = useDarkMode()
  const { setPageLoading } = useOptimizedLoading()
  const supabase = createClient()
  const realtimeSubscriptionRef = useRef<any>(null)
  
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'Total Comparisons',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: GitCompare,
      color: 'blue'
    },
    {
      title: 'Models Analyzed',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: Brain,
      color: 'purple'
    },
    {
      title: 'Accuracy Score',
      value: '0%',
      change: '+0%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'API Usage',
      value: '0%',
      change: '-0%',
      trend: 'down',
      icon: Activity,
      color: 'orange'
    }
  ])
  
  const [usageData, setUsageData] = useState({
    apiCalls: 0,
    comparisons: 0,
    storage: 0
  })
  const [avgResponsesPerComparison, setAvgResponsesPerComparison] = useState<number>(0)
  const [showAllGraphs, setShowAllGraphs] = useState(false)
  const [uniqueModelCount, setUniqueModelCount] = useState<number>(0)
  
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [availableModels, setAvailableModels] = useState<any[]>([])
  const [hasUsedModels, setHasUsedModels] = useState(false)
  
  
  const [responseTimeData, setResponseTimeData] = useState<{name: string; value: number; color: string}[]>([])
  const [messagesTypedData, setMessagesTypedData] = useState<{name: string; value: number; color: string}[]>([])
  const [modelDataTimeData, setModelDataTimeData] = useState<{name: string; value: number; color: string}[]>([])
  const [responseTimeDistributionData, setResponseTimeDistributionData] = useState<{name: string; value: number; color: string}[]>([])
  const [lineChartData, setLineChartData] = useState<{[key: string]: string | number; period: string}[]>([])
  const [lineChartMetrics, setLineChartMetrics] = useState<string[]>([])
  const [lineChartMetricLabels, setLineChartMetricLabels] = useState<Record<string, string>>({})
  const [userPlan] = useState('free')
  
  // Reset color map when component mounts
  useEffect(() => {
    // Reset the model color map for consistent coloring
    dashboardService.clearCache()
  }, [])
  
  // Redirect unauthenticated users to the auth page
  useEffect(() => {
    if (!loading && !user) {
      setPageLoading(true, "Redirecting to authentication...")
      router.push('/auth')
    } else if (user && !loading) {
      setPageLoading(false)
    }
  }, [user, loading, router, setPageLoading])

  // Load available models
  useEffect(() => {
    setAvailableModels(AI_MODELS)
  }, [])

  // Filter sessions by selected models and time range
  const filterSessions = (sessionsToFilter: ChatSession[]): ChatSession[] => sessionsToFilter

  // Function to update dashboard data
  const updateDashboardData = async (fetchedSessions: ChatSession[] | null = null) => {
    try {
      // If no sessions provided, fetch them
      const sessionsToUse = fetchedSessions || await dashboardService.getChatSessions(false)
      
      if (sessionsToUse) {
        // Check if user has used models
        const hasSessions = sessionsToUse.length > 0
        setHasUsedModels(hasSessions)
        
        // Apply filters
        const filteredSessions = filterSessions(sessionsToUse)
        setSessions(filteredSessions)
        
        // Calculate metrics based on actual session data
        const dashboardMetrics = dashboardService.calculateDashboardMetrics(filteredSessions)
        
        // Update metrics with actual values
        setMetrics([
          {
            title: 'Total Comparisons',
            value: dashboardMetrics.totalComparisons.toString(),
            change: dashboardMetrics.totalComparisons > 0 ? '+12.5%' : '+0%',
            trend: 'up',
            icon: GitCompare,
            color: 'blue'
          },
          {
            title: 'Models Analyzed',
            value: dashboardMetrics.modelsAnalyzed.toString(),
            change: dashboardMetrics.modelsAnalyzed > 0 ? '+8.2%' : '+0%',
            trend: 'up',
            icon: Brain,
            color: 'purple'
          },
          {
            title: 'Accuracy Score',
            value: `${dashboardMetrics.accuracyScore}%`,
            change: dashboardMetrics.accuracyScore > 0 ? '+2.1%' : '+0%',
            trend: 'up',
            icon: TrendingUp,
            color: 'green'
          },
          {
            title: 'API Usage',
            value: `${dashboardMetrics.apiUsage}%`,
            change: dashboardMetrics.apiUsage > 0 ? '-5.4%' : '-0%',
            trend: dashboardMetrics.apiUsage > 50 ? 'down' : 'up',
            icon: Activity,
            color: 'orange'
          }
        ])
        
        // Calculate usage data
        const usage = dashboardService.getUsageData(filteredSessions)
        setUsageData(usage)
        // Derived metrics
        const totalResponses = filteredSessions.reduce((sum, s) => sum + ((s as any).responses ? (s as any).responses.length : 0), 0)
        const avg = filteredSessions.length > 0 ? totalResponses / filteredSessions.length : 0
        setAvgResponsesPerComparison(Number.isFinite(avg) ? parseFloat(avg.toFixed(2)) : 0)
        const uniq = new Set<string>()
        filteredSessions.forEach(s => (s.selectedModels || []).forEach(id => uniq.add(id)))
        setUniqueModelCount(uniq.size)
        
        // Update charts with actual data
        setResponseTimeData(dashboardService.getResponseTimeData(filteredSessions))
        setMessagesTypedData(dashboardService.getMessagesTypedData(filteredSessions))
        setModelDataTimeData(dashboardService.getModelDataTimeData(filteredSessions))
        setResponseTimeDistributionData(dashboardService.getResponseTimeDistributionData(filteredSessions))
        
        // Calculate line chart data
        const lineData = dashboardService.getLineChartData(filteredSessions)
        setLineChartData(lineData)
        
        const metricsList = dashboardService.getLineChartMetrics(filteredSessions)
        setLineChartMetrics(metricsList)
        
        const metricLabels: Record<string, string> = {}
        metricsList.forEach(metric => {
          metricLabels[metric] = metric
        })
        setLineChartMetricLabels(metricLabels)
      }
    } catch (error) {
      console.error('Error updating dashboard data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || loading) return
      
      setLoadingData(true)
      try {
        // Fetch chat sessions
        const fetchedSessions = await chatHistoryService.getChatSessions()
        await updateDashboardData(fetchedSessions || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoadingData(false)
      }
    }
    
    fetchData()
  }, [user, loading])

  

  // Set up real-time subscription for chat sessions
  useEffect(() => {
    if (!user || loading) return

    // Subscribe to chat session changes
    const channel = supabase
      .channel('dashboard-chat-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('New chat session added:', payload.new)
          // Clear cache and fetch updated data
          dashboardService.clearCache()
          const fetchedSessions = await chatHistoryService.getChatSessions(false)
          await updateDashboardData(fetchedSessions || [])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Chat session updated:', payload.new)
          // Clear cache and fetch updated data
          dashboardService.clearCache()
          const fetchedSessions = await chatHistoryService.getChatSessions(false)
          await updateDashboardData(fetchedSessions || [])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Chat session deleted:', payload.old)
          // Clear cache and fetch updated data
          dashboardService.clearCache()
          const fetchedSessions = await chatHistoryService.getChatSessions(false)
          await updateDashboardData(fetchedSessions || [])
        }
      )
      .subscribe()

    realtimeSubscriptionRef.current = channel

    // Clean up subscription
    return () => {
      if (realtimeSubscriptionRef.current) {
        supabase.removeChannel(realtimeSubscriptionRef.current)
      }
    }
  }, [user, loading])

  // Show loading while checking auth status
  if (loading || loadingData) {
    return <OptimizedPageTransitionLoader message="Loading dashboard..." />
  }

  // Show nothing while redirecting
  if (!user) {
    return null
  }
  
  // Function to generate dashboard data for export
  const generateDashboardData = () => {
    return {
      metrics: metrics,
      usageData: usageData,
      userPlan: userPlan,
      exportDate: new Date().toISOString(),
      userId: user?.id
    }
  }
  
  // Function to export data as JSON
  const exportToJSON = () => {
    const data = generateDashboardData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-data-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setIsExportOpen(false)
  }
  
  // Function to export data as CSV
  const exportToCSV = () => {
    const data = generateDashboardData()
    let csvContent = 'Dashboard Data Export\n'
    csvContent += `Export Date: ${data.exportDate}\n\n`
    
    // Metrics data
    csvContent += 'Metrics:\n'
    csvContent += 'Title,Value,Change,Trend\n'
    data.metrics.forEach(metric => {
      csvContent += `${metric.title},${metric.value},${metric.change},${metric.trend}\n`
    })
    
    csvContent += '\nUsage Data:\n'
    csvContent += `API Calls,${data.usageData.apiCalls}\n`
    csvContent += `Comparisons,${data.usageData.comparisons}\n`
    csvContent += `Storage,${data.usageData.storage} MB\n`
    
    csvContent += `\nUser Plan,${data.userPlan}\n`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-data-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setIsExportOpen(false)
  }
  
  // Function to export data as PDF
  const exportToPDF = () => {
    const data = generateDashboardData()
    let pdfContent = `Dashboard Data Export\n\n`
    pdfContent += `Export Date: ${new Date(data.exportDate).toLocaleString()}\n\n`
    
    // Metrics data
    pdfContent += `Metrics:\n`
    data.metrics.forEach(metric => {
      pdfContent += `- ${metric.title}: ${metric.value} (${metric.change} ${metric.trend})\n`
    })
    
    pdfContent += `\nUsage Data:\n`
    pdfContent += `- API Calls: ${data.usageData.apiCalls}\n`
    pdfContent += `- Comparisons: ${data.usageData.comparisons}\n`
    pdfContent += `- Storage: ${data.usageData.storage.toFixed(2)} MB\n`
    
    pdfContent += `\nUser Plan: ${data.userPlan}\n`
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-data-${new Date().toISOString().slice(0, 10)}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setIsExportOpen(false)
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
          storage: 10 * 1024 // Convert GB to MB (10 GB = 10240 MB)
        }
      case 'pro_plus':
        return {
          apiCalls: 10000,
          comparisons: Infinity, // unlimited
          storage: 100 * 1024 // Convert GB to MB (100 GB = 102400 MB)
        }
      default: // free plan
        return {
          apiCalls: 100,
          comparisons: 10,
          storage: 50 // 50 MB for free plan
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
        ? 'bg-black' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <SharedSidebar />
      
      {/* Adjusted layout to match chat interface with flex and responsive margins */}
      <div className="lg:ml-80 ml-16 transition-all duration-300">
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
                  Welcome back, <span className="font-semibold">{user?.id}</span> — {user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'User')}!
                </p>
                {!hasUsedModels && (
                  <p className={`mt-2 text-sm transition-colors duration-200 ${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Start using AI models to see dashboard metrics and analytics
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <NotificationBell />
                
                {/* Simple Profile Icon */}
                <SimpleProfileIcon />

                
                
                {/* Export Dropdown - Icon Only */}
                <div className="relative">
                  <button 
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    className={`p-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                      darkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white'
                    }`}
                    title="Export"
                  >
                    <Download className="w-4 h-4" />
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
                          onClick={exportToJSON}
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
                          onClick={exportToCSV}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center justify-between ${
                            darkMode 
                              ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                              : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                          }`}>
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
                          onClick={exportToPDF}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center justify-between ${
                            darkMode 
                              ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                              : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                          }`}>
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
              Resource Usage Overview
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
                  API Calls to Compare Models
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
                  Model Comparisons Performed
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

              {/* Avg Responses per Comparison */}
              <div className={`rounded-2xl p-6 transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${
                    darkMode 
                      ? 'from-indigo-600 to-purple-600 text-white' 
                      : 'from-indigo-500 to-purple-500 text-white'
                  }`}>
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Average
                    </p>
                    <p className={`text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {avgResponsesPerComparison}
                    </p>
                  </div>
                </div>
                
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Avg Responses per Comparison
                </h3>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  Average number of model responses generated per comparison
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className={darkMode ? 'text-xl font-bold text-white' : 'text-xl font-bold text-slate-900'}>AI Fiesta Analytics</h2>
            {uniqueModelCount > 1 ? (
              <button
                onClick={() => setShowAllGraphs(!showAllGraphs)}
                className={darkMode ? 'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-200 hover:bg-gray-700' : 'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                {showAllGraphs ? 'Hide' : 'View All'}
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart 
              data={responseTimeData} 
              title="Model Latency Comparison" 
              unit="s"
            />
            <SimpleCircleChart 
              data={messagesTypedData} 
              title="Prompts per Model" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart 
              data={modelDataTimeData} 
              title="Throughput by Model" 
              unit="s"
            />
            {showAllGraphs && (
              <LineChart 
                data={lineChartData} 
                title="Latency Trends Over Time" 
                metrics={lineChartMetrics}
                metricLabels={lineChartMetricLabels}
              />
            )}
          </div>

          {showAllGraphs && (
            <div className="grid grid-cols-1 gap-6">
              <ResponseTimeDistribution 
                data={responseTimeDistributionData} 
                title="Latency Distribution" 
                unit="s"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to get color classes for metrics
const getMetricColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return 'from-blue-500 to-blue-600 text-white'
    case 'purple':
      return 'from-purple-500 to-purple-600 text-white'
    case 'green':
      return 'from-green-500 to-green-600 text-white'
    case 'orange':
      return 'from-orange-500 to-orange-600 text-white'
    default:
      return 'from-gray-500 to-gray-600 text-white'
  }
}