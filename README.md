# AI Fiesta v0.1.0 - Multi-Model AI Comparison Platform

AI Fiesta is a cutting-edge Next.js application that enables users to compare responses from multiple AI models side-by-side using OpenRouter. With a sleek, modern interface, users can evaluate different AI models simultaneously to find the best responses for their queries.

AI Fiesta Interface
<img width="1893" height="943" alt="image" src="https://github.com/user-attachments/assets/f57b7216-4db3-4856-b507-1ee7925a4230" />


## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- OpenRouter API key
- Supabase account (for database functionality)

### Setup Instructions

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ai-fiesta
```

2. **Create environment configuration:**
Create a `.env` file in the root directory and add your API keys:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=AI Fiesta
```

3. **Configure OpenRouter Data Policy:**
Visit [https://openrouter.ai/settings/privacy](https://openrouter.ai/settings/privacy) and ensure that "Free model publication" is enabled, or select specific models that you want to use. The application is configured to use free-tier models with the `:free` suffix which provides basic access without cost.

4. **Understanding Free Model Usage Limits:**
The application is configured with free-tier models that have the following rate limits:
- Free models (with `:free` suffix): 20 requests per minute, 50-200 requests per day
- To increase limits, purchase credits on OpenRouter (removes most rate limits)
- BYOK (Bring Your Own Key) models have different rate limits

5. **Set up Supabase Database:**
Create the required database tables using the schema defined in [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)

6. **Install dependencies:**
```bash
npm install
# or
yarn install
```

7. **Run the development server:**
```bash
npm run dev
# or
yarn dev
```

8. **Access the application:**
Open [http://localhost:3000](http://localhost:3000) in your browser to start comparing AI models.

## 🎯 Key Features

### 🔍 Multi-Model Comparison
- Compare responses from up to 10+ AI models simultaneously
- Side-by-side response visualization
- Response time tracking for performance comparison
- Best response highlighting

### 💬 Advanced Chat Interface
- Dedicated chat interface for detailed conversations
- Persistent chat history with database storage
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
- Persistent storage in Supabase database

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
├── services/               # Business logic and external service integrations
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

### Database Schema

Chat sessions are stored in a Supabase PostgreSQL database. See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for detailed schema information.

## 🛠️ Technical Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **UI Components**: Lucide React icons
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Turbopack
- **Deployment**: Vercel-ready

## 🐛 Troubleshooting

If you encounter issues with database functionality, please refer to [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common solutions.

## 👨‍💻 Author

**Mannam Ganesh Babu** - CEO

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details