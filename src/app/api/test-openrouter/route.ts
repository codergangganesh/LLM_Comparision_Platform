import { NextRequest } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({ 
      error: "Missing OPENROUTER_API_KEY",
      message: "Please add your OpenRouter API key to the .env file"
    }), { status: 500 });
  }

  try {
    // Test the API key with a simple request
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: "Invalid API key or API access issue",
        status: response.status,
        details: errorText
      }), { status: response.status });
    }

    const data = await response.json();
    
    // Filter for free models
    const freeModels = data.data.filter((model: any) => 
      model.id.includes(':free') || 
      model.id.includes('openrouter/auto') ||
      model.id === 'openai/gpt-3.5-turbo' ||
      model.id === 'openai/gpt-4o-mini'
    );

    return Response.json({
      message: "OpenRouter API key is valid",
      totalModels: data.data.length,
      freeModels: freeModels.length,
      sampleFreeModels: freeModels.slice(0, 5).map((model: any) => ({
        id: model.id,
        name: model.name,
        description: model.description
      }))
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to connect to OpenRouter API",
      details: error instanceof Error ? error.message : String(error)
    }), { status: 500 });
  }
}