import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest) {
  console.log('GET /api/check-table called');
  const supabase = await createClient();
  
  // Get user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Unauthorized access attempt', { authError: authError?.message });
    return new Response(JSON.stringify({ error: "Unauthorized", authError: authError?.message }), { status: 401 });
  }
  
  try {
    console.log('User authenticated:', user.id);
    
    // First, check if the table exists by querying the information schema
    console.log('Checking if chat_sessions table exists...');
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'chat_sessions');
    
    if (tableError) {
      console.error('Error checking table existence:', tableError);
      return new Response(JSON.stringify({ 
        error: "Failed to check table existence",
        details: tableError.message
      }), { status: 500 });
    }
    
    if (!tables || tables.length === 0) {
      console.log('chat_sessions table does not exist');
      return new Response(JSON.stringify({ 
        error: "Table does not exist",
        message: "The chat_sessions table does not exist in the database"
      }), { status: 404 });
    }
    
    console.log('chat_sessions table exists, checking permissions...');
    
    // Try a simple select to check permissions
    const { error: selectError } = await supabase
      .from('chat_sessions')
      .select('id')
      .limit(1);
    
    if (selectError) {
      console.error('Select permission error:', selectError);
      return new Response(JSON.stringify({ 
        error: "Select permission denied",
        details: selectError.message,
        code: selectError.code
      }), { status: 500 });
    }
    
    console.log('Select permission OK');
    
    // Try a simple insert to check permissions
    const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    console.log('Testing insert permission with test ID:', testId);
    
    const { error: insertError } = await supabase.from('chat_sessions').insert({
      id: testId,
      user_id: user.id,
      message: 'Test message',
      responses: [],
      timestamp: new Date().toISOString(),
      selected_models: [],
      created_at: new Date().toISOString()
    });
    
    if (insertError) {
      console.error('Insert permission error:', insertError);
      return new Response(JSON.stringify({ 
        error: "Insert permission denied",
        details: insertError.message,
        code: insertError.code
      }), { status: 500 });
    }
    
    console.log('Insert permission OK, cleaning up test record...');
    
    // Clean up the test record
    const { error: deleteError } = await supabase.from('chat_sessions').delete().eq('id', testId);
    
    if (deleteError) {
      console.error('Cleanup delete error (not critical):', deleteError);
    } else {
      console.log('Test record cleaned up successfully');
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Table exists and is accessible",
      table: "chat_sessions",
      permissions: {
        select: true,
        insert: true,
        delete: true
      }
    }), { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: "Unexpected error",
      message: errorMessage 
    }), { status: 500 });
  }
}