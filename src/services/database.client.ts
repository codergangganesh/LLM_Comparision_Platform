// Mock database client service for demonstration purposes

export const databaseClientService = {
  getTotalComparisonsCount: async (): Promise<number> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    // Return mock data
    return 24
  },

  getModelsAnalyzedCount: async (): Promise<number> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    // Return mock data
    return 8
  },

  getAverageAccuracyScore: async (): Promise<number> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    // Return mock data
    return 92
  },

  getApiUsagePercentage: async (): Promise<number> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    // Return mock data
    return 45
  },

  getModelComparisonData: async (): Promise<Array<{
    modelName: string
    responseTime: number
    messagesTyped: number
    modelDataTime: number
    responseTimeDistribution: number[]
  }>> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    // Return mock data
    return [
      {
        modelName: 'GPT-4',
        responseTime: 2.3,
        messagesTyped: 12,
        modelDataTime: 0.4,
        responseTimeDistribution: [2.1, 2.3, 2.5, 2.2, 2.4]
      },
      {
        modelName: 'Claude-3',
        responseTime: 1.8,
        messagesTyped: 8,
        modelDataTime: 0.3,
        responseTimeDistribution: [1.7, 1.8, 1.9, 1.7, 1.9]
      },
      {
        modelName: 'LLaMA-3',
        responseTime: 3.1,
        messagesTyped: 15,
        modelDataTime: 0.7,
        responseTimeDistribution: [3.0, 3.1, 3.2, 3.0, 3.3]
      },
      {
        modelName: 'Qwen-2.5',
        responseTime: 2.7,
        messagesTyped: 10,
        modelDataTime: 0.5,
        responseTimeDistribution: [2.6, 2.7, 2.8, 2.5, 2.9]
      },
      {
        modelName: 'DeepSeek',
        responseTime: 3.5,
        messagesTyped: 18,
        modelDataTime: 0.8,
        responseTimeDistribution: [3.4, 3.5, 3.6, 3.3, 3.7]
      }
    ]
  },

  getResponseTimeTrends: async (): Promise<Array<{
    period: string
    modelName: string
    responseTime: number
    messagesTyped: number
    modelDataTime: number
  }>> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    // Return mock data
    return [
      { period: '2025-09-15', modelName: 'GPT-4', responseTime: 2.3, messagesTyped: 12, modelDataTime: 0.4 },
      { period: '2025-09-15', modelName: 'Claude-3', responseTime: 1.8, messagesTyped: 8, modelDataTime: 0.3 },
      { period: '2025-09-15', modelName: 'LLaMA-3', responseTime: 3.1, messagesTyped: 15, modelDataTime: 0.7 },
      { period: '2025-09-15', modelName: 'Qwen-2.5', responseTime: 2.7, messagesTyped: 10, modelDataTime: 0.5 },
      { period: '2025-09-15', modelName: 'DeepSeek', responseTime: 3.5, messagesTyped: 18, modelDataTime: 0.8 },
      { period: '2025-09-16', modelName: 'GPT-4', responseTime: 2.1, messagesTyped: 12, modelDataTime: 0.4 },
      { period: '2025-09-16', modelName: 'Claude-3', responseTime: 1.9, messagesTyped: 8, modelDataTime: 0.3 },
      { period: '2025-09-16', modelName: 'LLaMA-3', responseTime: 3.2, messagesTyped: 15, modelDataTime: 0.7 },
      { period: '2025-09-16', modelName: 'Qwen-2.5', responseTime: 2.6, messagesTyped: 10, modelDataTime: 0.5 },
      { period: '2025-09-16', modelName: 'DeepSeek', responseTime: 3.4, messagesTyped: 18, modelDataTime: 0.8 }
    ]
  }
}