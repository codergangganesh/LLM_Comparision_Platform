import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({ 
      error: "Missing OPENROUTER_API_KEY",
      message: "Please add your OpenRouter API key to the .env file"
    }), { status: 500 });
  }

  try {
    // Test with a simple message to a known working model
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "AI Fiesta",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "user", content: "Hello, this is a test message. Please respond with 'Test successful'." }
        ],
        max_tokens: 50,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: "API request failed",
        status: response.status,
        statusText: response.statusText,
        details: errorText
      }), { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "No response content";
    
    return Response.json({
      message: "Test successful",
      response: content,
      model: "openai/gpt-3.5-turbo"
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to connect to OpenRouter API",
      details: error instanceof Error ? error.message : String(error)
    }), { status: 500 });
  }
}