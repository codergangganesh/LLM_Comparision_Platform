'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import SharedSidebar from '@/components/layout/SharedSidebar'
import BarChart from '@/components/dashboard/BarChart'
import LineChart from '@/components/dashboard/LineChart'
import DonutChart from '@/components/dashboard/DonutChart'
import SimpleCircleChart from '@/components/dashboard/SimpleCircleChart'
import ResponseTimeDistribution from '@/components/dashboard/ResponseTimeDistribution'
import { useOptimizedRouter } from '@/hooks/useOptimizedRouter'
import OptimizedPageTransitionLoader from '@/components/ui/OptimizedPageTransitionLoader'
import { useOptimizedLoading } from '@/contexts/OptimizedLoadingContext'
import { dashboardService, DashboardMetrics, UsageData, ModelUsageData, TimeSeriesData } from '@/services/dashboard.service'
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
  Filter
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
  
  const [usageData, setUsageData] = useState<UsageData>({
    apiCalls: 0,
    comparisons: 0,
    storage: 0
  })
  
  const [responseTimeData, setResponseTimeData] = useState<ModelUsageData[]>([])
  const [messagesTypedData, setMessagesTypedData] = useState<ModelUsageData[]>([])
  const [modelDataTimeData, setModelDataTimeData] = useState<ModelUsageData[]>([])
  const [responseTimeDistributionData, setResponseTimeDistributionData] = useState<ModelUsageData[]>([])
  const [lineChartData, setLineChartData] = useState<TimeSeriesData[]>([])
  const [lineChartMetrics, setLineChartMetrics] = useState<string[]>([])
  const [lineChartMetricLabels, setLineChartMetricLabels] = useState<Record<string, string>>({})
  const [userPlan] = useState('free')
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [availableModels, setAvailableModels] = useState<any[]>([])
  
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

  // Filter sessions based on selected models
  const filterSessionsByModels = (sessions: ChatSession[], models: string[]): ChatSession[] => {
    if (models.length === 0) return sessions
    return sessions.filter(session => 
      session.selectedModels?.some(model => models.includes(model))
    )
  }

  // Function to update dashboard data
  const updateDashboardData = async (fetchedSessions: ChatSession[]) => {
    if (fetchedSessions) {
      // Filter sessions based on selected models
      const filteredSessions = filterSessionsByModels(fetchedSessions, selectedModels)
      setSessions(filteredSessions)
      
      // Calculate metrics - use cumulative values for cards
      const dashboardMetrics = dashboardService.calculateDashboardMetrics(filteredSessions)
      
      // Preserve cumulative metrics for display in cards
      // This ensures that even when sessions are deleted, the numerical cards retain their values
      const cumulativeMetrics = dashboardService.getCumulativeMetrics()
      setMetrics([
        {
          title: 'Total Comparisons',
          value: cumulativeMetrics.totalComparisons.toString(),
          change: '+12.5%',
          trend: 'up',
          icon: GitCompare,
          color: 'blue'
        },
        {
          title: 'Models Analyzed',
          value: cumulativeMetrics.modelsAnalyzed.toString(),
          change: '+8.2%',
          trend: 'up',
          icon: Brain,
          color: 'purple'
        },
        {
          title: 'Accuracy Score',
          value: `${cumulativeMetrics.accuracyScore}%`,
          change: '+2.1%',
          trend: 'up',
          icon: TrendingUp,
          color: 'green'
        },
        {
          title: 'API Usage',
          value: `${cumulativeMetrics.apiUsage}%`,
          change: '-5.4%',
          trend: 'down',
          icon: Activity,
          color: 'orange'
        }
      ])
      
      // Calculate usage data - use cumulative values for cards
      const usage = dashboardService.getUsageData(filteredSessions)
      
      // Preserve cumulative usage data for display in cards
      // This ensures that even when sessions are deleted, the numerical cards retain their values
      const cumulativeUsage = dashboardService.getCumulativeUsageData()
      setUsageData(cumulativeUsage)
      
      // For charts, use current session data (will show empty when sessions are deleted)
      // Charts should reflect current state, not cumulative data
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
  }

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || loading) return
      
      setLoadingData(true)
      try {
        // Fetch chat sessions
        const fetchedSessions = await dashboardService.getChatSessions()
        await updateDashboardData(fetchedSessions || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoadingData(false)
      }
    }
    
    fetchData()
  }, [user, loading, selectedModels])

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
          const fetchedSessions = await dashboardService.getChatSessions(false)
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
          const fetchedSessions = await dashboardService.getChatSessions(false)
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
          // IMPORTANT: When sessions are deleted, we want to preserve cumulative metrics
          // but update the charts to show "No data available"
          dashboardService.clearCache()
          const fetchedSessions = await dashboardService.getChatSessions(false)
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
  }, [user, loading, selectedModels])

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

  // Toggle model selection
  const toggleModelSelection = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(id => id !== modelId))
    } else {
      setSelectedModels([...selectedModels, modelId])
    }
  }

  // Select all models
  const selectAllModels = () => {
    setSelectedModels(availableModels.map(model => model.id))
  }

  // Clear all model selections
  const clearAllModels = () => {
    setSelectedModels([])
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
                  Welcome back! Here's your AI platform overview.
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <NotificationBell />
                
                {/* Simple Profile Icon */}
                <SimpleProfileIcon />
                
                {/* Filter Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                      darkMode 
                        ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600' 
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border border-gray-300'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">Filter</span>
                  </button>
                  
                  {/* Dropdown menu for model filtering */}
                  {isFilterOpen && (
                    <div 
                      className={`absolute right-0 w-80 rounded-xl shadow-xl z-20 overflow-hidden transform transition-all duration-200 ease-in-out mt-2 ${
                        darkMode 
                          ? 'bg-gray-800/95 border border-gray-700 backdrop-blur-xl' 
                          : 'bg-white/95 border border-slate-200 backdrop-blur-xl'
                      }`}
                    >
                      <div className="py-3">
                        <div className={`px-4 py-3 border-b ${
                          darkMode ? 'border-gray-700' : 'border-slate-200'
                        }`}>
                          <div className="flex justify-between items-center">
                            <h3 className={`text-sm font-semibold ${
                              darkMode ? 'text-gray-200' : 'text-slate-800'
                            }`}>
                              Filter by Models
                            </h3>
                            <div className="flex space-x-2">
                              <button 
                                onClick={selectAllModels}
                                className={`text-xs px-2 py-1 rounded ${
                                  darkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                Select All
                              </button>
                              <button 
                                onClick={clearAllModels}
                                className={`text-xs px-2 py-1 rounded ${
                                  darkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {availableModels.map((model) => (
                            <div 
                              key={model.id}
                              className={`px-4 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                                darkMode 
                                  ? 'hover:bg-gray-700/50' 
                                  : 'hover:bg-slate-100'
                              } ${
                                selectedModels.includes(model.id) 
                                  ? darkMode 
                                    ? 'bg-blue-900/30' 
                                    : 'bg-blue-100'
                                  : ''
                              }`}
                              onClick={() => toggleModelSelection(model.id)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  selectedModels.includes(model.id) 
                                    ? 'bg-blue-500' 
                                    : darkMode 
                                      ? 'bg-gray-500' 
                                      : 'bg-gray-400'
                                }`}></div>
                                <span className={`text-sm ${
                                  darkMode 
                                    ? selectedModels.includes(model.id) 
                                      ? 'text-white font-medium' 
                                      : 'text-gray-300'
                                    : selectedModels.includes(model.id) 
                                      ? 'text-gray-900 font-medium' 
                                      : 'text-gray-700'
                                }`}>
                                  {model.displayName}
                                </span>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded ${
                                darkMode 
                                  ? 'bg-gray-700 text-gray-400' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {model.provider}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className={`px-4 py-3 border-t ${
                          darkMode ? 'border-gray-700' : 'border-slate-200'
                        }`}>
                          <div className="text-xs text-center">
                            {selectedModels.length > 0 
                              ? `${selectedModels.length} model${selectedModels.length > 1 ? 's' : ''} selected` 
                              : 'No models selected (showing all)'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
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
                          onClick={exportToPDF}
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
                      {usageData.storage.toFixed(2)} MB
                    </p>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-500' : 'text-slate-500'
                    }`}>
                      used
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
                      width: `${Math.min(100, (usageData.storage / getPlanLimits(userPlan).storage) * 100)}%` 
                    }}
                  ></div>
                </div>
                
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  {Math.min(100, (usageData.storage / getPlanLimits(userPlan).storage) * 100).toFixed(1)}% of {getPlanLimits(userPlan).storage} MB used
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
            <SimpleCircleChart 
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

const getMetricColorClasses = (color: string) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600 text-white',
    purple: 'from-purple-500 to-purple-600 text-white',
    green: 'from-green-500 to-green-600 text-white',
    orange: 'from-orange-500 to-orange-600 text-white'
  }
  return colors[color as keyof typeof colors] || colors.blue
}