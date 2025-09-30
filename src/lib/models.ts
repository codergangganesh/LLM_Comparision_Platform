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
    id: "openai/gpt-5-chat", 
    label: "GPT‑5", 
    provider: "OpenAI", 
    contextWindowK: 2000,
    description: "OpenAI's most advanced reasoning model",
    capabilities: ["text", "code", "analysis"]
  },
  { 
    id: "anthropic/claude-sonnet-4", 
    label: "Claude 4 Sonnet", 
    provider: "Anthropic", 
    contextWindowK: 2000,
    description: "Anthropic's balanced intelligence model",
    capabilities: ["text", "analysis", "reasoning"]
  },
  { 
    id: "google/gemini-2.5-pro", 
    label: "Gemini 2.5 Pro", 
    provider: "Google", 
    contextWindowK: 2000,
    description: "Google's multimodal AI model",
    capabilities: ["text", "image", "video", "audio"]
  },
  { 
    id: "deepseek/deepseek-r1-0528", 
    label: "DeepSeek-R1", 
    provider: "DeepSeek", 
    contextWindowK: 2000,
    description: "DeepSeek's reasoning-focused model",
    capabilities: ["text", "code", "math"]
  },
  { 
    id: "xai/grok-2", 
    label: "Grok 2", 
    provider: "xAI", 
    contextWindowK: 2000,
    description: "xAI's sassy and knowledgeable model",
    capabilities: ["text", "humor", "analysis"]
  },
  { 
    id: "qwen/qwen-2.5-72b-instruct", 
    label: "Qwen 2.5 72B", 
    provider: "Alibaba", 
    contextWindowK: 2000,
    description: "Alibaba's large language model",
    capabilities: ["text", "code", "multilingual"]
  },
  { 
    id: "perplexity/sonar-reasoning", 
    label: "Perplexity Sonar", 
    provider: "Perplexity", 
    contextWindowK: 2000,
    description: "Perplexity's reasoning-optimized model",
    capabilities: ["text", "search", "analysis"]
  }
];

export function getModelById(id: string): AiModel | undefined {
  return AVAILABLE_MODELS.find(m => m.id === id);
}