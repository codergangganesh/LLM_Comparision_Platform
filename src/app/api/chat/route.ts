import { NextRequest } from "next/server";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
type MultiChatBody = { models: string[]; messages: ChatMessage[]; maxTokens?: number; temperature?: number };

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing OPENROUTER_API_KEY" }), { status: 500 });
  }

  const body = (await req.json()) as MultiChatBody;
  if (!Array.isArray(body.models) || body.models.length === 0) {
    return new Response(JSON.stringify({ error: "models[] required" }), { status: 400 });
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages[] required" }), { status: 400 });
  }

  try {
    const requests = body.models.map(async (modelId) => {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "AI Fiesta",
        },
        body: JSON.stringify({
          model: modelId,
          messages: body.messages,
          max_tokens: body.maxTokens ?? 1024,
          temperature: body.temperature ?? 0.7,
          stream: false,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        return { model: modelId, error: text || `HTTP ${res.status}` };
      }
      const json = await res.json();
      const content: string = json.choices?.[0]?.message?.content ?? "";
      return { model: modelId, content };
    });

    const results = await Promise.all(requests);
    return Response.json({ results });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err?.message || err) }), { status: 500 });
  }
}


