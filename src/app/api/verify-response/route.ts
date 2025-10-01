import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, models } = body;

    // Validate input
    if (!message || !models || !Array.isArray(models) || models.length === 0) {
      return new Response(JSON.stringify({ 
        error: "Invalid input",
        details: "Message and models array are required"
      }), { status: 400 });
    }

    // Simulate a successful response from the chat API
    const results = models.map(model => ({
      model,
      content: `This is a simulated response from ${model} for the message: "${message}". In a real implementation, this would be the actual response from the AI model.`,
      success: true
    }));

    return Response.json({ 
      results,
      responseTime: 0.5
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to process request",
      details: error instanceof Error ? error.message : String(error)
    }), { status: 500 });
  }
}