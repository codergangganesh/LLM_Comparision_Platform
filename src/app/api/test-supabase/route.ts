import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  console.log('GET /api/test-supabase called');
  
  try {
    const supabase = createClient();
    console.log('Supabase client created successfully');
    
    // Test the connection by getting the user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ 
        error: "Authentication failed",
        details: authError.message
      }), { status: 401 });
    }
    
    console.log('User:', user ? 'Authenticated' : 'Not authenticated');
    
    if (!user) {
      return new Response(JSON.stringify({ 
        message: "No user authenticated",
        user: null
      }), { status: 200 });
    }
    
    // Test a simple query to a system table
    const { data: tables, error: queryError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(5);
    
    if (queryError) {
      console.error('Query error:', queryError);
      return new Response(JSON.stringify({ 
        error: "Query failed",
        details: queryError.message
      }), { status: 500 });
    }
    
    console.log('Query successful, found tables:', tables?.length || 0);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Supabase connection successful",
      user: {
        id: user.id,
        email: user.email
      },
      tableCount: tables?.length || 0
    }), { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: "Unexpected error",
      message: error.message
    }), { status: 500 });
  }
}