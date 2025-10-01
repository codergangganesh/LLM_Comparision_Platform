export interface ChatResponse {
  model: string
  content: string
  error?: string
  success: boolean
  responseTime?: number
}

export interface ChatSession {
  id: string
  message: string
  responses: ChatResponse[]
  timestamp: Date
  selectedModels: string[]
  bestResponse?: string
  responseTime?: number
}