export interface DashboardMetrics {
  totalComparisons: number
  modelsAnalyzed: number
  accuracyScore: number
  apiUsage: number
}

export interface UsageData {
  apiCalls: number
  comparisons: number
  storage: number
}

export interface ModelUsageData {
  name: string
  value: number
  color: string
}

export interface TimeSeriesData {
  period: string
  [key: string]: string | number
}