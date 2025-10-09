'use client'

import { ChatSession, ChatResponse } from '@/types/chat'
import { createClient } from '@/utils/supabase/client'
import { AI_MODELS } from '@/config/ai-models'

export interface DashboardMetrics {
  totalComparisons: number
  modelsAnalyzed: number
  accuracyScore: number
  apiUsage: number
}

export interface ModelUsageData {
  name: string
  value: number
  color: string
}

export interface UsageData {
  apiCalls: number
  comparisons: number
  storage: number
}

export interface TimeSeriesData {
  period: string
  [key: string]: string | number
}

// Predefined distinct colors for models
const DISTINCT_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#A855F7', // Violet
  '#0EA5E9', // Sky
  '#8B5CF6', // Purple
  '#22C55E', // Emerald
  '#EAB308', // Yellow
  '#F43F5E', // Rose
  '#0D9488', // Emerald
  '#C026D3', // Fuchsia
  '#4F46E5', // Indigo
  '#DC2626'  // Red
]

export class DashboardService {
  private chatSessionsCache: ChatSession[] | null = null
  private lastFetchTime: number | null = null
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache
  private modelColorMap: Map<string, string> = new Map()
  
  // Cumulative metrics to preserve even when chat history is deleted
  private cumulativeMetrics: DashboardMetrics = {
    totalComparisons: 0,
    modelsAnalyzed: 0,
    accuracyScore: 0,
    apiUsage: 0
  }
  
  // Cumulative usage data
  private cumulativeUsageData: UsageData = {
    apiCalls: 0,
    comparisons: 0,
    storage: 0
  }

  constructor() {
    // Load cumulative metrics from localStorage on initialization
    this.loadCumulativeMetricsFromStorage()
  }

  // Load cumulative metrics from localStorage
  private loadCumulativeMetricsFromStorage() {
    try {
      const savedCumulativeMetrics = localStorage.getItem('aiFiestaCumulativeMetrics')
      const savedCumulativeUsageData = localStorage.getItem('aiFiestaCumulativeUsageData')
      
      if (savedCumulativeMetrics) {
        this.cumulativeMetrics = JSON.parse(savedCumulativeMetrics)
      }
      
      if (savedCumulativeUsageData) {
        this.cumulativeUsageData = JSON.parse(savedCumulativeUsageData)
      }
    } catch (error) {
      console.error('Error loading cumulative metrics from localStorage:', error)
    }
  }

  // Save cumulative metrics to localStorage
  private saveCumulativeMetricsToStorage() {
    try {
      localStorage.setItem('aiFiestaCumulativeMetrics', JSON.stringify(this.cumulativeMetrics))
      localStorage.setItem('aiFiestaCumulativeUsageData', JSON.stringify(this.cumulativeUsageData))
    } catch (error) {
      console.error('Error saving cumulative metrics to localStorage:', error)
    }
  }

  async getChatSessions(useCache = true): Promise<ChatSession[] | null> {
    try {
      // Check if we have valid cached data
      const now = Date.now()
      if (useCache && this.chatSessionsCache && this.lastFetchTime && (now - this.lastFetchTime) < this.CACHE_DURATION) {
        return this.chatSessionsCache
      }

      const supabase = createClient()
      
      // Check if user is authenticated
      const { data: { session: userSession }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !userSession) {
        console.error('Error fetching chat sessions - No valid session:', sessionError?.message || 'No session found')
        return null
      }
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('id, message, timestamp, selected_models, responses, best_response, response_time')
        .eq('user_id', userSession.user.id)
        .order('timestamp', { ascending: false })
      
      if (error) {
        console.error('Error fetching chat sessions:', error)
        return null
      }
      
      const chatSessions: ChatSession[] = data.map((session: any) => ({
        id: session.id,
        message: session.message,
        responses: session.responses,
        timestamp: new Date(session.timestamp),
        selectedModels: session.selected_models,
        bestResponse: session.best_response,
        responseTime: session.response_time
      }))
      
      // Update cache
      this.chatSessionsCache = chatSessions
      this.lastFetchTime = now
      
      return chatSessions
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
      return null
    }
  }

