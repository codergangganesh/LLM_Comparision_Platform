import { NextRequest } from "next/server"
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  
  try {
    // Test database connection by querying the chat_sessions table
    const { error } = await supabase
      .from('chat_sessions')
      .select('id')
      .limit(1);
      
    if (error) {
      return new Response(JSON.stringify({ 
        error: "Database query failed",
        dbError: error.message,
        details: error
      }), { status: 500 });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Database connection successful"
    }), { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ 
      error: "Unexpected error",
      message: errorMessage 
    }), { status: 500 });
  }
}