export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      feedback_messages: {
        Row: {
          id: number
          created_at: string
          name: string
          email: string
          message: string
          rating: number | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          email: string
          message: string
          rating?: number | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          email?: string
          message?: string
          rating?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}