  // Method to clear cache
  clearCache() {
    this.chatSessionsCache = null
    this.lastFetchTime = null
  }

  // Method to reset cumulative metrics (used when user wants to reset all data or deletes account)
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
    
    // Also clear localStorage
    try {
      localStorage.removeItem('aiFiestaCumulativeMetrics')
      localStorage.removeItem('aiFiestaCumulativeUsageData')
    } catch (error) {
      console.error('Error clearing cumulative metrics from localStorage:', error)
    }
  }

  // Method to preserve cumulative metrics when chat history is deleted
  // This ensures that dashboard cards retain their values even when individual sessions are deleted
  preserveCumulativeMetricsOnSessionDeletion() {
    // Do nothing - cumulative metrics are already preserved
    // This method exists to make the intent clear in the code
  }

  // Assign a distinct color to each model
  assignModelColor(modelId: string): string {
    // If we already have a color for this model, return it
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

    return { ...this.cumulativeMetrics }
  }

  // Get usage data for the user
  getUsageData(sessions: ChatSession[]): UsageData {
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

    return { ...this.cumulativeUsageData }
  }

  // Get response time data by model
  getResponseTimeData(sessions: ChatSession[]): ModelUsageData[] {
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
      const model = AI_MODELS.find(m => m.id === modelId)
      const avgTime = times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0
      if (avgTime > 0) {
        modelData.push({
          name: model?.displayName || modelId,
          value: parseFloat(avgTime.toFixed(2)),
          color: this.assignModelColor(modelId)
        })
      }
    })
    
    return modelData.sort((a, b) => a.value - b.value)
  }

  // Get messages typed per model
  getMessagesTypedData(sessions: ChatSession[]): ModelUsageData[] {
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
      const model = AI_MODELS.find(m => m.id === modelId)
      modelData.push({
        name: model?.displayName || modelId,
        value: count,
        color: this.assignModelColor(modelId)
      })
    })
    
    // Sort by count descending
    return modelData.sort((a, b) => b.value - a.value)
  }

  // Get model data processing time
  getModelDataTimeData(sessions: ChatSession[]): ModelUsageData[] {
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
      const model = AI_MODELS.find(m => m.id === modelId)
      // Simulate processing time based on usage (more usage = more efficient = less time)
      const processingTime = Math.max(0.1, 1.0 - (count * 0.05))
      modelData.push({
        name: model?.displayName || modelId,
        value: parseFloat(processingTime.toFixed(2)),
        color: this.assignModelColor(modelId)
      })
    })
    
    return modelData.sort((a, b) => a.value - b.value)
  }

  // Get response time distribution data
  getResponseTimeDistributionData(sessions: ChatSession[]): ModelUsageData[] {
    return this.getResponseTimeData(sessions)
  }

  // Get line chart data for response time trends over time
  getLineChartData(sessions: ChatSession[]): TimeSeriesData[] {
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
        const model = AI_MODELS.find(m => m.id === modelId)
        const displayName = model?.displayName || modelId
        const avgTime = times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0
        if (avgTime > 0) {
          dataPoint[displayName] = parseFloat(avgTime.toFixed(2))
        }
      })
      
      lineData.push(dataPoint)
    })
    
    // Sort by date
    return lineData.sort((a, b) => a.period.localeCompare(b.period))
  }

  // Get metrics for line chart
  getLineChartMetrics(sessions: ChatSession[]): string[] {
    const allModels = new Set<string>()
    sessions.forEach(session => {
      if (session.selectedModels) {
        session.selectedModels.forEach(modelId => {
          const model = AI_MODELS.find(m => m.id === modelId)
          if (model) {
            allModels.add(model.displayName)
          }
        })
      }
    })
    return Array.from(allModels)
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
}

export const dashboardService = new DashboardService()