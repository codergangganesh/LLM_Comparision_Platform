export type AiModel = {
  id: string;
  label: string;
  provider: string;
  contextWindowK: number;
  description?: string;
  capabilities?: string[];
};

export const AVAILABLE_MODELS: AiModel[] = [
  { 
    id: "openai/gpt-3.5-turbo", 
    label: "GPT-3.5 Turbo", 
    provider: "OpenAI", 
    contextWindowK: 16000,
    description: "Fast and cost-effective model for simple tasks",
    capabilities: ["text", "code"]
  },
  { 
    id: "openai/gpt-4o-mini", 
    label: "GPT-4o Mini", 
    provider: "OpenAI", 
    contextWindowK: 128000,
    description: "Small model, multimodal capabilities, great for everyday use",
    capabilities: ["text", "code", "image"]
  },
  { 
    id: "qwen/qwen3-8b:free", 
    label: "qwen/qwen3-8b:free", 
    provider: "Anthropic", 
    contextWindowK: 2000,
    description: "Anthropic's balanced intelligence model with free tier",
    capabilities: ["text", "analysis", "reasoning"]
  },
  { 
    id: "google/gemini-flash-1.5:free", 
    label: "Gemini Flash 1.5 (Free)", 
    provider: "Google", 
    contextWindowK: 10000,
    description: "Google's fast multimodal AI model with free tier",
    capabilities: ["text", "image", "video", "audio"]
  },
  { 
    id: "meta-llama/llama-3.1-8b-instruct:free", 
    label: "LLaMA 3.1 8B (Free)", 
    provider: "Meta", 
    contextWindowK: 8000,
    description: "Meta's efficient large language model with free tier",
    capabilities: ["text", "reasoning"]
  },
  { 
    id: "mistralai/mistral-7b-instruct:free", 
    label: "Mistral 7B (Free)", 
    provider: "Mistral AI", 
    contextWindowK: 8000,
    description: "Mistral AI's efficient model with free tier",
    capabilities: ["text", "code"]
  },
  { 
    id: "microsoft/phi-3-mini-128k-instruct:free", 
    label: "Phi-3 Mini (Free)", 
    provider: "Microsoft", 
    contextWindowK: 128000,
    description: "Microsoft's efficient model with very long context window",
    capabilities: ["text", "code", "reasoning"]
  },
  { 
    id: "openrouter/auto", 
    label: "Auto Select", 
    provider: "OpenRouter", 
    contextWindowK: 128000,
    description: "Automatically select the best model for your request",
    capabilities: ["text", "code", "analysis"]
  },
  { 
    id: "nousresearch/hermes-3-llama-3.1-8b:free", 
    label: "Hermes 3 8B (Free)", 
    provider: "Nous Research", 
    contextWindowK: 8000,
    description: "Highly capable reasoning model with free tier",
    capabilities: ["text", "code", "reasoning"]
  }
];

export function getModelById(id: string): AiModel | undefined {
  return AVAILABLE_MODELS.find(m => m.id === id);
}