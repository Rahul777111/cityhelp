"use client";

import {
  RoadHorizon,
  Lightbulb,
  Trash,
  Drop,
  Waves,
  Lightning,
  TrafficSignal,
  Tree,
  MapPin,
} from "@phosphor-icons/react";
import type { Status } from "@/lib/data";

const CAT_ICON: Record<string, React.ElementType> = {
  pothole: RoadHorizon,
  streetlight: Lightbulb,
  garbage: Trash,
  water: Drop,
  drainage: Waves,
  electricity: Lightning,
  traffic: TrafficSignal,
  park: Tree,
};

export function CategoryIcon({ category, size = 18 }: { category: string; size?: number }) {
  const Icon = CAT_ICON[category] || MapPin;
  return <Icon size={size} weight="bold" />;
}

export const STATUS_META: Record<Status, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "#b45309", bg: "#fef3c7" },
  progress: { label: "In progress", color: "#1d4ed8", bg: "#dbeafe" },
  resolved: { label: "Resolved", color: "#047857", bg: "#d1fae5" },
};

export function StatusBadge({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color: m.color, background: m.bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
      {m.label}
    </span>
  );
}

export function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
