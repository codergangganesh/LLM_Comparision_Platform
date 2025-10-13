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
    id: "nvidia/nemotron-nano-9b-v2:free", 
    label: "GPT-3.5 Turbo", 
    provider: "OpenAI", 
    contextWindowK: 16000,
    description: "Fast and cost-effective model for simple tasks",
    capabilities: ["text", "code"]
  },
  { 
    id: "gpt-4o-mini", 
    label: "GPT-4o Mini", 
    provider: "OpenAI", 
    contextWindowK: 128000,
    description: "Small model, multimodal capabilities, great for everyday use",
    capabilities: ["text", "code", "image"]
  },
  { 
    id: "claude-3-haiku-free", 
    label: "Claude 3 Haiku (Free)", 
    provider: "Anthropic", 
    contextWindowK: 2000,
    description: "Anthropic's balanced intelligence model with free tier",
    capabilities: ["text", "analysis", "reasoning"]
  },
  { 
    id: "google/gemma-3n-e2b-it:free", 
    label: "Gemini Flash 1.5 (Free)", 
    provider: "Google", 
    contextWindowK: 10000,
    description: "Google's fast multimodal AI model with free tier",
    capabilities: ["text", "image", "video", "audio"]
  },
  { 
    id: "llama-3.1-8b-free", 
    label: "LLaMA 3.1 8B (Free)", 
    provider: "Meta", 
    contextWindowK: 8000,
    description: "Meta's efficient large language model with free tier",
    capabilities: ["text", "reasoning"]
  },
  { 
    id: "mistral-7b-free", 
    label: "Mistral 7B (Free)", 
    provider: "Mistral AI", 
    contextWindowK: 8000,
    description: "Mistral AI's efficient model with free tier",
    capabilities: ["text", "code"]
  },
  { 
    id: "phi-3-mini-free", 
    label: "Phi-3 Mini (Free)", 
    provider: "Microsoft", 
    contextWindowK: 128000,
    description: "Microsoft's efficient model with very long context window",
    capabilities: ["text", "code", "reasoning"]
  },
  { 
    id: "auto-select", 
    label: "Auto Select", 
    provider: "OpenRouter", 
    contextWindowK: 128000,
    description: "Automatically select the best model for your request",
    capabilities: ["text", "code", "analysis"]
  },
  { 
    id: "hermes-3-8b-free", 
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