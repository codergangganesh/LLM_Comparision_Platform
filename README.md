This is a Next.js app that lets you compare responses from multiple AI models side‑by‑side using OpenRouter.

## Getting Started

1) Create `.env.local` and add:

```bash
OPENROUTER_API_KEY=your_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=AI Fiesta
```

2) Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Main files:

- `src/app/api/chat/route.ts`: server route that fans out requests to OpenRouter for selected models.
- `src/lib/models.ts`: registry of available models.
- `src/components/ModelColumn.tsx`: column UI for each model.
- `src/app/page.tsx`: main interface with universal input and columns.

Model IDs use OpenRouter syntax, e.g. `openai/gpt-5-chat`, `anthropic/claude-sonnet-4`, `google/gemini-2.5-pro`, `deepseek/deepseek-r1-0528`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
