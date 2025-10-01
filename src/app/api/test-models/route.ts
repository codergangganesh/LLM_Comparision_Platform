import { NextRequest } from "next/server";
import { AVAILABLE_MODELS } from "@/lib/models";

export async function GET() {
  const models = AVAILABLE_MODELS.map(model => ({
    id: model.id,
    label: model.label,
    provider: model.provider,
    description: model.description,
    capabilities: model.capabilities,
    isFree: model.id.includes(':free') || !model.id.includes('/') || model.id.includes('openrouter/auto')
  }));

  return Response.json({
    models,
    count: models.length,
    message: "Available models for AI Fiesta"
  });
}