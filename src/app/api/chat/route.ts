import { NextRequest } from "next/server";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
type MultiChatBody = { 
  models: string[]; 
  messages: ChatMessage[]; 
  maxTokens?: number; 
  temperature?: number;
  message?: string; // For single message comparisons
};

// Define a proper error type
type ApiError = {
  message: string;
  details?: any;
};

// Function to delay execution
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ 
      error: "Missing OPENROUTER_API_KEY",
      details: "Please add your OpenRouter API key to the .env file"
    }), { status: 500 });
  }

  let body: MultiChatBody;
  try {
    body = (await req.json()) as MultiChatBody;
  } catch (parseError) {
    return new Response(JSON.stringify({ 
      error: "Invalid JSON in request body",
      details: parseError instanceof Error ? parseError.message : String(parseError)
    }), { status: 400 });
  }
  
  // Handle both single message and messages array formats
  let messages: ChatMessage[] = [];
  if (body.message) {
    messages = [{ role: "user", content: body.message }];
  } else if (Array.isArray(body.messages) && body.messages.length > 0) {
    messages = body.messages;
  } else {
    return new Response(JSON.stringify({ 
      error: "Either message or messages[] required",
      details: "Please provide a message to send to the AI models"
    }), { status: 400 });
  }

  if (!Array.isArray(body.models) || body.models.length === 0) {
    return new Response(JSON.stringify({ 
      error: "models[] required",
      details: "Please select at least one AI model to compare"
    }), { status: 400 });
  }

  try {
    const startTime = Date.now(); // Track start time for response time calculation
    
    // Process requests sequentially with rate limiting to avoid 429 errors
    const results = [];
    for (let i = 0; i < body.models.length; i++) {
      const modelId = body.models[i];
      
      try {
        let res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "AI Fiesta",
            "Connection": "keep-alive",
            "Accept": "text/event-stream",
          },
          body: JSON.stringify({
            model: modelId,
            messages: messages,
            max_tokens: body.maxTokens ?? 512, // Reduced default tokens
            temperature: body.temperature ?? 0.7,
            stream: true,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          
          // If we get a 429 error, implement exponential backoff
          if (res.status === 429) {
            console.log(`Rate limited for model ${modelId}, implementing exponential backoff...`);
            
            // Exponential backoff: start with 2 seconds, double each time, up to 3 attempts
            let retryDelay = 2000; // 2 seconds
            let retryAttempts = 0;
            const maxRetries = 3;
            
            while (retryAttempts < maxRetries) {
              console.log(`Retry attempt ${retryAttempts + 1}/${maxRetries} after ${retryDelay}ms delay...`);
              await delay(retryDelay);
              
              const retryRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                  "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                  "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "AI Fiesta",
                  "Connection": "keep-alive",
                  "Accept": "text/event-stream",
                },
                body: JSON.stringify({
                  model: modelId,
                  messages: messages,
                  max_tokens: body.maxTokens ?? 512, // Reduced tokens for retries
                  temperature: body.temperature ?? 0.7,
                  stream: true,
                }),
              });
              
              if (retryRes.ok) {
                res = retryRes;
                break;
              }
              
              retryAttempts++;
              retryDelay *= 2; // Double the delay for next attempt
              
              if (retryAttempts >= maxRetries) {
                const retryErrorText = await retryRes.text();
                results.push({ 
                  model: modelId, 
                  error: `HTTP ${retryRes.status}: ${retryRes.statusText}`,
                  details: retryErrorText || `Failed to get response from ${modelId} after ${maxRetries} retries`
                });
                break;
              }
            }
            
            if (!res.ok && retryAttempts >= maxRetries) {
              continue;
            }
          } else {
            results.push({ 
              model: modelId, 
              error: `HTTP ${res.status}: ${res.statusText}`,
              details: errorText || `Failed to get response from ${modelId}`
            });
            continue;
          }
        }
        
        // Stream parser for OpenRouter SSE format
        let content = '';
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
              if (line.startsWith('data:')) {
                const data = line.slice(5).trim();
                if (data === '[DONE]') continue;
                
                try {
                  const json = JSON.parse(data);
                  const token = json.choices[0]?.delta?.content;
                  if (token) content += token;
                } catch (e) {
                  console.error('Error parsing SSE:', e);
                }
              }
            }
          }
          reader.releaseLock();
        }

        results.push({ model: modelId, content });
      } catch (modelError) {
        console.error(`Error with model ${modelId}:`, modelError);
        results.push({ 
          model: modelId, 
          error: modelError instanceof Error ? modelError.message : String(modelError),
          details: "Failed to get response from this model"
        });
      }
      
      // Add increased delay between requests to avoid rate limiting
      // Increase delay based on number of models to reduce rate limit issues
      if (i < body.models.length - 1) {
        const baseDelay = 500; // Increased from 200ms to 500ms
        const additionalDelay = body.models.length > 3 ? 300 : 0; // Extra delay for many models
        await delay(baseDelay + additionalDelay);
      }
    }

    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000; // Calculate response time in seconds

    return Response.json({ 
      results,
      responseTime // Include response time in the response
    });
  } catch (err: unknown) {
    // Type the error properly
    const error: ApiError = {
      message: err instanceof Error ? err.message : String(err),
      details: "Unexpected error in chat API route"
    };
    console.error("Unexpected error in chat API:", error);
    return new Response(JSON.stringify({ error: error.message, details: error.details }), { status: 500 });
  }
}