export type AiModel = {
  id: string;
  label: string;
  provider: string;
  contextWindowK: number;
};

export const AVAILABLE_MODELS: AiModel[] = [
  { id: "openai/gpt-5-chat", label: "GPT‑5", provider: "OpenAI", contextWindowK: 2000 },
  { id: "anthropic/claude-sonnet-4", label: "Claude 4 Sonnet", provider: "Anthropic", contextWindowK: 2000 },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "Google", contextWindowK: 2000 },
  { id: "deepseek/deepseek-r1-0528", label: "DeepSeek-R1", provider: "DeepSeek", contextWindowK: 2000 },
  { id: "xai/grok-2", label: "Grok 2", provider: "xAI", contextWindowK: 2000 },
  { id: "qwen/qwen-2.5-72b-instruct", label: "Qwen 2.5 72B", provider: "Alibaba", contextWindowK: 2000 },
  { id: "perplexity/sonar-reasoning", label: "Perplexity Sonar", provider: "Perplexity", contextWindowK: 2000 }
];

export function getModelById(id: string): AiModel | undefined {
  return AVAILABLE_MODELS.find(m => m.id === id);
}


