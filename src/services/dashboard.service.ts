import { ChatSession } from '../types/chat'
import { AiModel, AVAILABLE_MODELS } from '../lib/models'
import { DashboardMetrics, UsageData, ModelUsageData, TimeSeriesData } from '../types/dashboard'

// Predefined distinct colors for consistent model coloring
const DISTINCT_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#06B6D4', // cyan-500
  '#8B5CF6', // violet-500
  '#F97316', // orange-500
  '#6366F1', // indigo-500
]

export class DashboardService {
  private modelColorMap: Map<string, string> = new Map()
  private cumulativeMetrics: DashboardMetrics = {
    totalComparisons: 0,
    modelsAnalyzed: 0,
    accuracyScore: 0,
    apiUsage: 0
  }
  private cumulativeUsageData: UsageData = {
    apiCalls: 0,
    comparisons: 0,
    storage: 0
  }

  // Cache for computed data
  private cache: Map<string, DashboardMetrics | UsageData | ModelUsageData[] | TimeSeriesData[] | string[]> = new Map()
  private cacheTimeouts: Map<string, NodeJS.Timeout> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.loadCumulativeMetricsFromStorage()
  }

  // Load cumulative metrics from localStorage
  private loadCumulativeMetricsFromStorage() {
    if (typeof window !== 'undefined') {
      const savedMetrics = localStorage.getItem('aiFiestaDashboardMetrics')
      const savedUsage = localStorage.getItem('aiFiestaUsageData')
      
      if (savedMetrics) {
        try {
          this.cumulativeMetrics = JSON.parse(savedMetrics)
        } catch (e) {
          console.error('Failed to parse saved dashboard metrics:', e)
        }
      }
      
      if (savedUsage) {
        try {
          this.cumulativeUsageData = JSON.parse(savedUsage)
        } catch (e) {
          console.error('Failed to parse saved usage data:', e)
        }
      }
    }
  }

  // Save cumulative metrics to localStorage
  private saveCumulativeMetricsToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiFiestaDashboardMetrics', JSON.stringify(this.cumulativeMetrics))
      localStorage.setItem('aiFiestaUsageData', JSON.stringify(this.cumulativeUsageData))
    }
  }

  // Reset cumulative metrics (used when account is deleted)
  resetCumulativeMetrics() {
    this.cumulativeMetrics = {
      totalComparisons: 0,
      modelsAnalyzed: 0,
      accuracyScore: 0,
      apiUsage: 0
    }
    this.cumulativeUsageData = {
      apiCalls: 0,
      comparisons: 0,
      storage: 0
    }
    this.saveCumulativeMetricsToStorage()
  }

  // Assign a consistent color to each model
  private assignModelColor(modelId: string): string {
    // Check if we already have a color for this model
    if (this.modelColorMap.has(modelId)) {
      return this.modelColorMap.get(modelId)!
    }
    
    // Otherwise, assign a new color from our palette
    const colorIndex = this.modelColorMap.size % DISTINCT_COLORS.length
    const color = DISTINCT_COLORS[colorIndex]
    this.modelColorMap.set(modelId, color)
    return color
  }

  // Calculate dashboard metrics based on chat sessions
  calculateDashboardMetrics(sessions: ChatSession[]): DashboardMetrics {
    const cacheKey = `dashboardMetrics_${sessions.length}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as DashboardMetrics
    }
    
    const totalComparisons = sessions.length
    const allSelectedModels = sessions.flatMap(session => session.selectedModels || [])
    const uniqueModels = Array.from(new Set(allSelectedModels)).length
    const totalResponses = sessions.reduce((sum, session) => sum + (session.responses?.length || 0), 0)
    const accuracyScore = totalResponses > 0 ? Math.min(100, Math.round((totalComparisons / totalResponses) * 100)) : 0
    const apiUsage = Math.min(100, Math.round((totalComparisons / 100) * 100)) // Placeholder calculation

    // Update cumulative metrics
    this.cumulativeMetrics = {
      totalComparisons: Math.max(this.cumulativeMetrics.totalComparisons, totalComparisons),
      modelsAnalyzed: Math.max(this.cumulativeMetrics.modelsAnalyzed, uniqueModels),
      accuracyScore: Math.max(this.cumulativeMetrics.accuracyScore, accuracyScore),
      apiUsage: Math.max(this.cumulativeMetrics.apiUsage, apiUsage)
    }

    // Save to localStorage
    this.saveCumulativeMetricsToStorage()

    const result = { ...this.cumulativeMetrics }
    
    // Cache the result
    this.cache.set(cacheKey, result)
    const timeout = setTimeout(() => {
      this.cache.delete(cacheKey)
      this.cacheTimeouts.delete(cacheKey)
    }, this.CACHE_DURATION)
    this.cacheTimeouts.set(cacheKey, timeout)
    
    return result
  }

  // Get usage data for the user
  getUsageData(sessions: ChatSession[]): UsageData {
    const cacheKey = `usageData_${sessions.length}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as UsageData
    }
    
    const apiCalls = sessions.length
    const comparisons = sessions.length
    
    // Calculate actual storage usage based on the size of data in chat_sessions
    let totalStorageBytes = 0
    
    sessions.forEach(session => {
      // Add size of message
      totalStorageBytes += new Blob([session.message || '']).size
      
      // Add size of responses
      if (session.responses) {
        try {
          const responsesString = JSON.stringify(session.responses)
          totalStorageBytes += new Blob([responsesString]).size
        } catch (e) {
          // If JSON stringify fails, estimate size differently
          totalStorageBytes += session.responses.length * 100 // rough estimate
        }
      }
      
      // Add size of other fields
      totalStorageBytes += new Blob([session.id || '']).size
      totalStorageBytes += new Blob([session.bestResponse || '']).size
      totalStorageBytes += 4 // Approximate size of response_time (float)
      totalStorageBytes += 8 // Approximate size of timestamp (datetime)
      
      // Add size of selected_models array
      if (session.selectedModels) {
        session.selectedModels.forEach(model => {
          totalStorageBytes += new Blob([model]).size
        })
      }
    })
    
    // Convert bytes to MB
    const storageMB = totalStorageBytes / (1024 * 1024)

    // Update cumulative usage data for apiCalls and comparisons (these should be cumulative)
    this.cumulativeUsageData = {
      apiCalls: Math.max(this.cumulativeUsageData.apiCalls, apiCalls),
      comparisons: Math.max(this.cumulativeUsageData.comparisons, comparisons),
      storage: storageMB // Storage should reflect current usage, not cumulative
    }

    // Save to localStorage
    this.saveCumulativeMetricsToStorage()

    const result = { ...this.cumulativeUsageData }
    
    // Cache the result
    this.cache.set(cacheKey, result)
    const timeout = setTimeout(() => {
      this.cache.delete(cacheKey)
      this.cacheTimeouts.delete(cacheKey)
    }, this.CACHE_DURATION)
    this.cacheTimeouts.set(cacheKey, timeout)
    
    return result
  }

  // Get response time data by model
  getResponseTimeData(sessions: ChatSession[]): ModelUsageData[] {
    const cacheKey = `responseTimeData_${sessions.length}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as ModelUsageData[]
    }
    
    // Group response times by model
    const modelResponseTimes: Record<string, number[]> = {}
    
    sessions.forEach(session => {
      if (session.responseTime && session.selectedModels) {
        // Distribute response time across selected models (simplified)
        const timePerModel = session.responseTime / session.selectedModels.length
        session.selectedModels.forEach(modelId => {
          if (!modelResponseTimes[modelId]) {
            modelResponseTimes[modelId] = []
          }
          modelResponseTimes[modelId].push(timePerModel)
        })
      }
    })
    
    // Calculate average response time per model
    const modelData: ModelUsageData[] = []
    Object.entries(modelResponseTimes).forEach(([modelId, times]) => {
      const model = AVAILABLE_MODELS.find((m: AiModel) => m.id === modelId)
      const avgTime = times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0
      if (avgTime > 0) {
        modelData.push({
          name: model?.label || modelId,
          value: parseFloat(avgTime.toFixed(2)),
          color: this.assignModelColor(modelId)
        })
      }
    })
    
    const result = modelData.sort((a, b) => a.value - b.value)
    
    // Cache the result
    this.cache.set(cacheKey, result)
    const timeout = setTimeout(() => {
      this.cache.delete(cacheKey)
      this.cacheTimeouts.delete(cacheKey)
    }, this.CACHE_DURATION)
    this.cacheTimeouts.set(cacheKey, timeout)
    
    return result
  }

  // Get messages typed per model
  getMessagesTypedData(sessions: ChatSession[]): ModelUsageData[] {
    const cacheKey = `messagesTypedData_${sessions.length}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as ModelUsageData[]
    }
    
    const modelMessageCounts: Record<string, number> = {}
    
    sessions.forEach(session => {
      if (session.selectedModels) {
        session.selectedModels.forEach(modelId => {
          modelMessageCounts[modelId] = (modelMessageCounts[modelId] || 0) + 1
        })
      }
    })
    
    const modelData: ModelUsageData[] = []
    Object.entries(modelMessageCounts).forEach(([modelId, count]) => {
      const model = AVAILABLE_MODELS.find((m: AiModel) => m.id === modelId)
      modelData.push({
        name: model?.label || modelId,
        value: count,
        color: this.assignModelColor(modelId)
      })
    })
    
    // Sort by count descending
    const result = modelData.sort((a, b) => b.value - a.value)
    
    // Cache the result
    this.cache.set(cacheKey, result)
    const timeout = setTimeout(() => {
      this.cache.delete(cacheKey)
      this.cacheTimeouts.delete(cacheKey)
    }, this.CACHE_DURATION)
    this.cacheTimeouts.set(cacheKey, timeout)
    
    return result
  }

  // Get model data processing time
  getModelDataTimeData(sessions: ChatSession[]): ModelUsageData[] {
    const cacheKey = `modelDataTimeData_${sessions.length}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as ModelUsageData[]
    }
    
    // This is a simplified calculation - in a real app, this would be more complex
    const modelData: ModelUsageData[] = []
    const modelCounts: Record<string, number> = {}
    
    sessions.forEach(session => {
      if (session.selectedModels) {
        session.selectedModels.forEach(modelId => {
          modelCounts[modelId] = (modelCounts[modelId] || 0) + 1
        })
      }
    })
    
    Object.entries(modelCounts).forEach(([modelId, count]) => {
      const model = AVAILABLE_MODELS.find((m: AiModel) => m.id === modelId)
      // Simulate processing time based on usage (more usage = more efficient = less time)
      const processingTime = Math.max(0.1, 1.0 - (count * 0.05))
      modelData.push({
        name: model?.label || modelId,
        value: parseFloat(processingTime.toFixed(2)),
        color: this.assignModelColor(modelId)
      })
    })
    
    const result = modelData.sort((a, b) => a.value - b.value)
    
    // Cache the result
    this.cache.set(cacheKey, result)
    const timeout = setTimeout(() => {
      this.cache.delete(cacheKey)
      this.cacheTimeouts.delete(cacheKey)
    }, this.CACHE_DURATION)
    this.cacheTimeouts.set(cacheKey, timeout)
    
    return result
  }

  // Get response time distribution data
  getResponseTimeDistributionData(sessions: ChatSession[]): ModelUsageData[] {
    return this.getResponseTimeData(sessions)
  }

  // Get line chart data for response time trends over time
  getLineChartData(sessions: ChatSession[]): TimeSeriesData[] {
    const cacheKey = `lineChartData_${sessions.length}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as TimeSeriesData[]
    }
    
    // Group sessions by date
    const sessionsByDate: Record<string, ChatSession[]> = {}
    
    sessions.forEach(session => {
      const date = new Date(session.timestamp).toISOString().split('T')[0]
      if (!sessionsByDate[date]) {
        sessionsByDate[date] = []
      }
      sessionsByDate[date].push(session)
    })
    
    // Convert to time series data
    const lineData: TimeSeriesData[] = []
    Object.entries(sessionsByDate).forEach(([date, dateSessions]) => {
      const dataPoint: TimeSeriesData = { period: date }
      
      // Calculate average response time per model for this date
      const modelResponseTimes: Record<string, number[]> = {}
      dateSessions.forEach(session => {
        if (session.responseTime && session.selectedModels) {
          const timePerModel = session.responseTime / session.selectedModels.length
          session.selectedModels.forEach(modelId => {
            if (!modelResponseTimes[modelId]) {
              modelResponseTimes[modelId] = []
            }
            modelResponseTimes[modelId].push(timePerModel)
          })
        }
      })
      
      // Add average response time for each model
      Object.entries(modelResponseTimes).forEach(([modelId, times]) => {
        const model = AVAILABLE_MODELS.find((m: AiModel) => m.id === modelId)
        const displayName = model?.label || modelId
        const avgTime = times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0
        if (avgTime > 0) {
          dataPoint[displayName] = parseFloat(avgTime.toFixed(2))
        }
      })
      
      lineData.push(dataPoint)
    })
    
    // Sort by date
    const result = lineData.sort((a, b) => a.period.localeCompare(b.period))
    
    // Cache the result
    this.cache.set(cacheKey, result)
    const timeout = setTimeout(() => {
      this.cache.delete(cacheKey)
      this.cacheTimeouts.delete(cacheKey)
    }, this.CACHE_DURATION)
    this.cacheTimeouts.set(cacheKey, timeout)
    
    return result
  }

  // Get metrics for line chart
  getLineChartMetrics(sessions: ChatSession[]): string[] {
    const cacheKey = `lineChartMetrics_${sessions.length}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as string[]
    }
    
    const allModels = new Set<string>()
    sessions.forEach(session => {
      if (session.selectedModels) {
        session.selectedModels.forEach(modelId => {
          const model = AVAILABLE_MODELS.find((m: AiModel) => m.id === modelId)
          if (model) {
            allModels.add(model.label)
          }
        })
      }
    })
    const result = Array.from(allModels)
    
    // Cache the result
    this.cache.set(cacheKey, result as string[])
    const timeout = setTimeout(() => {
      this.cache.delete(cacheKey)
      this.cacheTimeouts.delete(cacheKey)
    }, this.CACHE_DURATION)
    this.cacheTimeouts.set(cacheKey, timeout)
    
    return result
  }

  // Get model color based on model ID for consistent coloring
  getModelColor(modelId: string): string {
    return this.assignModelColor(modelId)
  }
  
  // Get current cumulative metrics
  getCumulativeMetrics(): DashboardMetrics {
    return { ...this.cumulativeMetrics }
  }
  
  // Get current cumulative usage data
  getCumulativeUsageData(): UsageData {
    return { ...this.cumulativeUsageData }
  }
  
  // Clear all cache
  clearCache() {
    this.cache.clear()
    this.cacheTimeouts.forEach(timeout => clearTimeout(timeout))
    this.cacheTimeouts.clear()
  }
}

export const dashboardService = new DashboardService()