import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  console.log('POST /api/test-insert called');
  
  try {
    const supabase = createClient();
    
    // Get user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Unauthorized access attempt', { authError: authError?.message });
      return new Response(JSON.stringify({ error: "Unauthorized", authError: authError?.message }), { status: 401 });
    }
    
    console.log('User authenticated:', user.id);
    
    // Try to insert a minimal test record
    const testSession = {
      id: `test_${Date.now()}`,
      user_id: user.id,
      message: "Test message",
      responses: [],
      timestamp: new Date().toISOString(),
      selected_models: ["test-model"],
      created_at: new Date().toISOString()
    };
    
    console.log('Attempting to insert test session:', JSON.stringify(testSession, null, 2));
    
    const { data, error } = await supabase.from('chat_sessions').insert(testSession);
    
    if (error) {
      console.error('Insert error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return new Response(JSON.stringify({ 
        error: "Insert failed",
        details: error.message,
        code: error.code,
        fullError: error
      }), { status: 500 });
    }
    
    console.log('Insert successful:', data);
    
    // Clean up - delete the test record
    const { error: deleteError } = await supabase.from('chat_sessions').delete().eq('id', testSession.id);
    
    if (deleteError) {
      console.error('Cleanup error (not critical):', deleteError);
    } else {
      console.log('Test record cleaned up');
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Test insert successful",
      insertedData: data
    }), { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: "Unexpected error",
      message: error.message
    }), { status: 500 });
  }
}