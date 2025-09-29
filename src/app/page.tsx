"use client";
import { useMemo, useState } from "react";
import { AVAILABLE_MODELS } from "@/lib/models";
import ModelColumn from "@/components/ModelColumn";
import Sidebar from "@/components/Sidebar";
import ModelToggles from "@/components/ModelToggles";
import Composer from "@/components/Composer";

type Result = { model: string; content?: string; error?: string };

export default function Home() {
  const [selected, setSelected] = useState<string[]>([
    AVAILABLE_MODELS[0]?.id,
    AVAILABLE_MODELS[1]?.id,
    AVAILABLE_MODELS[2]?.id,
  ].filter(Boolean) as string[]);
  const [question, setQuestion] = useState("");
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [bestModel, setBestModel] = useState<string | null>(null);

  const modelMap = useMemo(() => {
    const map: Record<string, { label: string }> = {};
    AVAILABLE_MODELS.forEach((m) => (map[m.id] = { label: m.label }));
    return map;
  }, []);

  async function sendToAll() {
    const q = question.trim();
    if (!q || selected.length === 0) return;

    const nextLoading: Record<string, boolean> = {};
    selected.forEach((m) => (nextLoading[m] = true));
    setLoadingMap(nextLoading);
    setResponses({});
    setBestModel(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          models: selected,
          messages: [{ role: "user", content: q }],
        }),
      });
      const data: { results: Result[]; error?: string } = await res.json();
      if (data?.results) {
        const map: Record<string, string> = {};
        data.results.forEach((r) => {
          map[r.model] = r.error ? `Error: ${r.error}` : (r.content ?? "");
        });
        setResponses(map);
      }
    } catch (e: any) {
      const msg = String(e?.message || e);
      const map: Record<string, string> = {};
      selected.forEach((m) => (map[m] = `Error: ${msg}`));
      setResponses(map);
    } finally {
      const done: Record<string, boolean> = {};
      selected.forEach((m) => (done[m] = false));
      setLoadingMap(done);
    }
  }

  function toggleModel(id: string) {
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((m) => m !== id) : [...cur, id]
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0">
          <div className="max-w-[1100px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="font-semibold tracking-tight">ChatGPT</div>
              <div className="w-4 h-4 rounded-full bg-indigo-600" />
              <div className="font-semibold tracking-tight">Claude</div>
              <div className="w-4 h-4 rounded-full bg-indigo-600" />
              <div className="font-semibold tracking-tight">Gemini</div>
            </div>
            <a className="underline text-zinc-400 text-xs" href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">OpenRouter</a>
          </div>
        </div>
        <main className="max-w-[1100px] mx-auto w-full flex-1 flex flex-col gap-4 p-4">
          <ModelToggles selected={selected} onToggle={toggleModel} />

          <section className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.max(selected.length, 1)}, minmax(0, 1fr))` }}>
          {selected.map((id) => (
            <ModelColumn
              key={id}
              modelId={id}
              modelLabel={modelMap[id]?.label || id}
              loading={!!loadingMap[id]}
              response={responses[id]}
              onPickBest={() => setBestModel(id)}
            />
          ))}
          {selected.length === 0 && (
            <div className="text-sm text-zinc-500 border border-dashed border-zinc-800 rounded-lg p-6">
              Select at least one model to begin.
            </div>
          )}
          </section>

          {bestModel && (
            <section className="rounded-lg border border-amber-700 bg-amber-950/30 p-3">
              <div className="text-xs text-amber-400 mb-2">Picked best: {modelMap[bestModel]?.label || bestModel}</div>
              <pre className="whitespace-pre-wrap text-sm text-amber-50 leading-6">{responses[bestModel]}</pre>
            </section>
          )}

          <Composer
            value={question}
            onChange={setQuestion}
            onSubmit={sendToAll}
            disabled={!question.trim() || selected.length === 0}
          />
        </main>
      </div>
    </div>
  );
}
