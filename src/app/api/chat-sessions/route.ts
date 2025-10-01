import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ChatSession } from "@/types/chat";

export async function GET(req: NextRequest) {
  console.log('GET /api/chat-sessions called');
  const supabase = createClient();
  
  try {
    // Get user with better error handling
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('GET - Authentication error:', authError.message);
      return new Response(JSON.stringify({ error: "Unauthorized", authError: authError.message }), { status: 401 });
    }
    
    if (!user) {
      console.error('GET - No user found in session');
      return new Response(JSON.stringify({ error: "Unauthorized", authError: "No user session found" }), { status: 401 });
    }
    
    console.log('GET - User authenticated:', user.id);
    
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });
      
    if (error) {
      console.error('GET - Database query error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    
    console.log('GET - Successfully fetched sessions:', data?.length || 0);
    
    // Convert database format to ChatSession format
    const chatSessions: ChatSession[] = data.map((session: any) => ({
      id: session.id,
      message: session.message,
      responses: session.responses,
      timestamp: new Date(session.timestamp),
      selectedModels: session.selected_models,
      bestResponse: session.best_response,
      responseTime: session.response_time
    }));
    
    return new Response(JSON.stringify(chatSessions), { status: 200 });
  } catch (error: any) {
    console.error('GET - Unexpected error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log('POST /api/chat-sessions called');
  const supabase = createClient();
  
  try {
    // Get user with better error handling
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('POST - Authentication error:', authError.message);
      return new Response(JSON.stringify({ error: "Unauthorized", authError: authError.message }), { status: 401 });
    }
    
    if (!user) {
      console.error('POST - No user found in session');
      return new Response(JSON.stringify({ error: "Unauthorized", authError: "No user session found" }), { status: 401 });
    }
    
    let session: ChatSession;
    try {
      session = await req.json();
      console.log('POST - Received session data:', JSON.stringify(session, null, 2));
    } catch (parseError) {
      console.error('POST - Invalid JSON in request body:', parseError);
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), { status: 400 });
    }
    
    // Validate required fields
    if (!session.id) {
      console.error('POST - Missing required field: id');
      return new Response(JSON.stringify({ error: "Missing required field: id" }), { status: 400 });
    }
    
    if (!session.message) {
      console.error('POST - Missing required field: message');
      return new Response(JSON.stringify({ error: "Missing required field: message" }), { status: 400 });
    }
    
    if (!session.timestamp) {
      console.error('POST - Missing required field: timestamp');
      return new Response(JSON.stringify({ error: "Missing required field: timestamp" }), { status: 400 });
    }
    
    // Ensure timestamp is a Date object
    let timestamp: Date;
    if (typeof session.timestamp === 'string') {
      timestamp = new Date(session.timestamp);
    } else if (session.timestamp instanceof Date) {
      timestamp = session.timestamp;
    } else {
      console.error('POST - Invalid timestamp format');
      return new Response(JSON.stringify({ error: "Invalid timestamp format" }), { status: 400 });
    }
    
    // Ensure responses is an array
    const responses = Array.isArray(session.responses) ? session.responses : [];
    
    // Ensure selectedModels is an array
    const selectedModels = Array.isArray(session.selectedModels) ? session.selectedModels : [];
    
    console.log('POST - Attempting to insert or update session:', {
      id: session.id,
      user_id: user.id,
      message: session.message,
      responses_count: responses.length,
      timestamp: timestamp.toISOString(),
      selected_models_count: selectedModels.length,
    });
    
    // First, try to update an existing session
    const { data: updateData, error: updateError } = await supabase
      .from('chat_sessions')
      .update({
        message: session.message,
        responses: responses,
        timestamp: timestamp.toISOString(),
        selected_models: selectedModels,
        best_response: session.bestResponse,
        response_time: session.responseTime,
        created_at: new Date().toISOString()
      })
      .eq('id', session.id)
      .eq('user_id', user.id)
      .select();

    // If no rows were updated, it means the session doesn't exist, so insert it
    if (updateData && updateData.length === 0) {
      const { error: insertError } = await supabase.from('chat_sessions').insert({
        id: session.id,
        user_id: user.id,
        message: session.message,
        responses: responses,
        timestamp: timestamp.toISOString(),
        selected_models: selectedModels,
        best_response: session.bestResponse,
        response_time: session.responseTime,
        created_at: new Date().toISOString()
      });
      
      if (insertError) {
        console.error('POST - Database insert error:', {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint
        });
        return new Response(JSON.stringify({ 
          error: "Database operation failed",
          details: insertError.message,
          code: insertError.code
        }), { status: 500 });
      }
    } else if (updateError) {
      console.error('POST - Database update error:', {
        message: updateError.message,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint
      });
      return new Response(JSON.stringify({ 
        error: "Database operation failed",
        details: updateError.message,
        code: updateError.code
      }), { status: 500 });
    }
    
    console.log('POST - Successfully saved session:', session.id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error('POST - Unexpected error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  console.log('DELETE /api/chat-sessions called');
  const supabase = createClient();
  
  try {
    // Get user with better error handling
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('DELETE - Authentication error:', authError.message);
      return new Response(JSON.stringify({ error: "Unauthorized", authError: authError.message }), { status: 401 });
    }
    
    if (!user) {
      console.error('DELETE - No user found in session');
      return new Response(JSON.stringify({ error: "Unauthorized", authError: "No user session found" }), { status: 401 });
    }
    
    try {
      let sessionId: string;
      try {
        const body = await req.json();
        sessionId = body.sessionId;
      } catch (parseError) {
        console.error('DELETE - Invalid JSON in request body:', parseError);
        return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), { status: 400 });
      }
      
      if (!sessionId) {
        console.error('DELETE - Missing sessionId');
        return new Response(JSON.stringify({ error: "Missing sessionId" }), { status: 400 });
      }
      
      console.log('DELETE - Attempting to delete session:', { sessionId, user_id: user.id });
      
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('DELETE - Database delete error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
      
      console.log('DELETE - Successfully deleted session:', sessionId);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error: any) {
      console.error('DELETE - Unexpected error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  } catch (error: any) {
    console.error('DELETE - Authentication error:', error);
    return new Response(JSON.stringify({ error: "Authentication failed", details: error.message }), { status: 401 });
  }
}