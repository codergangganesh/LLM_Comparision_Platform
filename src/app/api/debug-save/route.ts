import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  console.log('POST /api/debug-save called');
  
  try {
    const supabase = createClient();
    
    // Get user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Unauthorized access attempt', { authError: authError?.message });
      return new Response(JSON.stringify({ error: "Unauthorized", authError: authError?.message }), { status: 401 });
    }
    
    console.log('User authenticated:', user.id);
    
    // Get the session data from the request
    let sessionData: any;
    try {
      sessionData = await req.json();
      console.log('Received session data:', JSON.stringify(sessionData, null, 2));
    } catch (parseError) {
      console.error('Invalid JSON in request body:', parseError);
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), { status: 400 });
    }
    
    // Validate and prepare the data
    const id = sessionData.id || `debug_${Date.now()}`;
    const message = sessionData.message || "Debug message";
    const responses = Array.isArray(sessionData.responses) ? sessionData.responses : [];
    const timestamp = sessionData.timestamp ? new Date(sessionData.timestamp).toISOString() : new Date().toISOString();
    const selected_models = Array.isArray(sessionData.selectedModels) ? sessionData.selectedModels : ["debug-model"];
    const best_response = sessionData.bestResponse || null;
    const response_time = sessionData.responseTime || null;
    
    const preparedData = {
      id,
      user_id: user.id,
      message,
      responses,
      timestamp,
      selected_models,
      best_response,
      response_time,
      created_at: new Date().toISOString()
    };
    
    console.log('Prepared data for insert:', JSON.stringify(preparedData, null, 2));
    
    // Try to insert the data
    const { data, error } = await supabase.from('chat_sessions').insert(preparedData);
    
    if (error) {
      console.error('Database insert error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return new Response(JSON.stringify({ 
        error: "Database insert failed",
        details: error.message,
        code: error.code,
        fullError: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        }
      }), { status: 500 });
    }
    
    console.log('Insert successful:', data);
    
    // Clean up - delete the debug record
    const { error: deleteError } = await supabase.from('chat_sessions').delete().eq('id', id);
    
    if (deleteError) {
      console.error('Cleanup error (not critical):', deleteError);
    } else {
      console.log('Debug record cleaned up');
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Debug save successful",
      insertedData: data,
      preparedData: preparedData
    }), { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: "Unexpected error",
      message: error.message,
      stack: error.stack
    }), { status: 500 });
  }
}