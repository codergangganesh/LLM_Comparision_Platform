export const AI_MODELS = [
  {
    id: 'nvidia/nemotron-nano-9b-v2:free',
    name: 'nvidia/nemotron-nano-9b-v2:free',
    displayName: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and cost-effective model for simple tasks',
    capabilities: ['text', 'code']
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    displayName: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Small model, multimodal capabilities, great for everyday use',
    capabilities: ['text', 'code', 'image']
  },
  {
    id: 'claude-3-haiku-free',
    name: 'Claude 3 Haiku (Free)',
    displayName: 'Claude 3 Haiku (Free)',
    provider: 'Anthropic',
    description: 'Anthropic\'s balanced intelligence model with free tier',
    capabilities: ['text', 'analysis', 'reasoning']
  },
  {
    id: 'google/gemma-3n-e2b-it:free',
    name: 'google/gemma-3n-e2b-it:free',
    displayName: 'Gemini Flash 1.5 (Free)',
    provider: 'Google',
    description: 'Google\'s fast multimodal AI model with free tier',
    capabilities: ['text', 'image', 'video', 'audio']
  },
  {
    id: 'llama-3.1-8b-free',
    name: 'LLaMA 3.1 8B (Free)',
    displayName: 'LLaMA 3.1 8B (Free)',
    provider: 'Meta',
    description: 'Meta\'s efficient large language model with free tier',
    capabilities: ['text', 'reasoning']
  },
  {
    id: 'mistral-7b-free',
    name: 'Mistral 7B (Free)',
    displayName: 'Mistral 7B (Free)',
    provider: 'Mistral AI',
    description: 'Mistral AI\'s efficient model with free tier',
    capabilities: ['text', 'code']
  },
  {
    id: 'phi-3-mini-free',
    name: 'Phi-3 Mini (Free)',
    displayName: 'Phi-3 Mini (Free)',
    provider: 'Microsoft',
    description: 'Microsoft\'s efficient model with very long context window',
    capabilities: ['text', 'code', 'reasoning']
  },
  {
    id: 'auto-select',
    name: 'Auto Select',
    displayName: 'Auto Select',
    provider: 'OpenRouter',
    description: 'Automatically select the best model for your request',
    capabilities: ['text', 'code', 'analysis']
  },
  {
    id: 'hermes-3-8b-free',
    name: 'Hermes 3 8B (Free)',
    displayName: 'Hermes 3 8B (Free)',
    provider: 'Nous Research',
    description: 'Highly capable reasoning model with free tier',
    capabilities: ['text', 'code', 'reasoning']
  }
]