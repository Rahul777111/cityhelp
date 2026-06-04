"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Buildings,
  ChartLineUp,
  GithubLogo,
  Plus,
  User,
  SignOut,
  CaretDown,
  MapTrifold,
} from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth";
import { useUI } from "@/lib/ui";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar({ onReport }: { onReport?: () => void }) {
  const { user, isGuest, displayName, signOut } = useAuth();
  const { openAuth } = useUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleReport = () => {
    if (onReport) onReport();
    else window.location.href = "/?report=1";
  };

  const signedIn = Boolean(user) || isGuest;
  const initial = (displayName || "G").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--brand)] text-white">
            <Buildings size={20} weight="fill" />
          </span>
          <div className="leading-tight">
            <div className="font-bold tracking-tight text-[var(--text)]">
              CityHelp
            </div>
            <div className="text-[11px] text-[var(--text-dim)]">Hyderabad</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/analytics"
            className="hidden items-center gap-1.5 rounded-full border border-[var(--border)] px-3.5 py-2 text-sm font-medium text-[var(--text-dim)] transition hover:text-[var(--text)] sm:flex"
          >
            <ChartLineUp size={16} weight="bold" /> Analytics
          </Link>
          <button
            onClick={handleReport}
            className="flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--brand-dark)] active:scale-[0.97]"
          >
            <Plus size={16} weight="bold" /> Report
          </button>

          <ThemeSwitcher />

          {signedIn ? (
            <div ref={ref} className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full border border-[var(--border)] py-1 pl-1 pr-2.5 text-sm font-medium text-[var(--text)] transition hover:shadow-md"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">
                  {initial}
                </span>
                <span className="hidden max-w-[6rem] truncate sm:inline">
                  {displayName}
                </span>
                <CaretDown size={12} />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 z-50 w-52 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow)]"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-[var(--text)]">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-[var(--text-dim)]">
                        {user?.email || "Guest session"}
                      </p>
                    </div>
                    <div className="my-1 h-px bg-[var(--border)]" />
                    <Link
                      href="/analytics"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--muted)]"
                    >
                      <ChartLineUp size={16} /> Analytics
                    </Link>
                    <Link
                      href="/?map=1"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--muted)]"
                    >
                      <MapTrifold size={16} /> City map
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--brand)] transition hover:bg-[var(--muted)]"
                    >
                      <SignOut size={16} /> {user ? "Log out" : "Exit guest"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={openAuth}
              className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3.5 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--muted)]"
            >
              <User size={16} weight="fill" /> Log in
            </button>
          )}

          <a
            href="https://github.com/Rahul777111"
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--text-dim)] transition hover:text-[var(--text)] sm:grid"
            title="GitHub"
          >
            <GithubLogo size={18} weight="fill" />
          </a>
        </div>
      </div>
    </header>
  );
}
