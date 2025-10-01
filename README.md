# AI Fiesta v0.1.0 - Multi-Model AI Comparison Platform

AI Fiesta is a cutting-edge Next.js application that enables users to compare responses from multiple AI models side-by-side using OpenRouter. With a sleek, modern interface, users can evaluate different AI models simultaneously to find the best responses for their queries.

AI Fiesta Interface
<img width="1893" height="943" alt="image" src="https://github.com/user-attachments/assets/f57b7216-4db3-4856-b507-1ee7925a4230" />


## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- OpenRouter API key

### Setup Instructions

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ai-fiesta
```

2. **Create environment configuration:**
Create a `.env` file in the root directory and add your OpenRouter API key:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=AI Fiesta
```

3. **Install dependencies:**
```bash
npm install
# or
yarn install
```

4. **Run the development server:**
```bash
npm run dev
# or
yarn dev
```

5. **Access the application:**
Open [http://localhost:3000](http://localhost:3000) in your browser to start comparing AI models.

## 🎯 Key Features

### 🔍 Multi-Model Comparison
- Compare responses from up to 10+ AI models simultaneously
- Side-by-side response visualization
- Response time tracking for performance comparison
- Best response highlighting

### 💬 Advanced Chat Interface
- Dedicated chat interface for detailed conversations
- Persistent chat history with localStorage
- Model-specific response cards with rich formatting
- Copy response functionality

### 📊 Analytics Dashboard
- Performance metrics and statistics
- Model usage tracking
- Response quality analysis

### 📚 Chat History
- Browse and search through previous conversations
- Delete unwanted history entries
- View model usage per conversation

### 🎨 Modern UI/UX
- Responsive design that works on desktop and mobile devices
- Dark/light mode support
- Smooth animations and transitions
- Intuitive navigation with tooltips

### 🧠 Extensive Model Support
- Access to 50+ AI models from leading providers
- Detailed model information and capabilities
- Provider-specific styling and branding

## 🏗️ Project Architecture

### Directory Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── chat/              # Chat interface
│   ├── dashboard/          # Analytics dashboard
│   ├── history/            # Chat history
│   └── layout.tsx          # Root layout
├── components/             # Reusable UI components
│   ├── chat/               # Chat-specific components
│   ├── history/            # History components
│   └── layout/             # Layout components
├── lib/                    # Utility functions and data
├── types/                  # TypeScript type definitions
└── contexts/               # React context providers
```

### Core Components

| Component | Description |
|-----------|-------------|
| `ModernChatInterface.tsx` | Main chat interface with sidebar navigation |
| `AIResponseCard.tsx` | Individual model response display with actions |
| `ModelSelector.tsx` | Model selection and configuration panel |
| `ModernHistoryInterface.tsx` | Chat history browsing and management |

## 🤖 Available AI Models

AI Fiesta supports a wide range of models from leading AI providers:

### OpenAI
- `openai/gpt-5-chat` - GPT-5, OpenAI's most advanced reasoning model

### Anthropic
- `anthropic/claude-sonnet-4` - Claude 4 Sonnet, Anthropic's balanced intelligence model

### Google
- `google/gemini-2.5-pro` - Gemini 2.5 Pro, Google's multimodal AI model

### Meta
- `meta/llama-4` - LLaMA 4, Meta's next-generation large language model

### DeepSeek
- `deepseek/deepseek-r1-0528` - DeepSeek-R1, DeepSeek's reasoning-focused model

### xAI
- `xai/grok-2` - Grok 2, xAI's sassy and knowledgeable model

### Alibaba
- `qwen/qwen-2.5-72b-instruct` - Qwen 2.5 72B, Alibaba's large language model

### Perplexity
- `perplexity/sonar-reasoning` - Perplexity Sonar, Perplexity's reasoning-optimized model

### Cohere
- `cohere/command-r-plus` - Command R+, Cohere's powerful model optimized for retrieval and RAG

## 🛠️ Technical Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **UI Components**: Lucide React icons
- **State Management**: React Context API
- **Build Tool**: Turbopack
- **Deployment**: Vercel-ready