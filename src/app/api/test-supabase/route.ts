import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(_req: NextRequest) {
  console.log('GET /api/test-supabase called')
  
  try {
    const supabase = await createClient()
    console.log('Supabase client created successfully')
    
    // Test the connection by getting the user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return new Response(JSON.stringify({ 
        error: "Authentication failed",
        details: authError.message
      }), { status: 401 })
    }
    
    console.log('User:', user ? 'Authenticated' : 'Not authenticated')
    
    if (!user) {
      return new Response(JSON.stringify({ 
        message: "No user authenticated",
        user: null
      }), { status: 200 })
    }
    
    // Test a simple query to a system table
    const { error: queryError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(5)
    
    if (queryError) {
      console.error('Query error:', queryError)
      return new Response(JSON.stringify({ 
        error: "Query failed",
        details: queryError.message
      }), { status: 500 })
    }
    
    console.log('Query successful')
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Supabase connection successful",
      user: {
        id: user.id,
        email: user.email
      }
    }), { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ 
      error: "Unexpected error",
      message: errorMessage
    }), { status: 500 })
  }
}