"use client";
import { FormEvent } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export default function Composer({ value, onChange, onSubmit, disabled }: Props) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!disabled) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-800 bg-[#0b0615] p-2">
      <div className="flex items-center gap-2 bg-[#1a1230] rounded-lg px-3">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask me anything… (Press Enter to send)"
          className="flex-1 bg-transparent outline-none py-3 text-sm text-zinc-100 placeholder:text-zinc-500"
        />
        <div className="flex items-center gap-2">
          <button type="button" className="text-xs px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">Generate Image</button>
          <button type="button" className="text-xs px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">Attach Files</button>
          <button type="submit" disabled={disabled} className="px-3 py-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40">
            ▶
          </button>
        </div>
      </div>
    </form>
  );
}


