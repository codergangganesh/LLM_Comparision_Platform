"use client";
import { useState } from "react";

export type ModelColumnProps = {
  modelLabel: string;
  modelId: string;
  loading?: boolean;
  response?: string;
  onCopy?: () => void;
  onPickBest?: () => void;
};

export default function ModelColumn(props: ModelColumnProps) {
  const { modelLabel, modelId, loading, response, onCopy, onPickBest } = props;
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!response) return;
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
    onCopy?.();
  }

  return (
    <div className="flex flex-col h-[360px] border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/70">
        <div className="text-sm text-zinc-200 font-medium truncate" title={modelId}>{modelLabel}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!response}
            className="text-xs px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={onPickBest}
            disabled={!response}
            className="text-xs px-2 py-1 rounded-md bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40"
          >
            Pick Best
          </button>
        </div>
      </div>
      <div className="flex-1 p-3 overflow-auto">
        {loading ? (
          <div className="text-zinc-400 text-sm">Thinking…</div>
        ) : response ? (
          <pre className="whitespace-pre-wrap text-sm text-zinc-100 leading-6">{response}</pre>
        ) : (
          <div className="text-zinc-500 text-sm">No response yet.</div>
        )}
      </div>
    </div>
  );
}


