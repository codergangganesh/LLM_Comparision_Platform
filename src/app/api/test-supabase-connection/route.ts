import { NextRequest } from "next/server"
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  
  try {
    // Test database connection by querying the chat_sessions table
    const { data, error } = await supabase
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
      message: "Database connection successful",
      sampleData: data
    }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: "Unexpected error",
      message: error.message 
    }), { status: 500 });
  }
}