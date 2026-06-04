"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  MagnifyingGlass,
  ArrowFatUp,
  ClipboardText,
  CheckCircle,
  Spinner,
  Phone,
  CaretRight,
} from "@phosphor-icons/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import ReportForm from "./components/ReportForm";
import { AreasStrip, ImpactWall } from "./components/DiscoverSections";
import LandingHero from "./components/LandingHero";
import { useReportsRealtime } from "@/lib/useRealtime";
import { CategoryIcon, StatusBadge, timeAgo, STATUS_META } from "./components/shared";
import { CATEGORIES, AREAS, SERVICES, type Report, type Status } from "@/lib/data";

// Leaflet must be client-only (no SSR)
const LeafletMap = dynamic(() => import("./components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/11] w-full animate-pulse rounded-2xl bg-[var(--muted)]" />
  ),
});

type Stats = {
  total: number;
  byStatus: Record<Status, number>;
  byCategory: Record<string, number>;
  resolvedRate: number;
};

const TABS = ["Issues", "Map", "Services"] as const;

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Issues");
  const [showForm, setShowForm] = useState(false);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [area, setArea] = useState("");
  const [sort, setSort] = useState("recent");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [voted, setVoted] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (area) params.set("area", area);
    params.set("sort", sort);
    const res = await fetch(`/api/reports?${params}`);
    const json = await res.json();
    setReports(json.reports || []);
    setStats(json.stats || null);
    setLoading(false);
  }, [q, category, status, area, sort]);

  useEffect(() => {
    load();
  }, [load]);

  // live updates: when any report is inserted/updated/upvoted, refresh
  useReportsRealtime(() => load());

  const upvote = async (id: string) => {
    if (voted.has(id)) return;
    setVoted((s) => new Set(s).add(id));
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r)));
    try {
      await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upvote" }),
      });
    } catch {
      /* optimistic; ignore */
    }
  };

  const statusData = stats
    ? (Object.keys(stats.byStatus) as Status[]).map((s) => ({
        name: STATUS_META[s].label,
        value: stats.byStatus[s],
        color: STATUS_META[s].color,
      }))
    : [];

  const catData = stats
    ? CATEGORIES.map((c) => ({ name: c.label, value: stats.byCategory[c.id] || 0 })).filter(
        (d) => d.value > 0
      )
    : [];

  return (
    <div className="min-h-[100dvh]">
      <Navbar onReport={() => setShowForm(true)} />

      <LandingHero
        onReport={() => setShowForm(true)}
        onExplore={() => {
          setTab("Map");
          document
            .getElementById("dashboard")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      {/* dashboard */}
      <section id="dashboard" className="scroll-mt-20 border-b border-[var(--border)] bg-gradient-to-b from-[var(--brand-soft)]/40 to-transparent">
        <div className="mx-auto max-w-[1180px] px-5 py-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Your city, working better together.
          </h2>
          <p className="mt-1.5 max-w-xl text-sm text-[var(--text-dim)]">
            Report issues, rally support with upvotes, track resolutions, and find every city
            service in one place.
          </p>

          {/* stat cards + charts */}
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr]">
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={ClipboardText} label="Total reports" value={stats?.total ?? 0} color="var(--brand)" />
              <StatCard icon={Spinner} label="In progress" value={stats?.byStatus.progress ?? 0} color="var(--progress)" />
              <StatCard icon={CheckCircle} label="Resolved" value={stats?.byStatus.resolved ?? 0} color="var(--resolved)" />
              <StatCard icon={ArrowFatUp} label="Resolved rate" value={`${stats?.resolvedRate ?? 0}%`} color="var(--open)" />
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">
                By status
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-28 w-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} dataKey="value" innerRadius={32} outerRadius={52} paddingAngle={2} stroke="none">
                        {statusData.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="flex flex-col gap-1.5 text-sm">
                  {statusData.map((d) => (
                    <li key={d.name} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                      {d.name} <span className="text-[var(--text-dim)]">· {d.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">
                By category
              </h3>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={catData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <XAxis dataKey="name" tick={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#5b7081" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: "1px solid #e1e8ee", fontSize: 12 }}
                      cursor={{ fill: "rgba(13,148,136,0.08)" }}
                    />
                    <Bar dataKey="value" fill="var(--brand)" radius={[4, 4, 0, 0]} maxBarSize={26} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* tabs */}
      <div className="sticky top-16 z-30 border-b border-[var(--border)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] gap-1 px-5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative px-4 py-3 text-sm font-medium transition"
              style={{ color: tab === t ? "var(--brand)" : "var(--text-dim)" }}
            >
              {t}
              {tab === t && (
                <motion.span layoutId="tab-underline" className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--brand)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-[1180px] px-5 py-6">
        <AnimatePresence mode="wait">
          {tab === "Issues" && (
            <motion.div key="issues" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* filters */}
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 focus-within:border-[var(--brand)]">
                  <MagnifyingGlass size={16} className="text-[var(--text-dim)]" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search reports..."
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                <Select value={status} onChange={setStatus} placeholder="All statuses" options={[["open", "Open"], ["progress", "In progress"], ["resolved", "Resolved"]]} />
                <Select value={category} onChange={setCategory} placeholder="All categories" options={CATEGORIES.map((c) => [c.id, c.label] as [string, string])} />
                <Select value={area} onChange={setArea} placeholder="All areas" options={AREAS.map((a) => [a, a] as [string, string])} />
                <Select value={sort} onChange={setSort} placeholder="Recent" options={[["recent", "Recent"], ["top", "Most upvoted"]]} />
              </div>

              {loading ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-32 animate-pulse rounded-2xl bg-[var(--muted)]" />
                  ))}
                </div>
              ) : reports.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-[var(--text-dim)]">
                  No reports match these filters.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {reports.map((r) => (
                    <ReportCard key={r.id} report={r} onUpvote={upvote} voted={voted.has(r.id)} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === "Map" && (
            <motion.div key="map" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
              <LeafletMap reports={reports} activeId={activeId} onSelect={setActiveId} />
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--text-dim)]">
                    {activeId ? "Selected report" : "Tap a pin to view a report"}
                  </h3>
                  <span className="flex items-center gap-1.5 text-xs text-[var(--resolved)]">
                    <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--resolved)] opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--resolved)]" /></span>
                    Live
                  </span>
                </div>
                {(activeId ? reports.filter((r) => r.id === activeId) : reports.slice(0, 4)).map((r) => (
                  <ReportCard key={r.id} report={r} onUpvote={upvote} voted={voted.has(r.id)} compact />
                ))}
              </div>
            </motion.div>
          )}

          {tab === "Services" && (
            <motion.div key="services" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {["Emergency", "Utilities", "Support"].map((group) => (
                <div key={group} className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-dim)]">
                    {group}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {SERVICES.filter((s) => s.group === group).map((s) => (
                      <a
                        key={s.name}
                        href={`tel:${s.number}`}
                        className="group flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--brand)] hover:shadow-sm"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand-dark)]">
                          <Phone size={20} weight="fill" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{s.name}</span>
                            <span className="mono text-sm text-[var(--brand)]">{s.number}</span>
                          </div>
                          <p className="truncate text-xs text-[var(--text-dim)]">{s.desc}</p>
                        </div>
                        <CaretRight size={16} className="text-[var(--text-dim)] transition group-hover:translate-x-0.5" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AreasStrip />
      <ImpactWall />

      <AnimatePresence>
        {showForm && (
          <ReportForm
            onClose={() => setShowForm(false)}
            onCreated={() => {
              setShowForm(false);
              load();
            }}
          />
        )}
      </AnimatePresence>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-[var(--text-dim)]">
          <span>Built by D L Narayana</span>
          <span className="mono text-xs">Next.js · API Routes · Recharts · Motion</span>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
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

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
    >
      <option value="">{placeholder}</option>
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
}

function ReportCard({
  report,
  onUpvote,
  voted,
  compact,
}: {
  report: Report;
  onUpvote: (id: string) => void;
  voted: boolean;
  compact?: boolean;
}) {
  const cat = CATEGORIES.find((c) => c.id === report.category);
  return (
    <motion.div
      layout
      className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
    >
      {!compact && report.photo && (
        <Link href={`/report/${report.id}`} className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={report.photo} alt={report.title} className="h-40 w-full object-cover" />
        </Link>
      )}
      <div className="flex flex-col p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand-dark)]">
          <CategoryIcon category={report.category} size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/report/${report.id}`} className="font-semibold leading-snug hover:text-[var(--brand)]">{report.title}</Link>
            <StatusBadge status={report.status} />
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-[var(--text-dim)]">
            <span>{cat?.label}</span>
            <span>·</span>
            <span>{report.area}</span>
            <span>·</span>
            <span>{timeAgo(report.createdAt)}</span>
          </div>
        </div>
      </div>

      {!compact && report.description && (
        <p className="mt-2.5 line-clamp-2 text-sm text-[var(--text-dim)]">{report.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => onUpvote(report.id)}
          disabled={voted}
          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition active:scale-95"
          style={{
            borderColor: voted ? "var(--brand)" : "var(--border)",
            background: voted ? "var(--brand-soft)" : "transparent",
            color: voted ? "var(--brand-dark)" : "var(--text)",
          }}
        >
          <ArrowFatUp size={15} weight={voted ? "fill" : "regular"} /> {report.upvotes}
        </button>
        <Link href={`/report/${report.id}`} className="text-xs font-medium text-[var(--brand)] hover:underline">
          View details
        </Link>
      </div>
      <span
        className="sr-only"
        style={{
          color: report.priority === "high" ? "var(--danger)" : "var(--text-dim)",
        }}
      >
          {report.priority} priority
        </span>
      </div>
    </motion.div>
  );
}
