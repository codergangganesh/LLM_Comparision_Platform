# AI Fiesta v0.1.0 - Multi-Model AI Comparison Platform

AI Fiesta is a cutting-edge Next.js application that enables users to compare responses from multiple AI models side-by-side using OpenRouter. With a sleek, modern interface, users can evaluate different AI models simultaneously to find the best responses for their queries.

![AI Fiesta Interface]<img width="1892" height="944" alt="image" src="https://github.com/user-attachments/assets/301ab8c5-12aa-40c8-93de-6f7322652011" />


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
│   ├── dashboard/         # Analytics dashboard
│   ├── history/           # Chat history
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── chat/              # Chat-specific components
│   ├── history/           # History components
│   └── layout/            # Layout components
├── lib/                   # Utility functions and data
├── types/                 # TypeScript type definitions
└── contexts/              # React context providers
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
- `openai/gpt-4-turbo` - GPT-4 Turbo with 128K context
- `openai/gpt-4` - GPT-4 with improved instruction following
- `openai/gpt-3.5-turbo` - Fast, cost-effective model

### Anthropic
- `anthropic/claude-3-opus` - Most powerful model
- `anthropic/claude-3-sonnet` - Balance of intelligence and speed
- `anthropic/claude-3-haiku` - Fastest and most compact

### Google
- `google/gemini-pro` - Google's conversational AI
- `google/gemini-1.5-pro` - Multimodal model with 1M token context

### Meta
- `meta-llama/llama-3-70b-instruct` - Llama 3 70B parameter model
- `meta-llama/llama-3-8b-instruct` - Llama 3 8B parameter model

### Specialized Models
- `deepseek/deepseek-chat` - DeepSeek's reasoning model
- `qwen/qwen-2-72b-instruct` - Alibaba's Qwen 2
- `mistralai/mixtral-8x22b-instruct` - Mistral's MoE model
- `perplexity/sonar-medium` - Perplexity's reasoning model

## 🛠️ Technical Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **UI Components**: Lucide React icons
- **State Management**: React Context API
- **Build Tool**: Turbopack
- **Deployment**: Vercel-ready

## 📈 Performance Optimization

- Client-side caching with localStorage
- Efficient component re-rendering
- Lazy loading for large responses
- Optimized bundle size with Tree Shaking

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Application URL | No |
| `NEXT_PUBLIC_SITE_NAME` | Application name | No |

## 🚀 Deployment

### Vercel Deployment
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment
```bash
npm run build
npm start
```

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [React Documentation](https://react.dev/reference/react) - React library reference
- [OpenRouter Documentation](https://openrouter.ai/docs) - AI model API documentation

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Mannam Ganesh Babu** - *CEO* - [GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to [OpenRouter](https://openrouter.ai) for providing access to multiple AI models
- Built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), and [Lucide Icons](https://lucide.dev)
- Special thanks to the open-source community for the amazing tools and libraries
