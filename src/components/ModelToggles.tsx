"use client";
import { AVAILABLE_MODELS } from "@/lib/models";

type Props = { selected: string[]; onToggle: (id: string) => void };

export default function ModelToggles({ selected, onToggle }: Props) {
  return (
    <div className="flex gap-3 flex-wrap">
      {AVAILABLE_MODELS.map((m) => {
        const active = selected.includes(m.id);
        return (
          <button
            key={m.id}
            onClick={() => onToggle(m.id)}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 border ${
              active
                ? "bg-zinc-900 border-zinc-700"
                : "bg-transparent border-zinc-800 hover:bg-zinc-900"
            }`}
            title={m.id}
          >
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${active ? "bg-indigo-600 border-indigo-500" : "bg-zinc-900 border-zinc-700"}`}>
              <span className={`w-3 h-3 rounded-sm ${active ? "bg-white" : "bg-zinc-700"}`} />
            </span>
            <span className="text-zinc-200 font-medium">{m.label}</span>
            {active && <span className="text-xs text-zinc-400">★</span>}
          </button>
        );
      })}
    </div>
  );
}


