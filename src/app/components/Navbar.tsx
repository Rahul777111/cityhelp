"use client";

import { Buildings, GithubLogo, Plus } from "@phosphor-icons/react";

export default function Navbar({ onReport }: { onReport: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--brand)] text-white">
            <Buildings size={20} weight="fill" />
          </span>
          <div className="leading-tight">
            <div className="font-bold tracking-tight">CityHelp</div>
            <div className="text-[11px] text-[var(--text-dim)]">Hyderabad</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReport}
            className="flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--brand-dark)] active:scale-[0.97]"
          >
            <Plus size={16} weight="bold" /> Report
          </button>
          <a
            href="https://github.com/Rahul777111"
            target="_blank"
            rel="noreferrer"
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--text-dim)] transition hover:text-[var(--text)]"
            title="GitHub"
          >
            <GithubLogo size={18} weight="fill" />
          </a>
        </div>
      </div>
    </header>
  );
}
