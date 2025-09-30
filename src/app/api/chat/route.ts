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
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing OPENROUTER_API_KEY" }), { status: 500 });
  }

  const body: MultiChatBody = (await req.json()) as MultiChatBody;
  
  // Handle both single message and messages array formats
  let messages: ChatMessage[] = [];
  if (body.message) {
    messages = [{ role: "user", content: body.message }];
  } else if (Array.isArray(body.messages) && body.messages.length > 0) {
    messages = body.messages;
  } else {
    return new Response(JSON.stringify({ error: "Either message or messages[] required" }), { status: 400 });
  }

  if (!Array.isArray(body.models) || body.models.length === 0) {
    return new Response(JSON.stringify({ error: "models[] required" }), { status: 400 });
  }

  try {
    const startTime = Date.now(); // Track start time for response time calculation
    
    const requests = body.models.map(async (modelId) => {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "AI Fiesta",
        },
        body: JSON.stringify({
          model: modelId,
          messages: messages,
          max_tokens: body.maxTokens ?? 1024,
          temperature: body.temperature ?? 0.7,
          stream: false,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        return { model: modelId, error: text || `HTTP ${res.status}` };
      }
      const json = await res.json();
      const content: string = json.choices?.[0]?.message?.content ?? "";
      return { model: modelId, content };
    });

    const results = await Promise.all(requests);
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000; // Calculate response time in seconds

    return Response.json({ 
      results,
      responseTime // Include response time in the response
    });
  } catch (err: unknown) {
    // Type the error properly
    const error: ApiError = {
      message: err instanceof Error ? err.message : String(err)
    };
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}