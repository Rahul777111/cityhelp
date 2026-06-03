"use client";

import { motion } from "motion/react";
import type { Report } from "@/lib/data";
import { STATUS_META } from "./shared";

export default function CityMap({
  reports,
  activeId,
  onSelect,
}: {
  reports: Report[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[#e8f0ee]">
      {/* stylized streets */}
      <svg viewBox="0 0 160 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <rect width="160" height="100" fill="#e8f0ee" />
        {/* river */}
        <path d="M0 70 Q 40 60 70 74 T 160 66 L160 100 L0 100 Z" fill="#cfe6e2" opacity="0.7" />
        {/* blocks */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 24 + 8} y1="0" x2={i * 24 + 8} y2="100" stroke="#d4e0dc" strokeWidth="0.6" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 22 + 8} x2="160" y2={i * 22 + 8} stroke="#d4e0dc" strokeWidth="0.6" />
        ))}
        {/* a couple of green parks */}
        <rect x="18" y="14" width="16" height="12" rx="2" fill="#bfe3c8" />
        <rect x="118" y="40" width="20" height="14" rx="2" fill="#bfe3c8" />
      </svg>

      {/* pins */}
      {reports.map((r) => {
        const m = STATUS_META[r.status];
        const active = r.id === activeId;
        return (
          <motion.button
            key={r.id}
            onClick={() => onSelect?.(r.id)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
            title={r.title}
          >
            <span
              className="grid h-5 w-5 place-items-center rounded-full border-2 border-white shadow-md transition"
              style={{
                background: m.color,
                transform: active ? "scale(1.5)" : "scale(1)",
                boxShadow: active ? `0 0 0 6px ${m.bg}` : undefined,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </motion.button>
        );
      })}

      {/* legend */}
      <div className="absolute bottom-3 left-3 flex gap-3 rounded-lg bg-white/90 px-3 py-2 text-xs shadow">
        {(["open", "progress", "resolved"] as const).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_META[s].color }} />
            {STATUS_META[s].label}
          </span>
        ))}
      </div>
    </div>
  );
}
