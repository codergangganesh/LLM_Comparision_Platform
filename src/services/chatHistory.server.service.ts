import { createClient } from '@/lib/supabase/server'
import { ChatSession } from '@/types/chat'
import { SupabaseClient } from '@supabase/supabase-js'

export interface DatabaseChatSession {
  id: string
  user_id: string
  message: string
  responses: unknown[]
  timestamp: string
  selected_models: string[]
  best_response?: string
  response_time?: number
  created_at: string
}

export class ChatHistoryServerService {
  async getSupabaseClient() {
    return await createClient()
  }

  async saveChatSession(session: ChatSession, userId: string): Promise<boolean> {
    try {
      const supabase = await this.getSupabaseClient()
      const { error } = await supabase.from('chat_sessions').insert({
        id: session.id,
        user_id: userId,
        message: session.message,
        responses: session.responses as unknown[],
        timestamp: session.timestamp.toISOString(),
        selected_models: session.selectedModels,
        best_response: session.bestResponse,
        response_time: session.responseTime,
        created_at: new Date().toISOString()
      } as DatabaseChatSession)

      if (error) {
        console.error('Error saving chat session:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error saving chat session:', error)
      return false
    }
  }

  async getChatSessions(userId: string): Promise<ChatSession[] | null> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Error fetching chat sessions:', error)
        return null
      }

      // Convert database format to ChatSession format
      return (data as DatabaseChatSession[]).map(session => ({
        id: session.id,
        message: session.message,
        responses: session.responses as ChatSession['responses'],
        timestamp: new Date(session.timestamp),
        selectedModels: session.selected_models,
        bestResponse: session.best_response,
        responseTime: session.response_time
      }))
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
      return null
    }
  }

  async deleteChatSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      const supabase = await this.getSupabaseClient()
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId)

      if (error) {
        console.error('Error deleting chat session:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting chat session:', error)
      return false
    }
  }
}

export const chatHistoryServerService = new ChatHistoryServerService()