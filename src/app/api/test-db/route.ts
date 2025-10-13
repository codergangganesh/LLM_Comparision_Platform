import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  
  // Get user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return new Response(JSON.stringify({ 
      error: "Unauthorized", 
      authError: authError?.message 
    }), { status: 401 });
  }
  
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
      message: "Database connection successful",
      user: user.id
    }), { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ 
      error: "Unexpected error",
      message: errorMessage 
    }), { status: 500 });
  }
}