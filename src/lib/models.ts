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
    id: "openai/gpt-oss-20b:free", 
    label: "GPT-5", 
    provider: "OpenAI", 
    contextWindowK: 16000,
    description: "Fast and cost-effective model for simple tasks",
    capabilities: ["text", "code"]
  },
  { 
    id: "deepseek/deepseek-r1-0528-qwen3-8b:free", 
    label: "Deepseek-R1", 
    provider: "Deepseek", 
    contextWindowK: 128000,
    description: "Small model, multimodal capabilities, great for everyday use",
    capabilities: ["text", "code", "image"]
  },
  { 
    id: "qwen/qwen3-8b:free", 
    label: "Claud 2.5", 
    provider: "Anthropic", 
    contextWindowK: 2000,
    description: "Anthropic's balanced intelligence model with free tier",
    capabilities: ["text", "analysis", "reasoning"]
  },
  { 
    id: "nvidia/nemotron-nano-9b-v2:free", 
    label: "Gemini 2.5", 
    provider: "Google", 
    contextWindowK: 10000,
    description: "Google's fast multimodal AI model with free tier",
    capabilities: ["text", "image", "video", "audio"]
  },
  { 
    id: "meta-llama/llama-3.3-8b-instruct:free", 
    label: "Meta-llama", 
    provider: "Meta", 
    contextWindowK: 8000,
    description: "Meta's efficient large language model with free tier",
    capabilities: ["text", "reasoning"]
  },
  { 
    id: "qwen/qwen3-235b-a22b:free", 
    label: "Qwen3-235b", 
    provider: "Mistral AI", 
    contextWindowK: 8000,
    description: "Mistral AI's efficient model with free tier",
    capabilities: ["text", "code"]
  },
  { 
    id: "mistralai/mistral-small-3.2-24b-instruct:free", 
    label: "Mistrail", 
    provider: "Microsoft", 
    contextWindowK: 128000,
    description: "Microsoft's efficient model with very long context window",
    capabilities: ["text", "code", "reasoning"]
  },
  { 
    id: "z-ai/glm-4.5-air:free", 
    label: "Grok-4", 
    provider: "xAI", 
    contextWindowK: 128000,
    description: "Automatically select the best model for your request",
    capabilities: ["text", "code", "analysis"]
  },
  { 
    id: "nousresearch/deephermes-3-llama-3-8b-preview:free", 
    label: "deephermes", 
    provider: "Nous Research", 
    contextWindowK: 8000,
    description: "Highly capable reasoning model with free tier",
    capabilities: ["text", "code", "reasoning"]
  }
];

export function getModelById(id: string): AiModel | undefined {
  return AVAILABLE_MODELS.find(m => m.id === id);
}