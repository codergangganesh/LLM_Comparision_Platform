import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'

export async function initializeDatabase() {
  const supabase = await createClient()
  
  try {
    // Check if the chat_sessions table exists by querying the information schema
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'chat_sessions')
      .limit(1)
      
    if (error) {
      console.error('Error checking table existence:', error)
      return { success: false, error: error.message }
    }
    
    if (data && data.length > 0) {
      console.log('Database initialization successful - table exists')
      return { success: true, message: 'Table already exists' }
    } else {
      console.log('Chat sessions table does not exist')
      return { success: true, message: 'Table does not exist - please run the initialization script' }
    }
  } catch (error: unknown) {
    console.error('Database initialization error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { success: false, error: errorMessage }
  }
}

// Function to check if the database connection is working
export async function checkDatabaseConnection() {
  const supabase = await createClient()
  
  try {
    // Test the connection by querying the information schema
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)
      
    if (error) {
      console.error('Database connection error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Database connection successful')
    return { success: true, message: 'Database connection successful', tableCount: data?.length || 0 }
  } catch (error: unknown) {
    console.error('Database connection error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { success: false, error: errorMessage }
  }
}