"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  ArrowLeft,
  ClipboardText,
  CheckCircle,
  Clock,
  ArrowFatUp,
  ChartLineUp,
} from "@phosphor-icons/react";
import Navbar from "../components/Navbar";
import { useTheme } from "@/lib/theme";

type Analytics = {
  total: number;
  byStatus: Record<string, number>;
  totalUpvotes: number;
  resolvedRate: number;
  avgResolutionHours: number;
  resolvedCount: number;
  categoryData: { name: string; value: number }[];
  areaData: { name: string; value: number }[];
  deptData: { name: string; value: number }[];
  trend: { label: string; reports: number }[];
};

export default function AnalyticsPage() {
  const [a, setA] = useState<Analytics | null>(null);
  const { resolved } = useTheme();
  const dark = resolved === "dark";
  const axisColor = dark ? "#93a7b2" : "#5b7081";
  const labelColor = dark ? "#eaf2f5" : "#0f2231";
  const gridColor = dark ? "#233138" : "#eef3f6";

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setA)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-[100dvh]">
      <Navbar />
      <main className="mx-auto max-w-[1180px] px-5 py-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--text-dim)] transition hover:text-[var(--text)]"
        >
          <ArrowLeft size={16} /> Back to reports
        </Link>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <ChartLineUp size={26} weight="bold" className="text-[var(--brand)]" /> City Analytics
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          How issues are reported, routed, and resolved across Hyderabad.
        </p>

        {!a ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-[var(--muted)]" />
            ))}
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi icon={ClipboardText} label="Total reports" value={a.total} color="var(--brand)" />
              <Kpi icon={CheckCircle} label="Resolved rate" value={`${a.resolvedRate}%`} color="var(--resolved)" />
              <Kpi
                icon={Clock}
                label="Avg resolution"
                value={a.avgResolutionHours ? `${a.avgResolutionHours}h` : "—"}
                color="var(--progress)"
              />
              <Kpi icon={ArrowFatUp} label="Total upvotes" value={a.totalUpvotes} color="var(--open)" />
            </div>

            {/* trend */}
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--text-dim)]">
                Reports over the last 7 days
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={a.trend} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={gridColor} vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${gridColor}`, fontSize: 12, background: dark ? "#131e24" : "#fff", color: labelColor }} />
                    <Area type="monotone" dataKey="reports" stroke="#0d9488" strokeWidth={2} fill="url(#g)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {/* category */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--text-dim)]">
                  Issues by category
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={a.categoryData} layout="vertical" margin={{ left: 28, right: 12 }}>
                      <XAxis type="number" hide allowDecimals={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: labelColor }} axisLine={false} tickLine={false} width={92} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${gridColor}`, fontSize: 12, background: dark ? "#131e24" : "#fff", color: labelColor }} cursor={{ fill: "rgba(13,148,136,0.08)" }} />
                      <Bar dataKey="value" fill="#0d9488" radius={[0, 6, 6, 0]} maxBarSize={22} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* area hotspots */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--text-dim)]">
                  Hotspots by area
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {a.areaData.map((d, i) => {
                    const max = a.areaData[0]?.value || 1;
                    return (
                      <li key={d.name} className="flex items-center gap-3">
                        <span className="w-5 text-xs text-[var(--text-dim)]">{i + 1}</span>
                        <span className="w-28 shrink-0 text-sm">{d.name}</span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--muted)]">
                          <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${(d.value / max) * 100}%` }} />
                        </div>
                        <span className="w-6 text-right text-sm font-medium">{d.value}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* departments */}
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--text-dim)]">
                Workload by department
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {a.deptData.map((d) => (
                  <div key={d.name} className="rounded-xl bg-[var(--muted)] p-3">
                    <div className="text-2xl font-bold">{d.value}</div>
                    <div className="text-xs text-[var(--text-dim)]">{d.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${color}1a`, color }}>
        <Icon size={18} weight="fill" />
      </span>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="text-xs text-[var(--text-dim)]">{label}</div>
    </div>
  );
}
