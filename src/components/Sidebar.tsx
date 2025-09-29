"use client";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-[240px] shrink-0 border-r border-zinc-900 bg-zinc-950 h-screen sticky top-0">
      <div className="p-3 border-b border-zinc-900">
        <div className="text-lg font-semibold">AI Fiesta</div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <button className="w-full text-left px-3 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-sm">+ New Chat</button>
        <button className="w-full text-left px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm">New Project</button>
      </div>
      <div className="px-3 py-2 text-xs text-zinc-500">Recent</div>
      <div className="px-3 flex-1 overflow-auto">
        <ul className="text-sm text-zinc-300 space-y-2">
          <li className="truncate hover:text-white cursor-pointer">How to learn Tailwind?</li>
          <li className="truncate hover:text-white cursor-pointer">Explain quantum computing…</li>
          <li className="truncate hover:text-white cursor-pointer">Best restaurants in Paris</li>
        </ul>
      </div>
      <div className="p-3 border-t border-zinc-900">
        <div className="flex items-center justify-between">
          <div className="text-xs text-zinc-400">kit27.art303@gmail…</div>
          <div className="w-6 h-6 rounded-full bg-zinc-800" />
        </div>
      </div>
    </aside>
  );
}


