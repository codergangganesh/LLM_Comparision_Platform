export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({ 
      error: "Missing OPENROUTER_API_KEY",
      message: "Please add your OpenRouter API key to the .env file"
    }), { status: 500 });
  }

  try {
    // Fetch available models from OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: "Failed to fetch models",
        status: response.status,
        details: errorText
      }), { status: response.status });
    }

    const data = await response.json();
    
    // Filter for the models we're using in our application
    const ourModelIds = [
      "openai/gpt-3.5-turbo",
      "openai/gpt-4o-mini",
      "anthropic/claude-3-haiku:free",
      "google/gemini-flash-1.5:free",
      "meta-llama/llama-3.1-8b-instruct:free",
      "mistralai/mistral-7b-instruct:free",
      "microsoft/phi-3-mini-128k-instruct:free",
      "openrouter/auto",
      "nousresearch/hermes-3-llama-3.1-8b:free"
    ];
    
    const availableModels = data.data.filter((model: { id: string }) => 
      ourModelIds.includes(model.id)
    );

    const unavailableModels = ourModelIds.filter(modelId => 
      !data.data.some((model: { id: string }) => model.id === modelId)
    );

    return Response.json({
      message: "Model availability check completed",
      totalModels: data.data.length,
      availableModels: availableModels.map((model: { id: string; name: string; description: string }) => ({
        id: model.id,
        name: model.name,
        description: model.description
      })),
      unavailableModels: unavailableModels,
      allModelsAvailable: unavailableModels.length === 0
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to connect to OpenRouter API",
      details: error instanceof Error ? error.message : String(error)
    }), { status: 500 });
  }
}