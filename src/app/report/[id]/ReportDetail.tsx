"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowFatUp,
  MapPin,
  Buildings,
  User,
  CheckCircle,
  PaperPlaneTilt,
  ShieldCheck,
  ChatCircle,
  CalendarBlank,
} from "@phosphor-icons/react";
import { CategoryIcon, StatusBadge, timeAgo, STATUS_META } from "../../components/shared";
import { CATEGORIES, type Report, type Status } from "@/lib/data";

type Comment = {
  id: string;
  author: string;
  role: "resident" | "official";
  body: string;
  created_at: string;
};

const STEPS: { key: Status; label: string }[] = [
  { key: "open", label: "Reported" },
  { key: "progress", label: "In progress" },
  { key: "resolved", label: "Resolved" },
];

export default function ReportDetail({ id }: { id: string }) {
  const [report, setReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    const [rRes, cRes] = await Promise.all([
      fetch(`/api/reports/${id}`),
      fetch(`/api/reports/${id}/comments`),
    ]);
    if (rRes.ok) {
      const j = await rRes.json();
      setReport(j.report);
    } else {
      setNotFound(true);
    }
    if (cRes.ok) {
      const j = await cRes.json();
      setComments(j.comments || []);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const upvote = async () => {
    if (upvoted || !report) return;
    setUpvoted(true);
    setReport({ ...report, upvotes: report.upvotes + 1 });
    await fetch(`/api/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upvote" }),
    });
  };

  const postComment = async () => {
    if (!body.trim()) return;
    setPosting(true);
    const res = await fetch(`/api/reports/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: name.trim() || "Resident", body: body.trim() }),
    });
    if (res.ok) {
      const j = await res.json();
      setComments((c) => [...c, j.comment]);
      setBody("");
    }
    setPosting(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[900px] px-5 py-10">
        <div className="h-72 animate-pulse rounded-2xl bg-[var(--muted)]" />
      </div>
    );
  }
  if (notFound || !report) {
    return (
      <div className="mx-auto max-w-[900px] px-5 py-20 text-center">
        <p className="text-[var(--text-dim)]">Report not found.</p>
        <Link href="/" className="mt-4 inline-block text-[var(--brand)]">
          Back to CityHelp
        </Link>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.id === report.category);
  const currentStep = report.status === "open" ? 0 : report.status === "progress" ? 1 : 2;

  return (
    <div className="mx-auto max-w-[900px] px-5 py-6">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--text-dim)] transition hover:text-[var(--text)]"
      >
        <ArrowLeft size={16} /> All reports
      </Link>

      {report.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={report.photo}
          alt={report.title}
          className="mb-5 h-64 w-full rounded-2xl object-cover sm:h-80"
        />
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand-dark)]">
            <CategoryIcon category={report.category} size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{report.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-[var(--text-dim)]">
              <span>{cat?.label}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {report.area}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <CalendarBlank size={13} /> {timeAgo(report.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <StatusBadge status={report.status} />
      </div>

      {/* progress tracker */}
      <div className="mt-6 flex items-center">
        {STEPS.map((s, i) => {
          const done = i <= currentStep;
          return (
            <div key={s.key} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <span
                  className="grid h-8 w-8 place-items-center rounded-full text-xs font-semibold"
                  style={{
                    background: done ? STATUS_META[s.key].color : "var(--muted)",
                    color: done ? "#fff" : "var(--text-dim)",
                  }}
                >
                  {done ? <CheckCircle size={16} weight="fill" /> : i + 1}
                </span>
                <span className="mt-1 text-[11px] text-[var(--text-dim)]">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="mx-1 mb-4 h-0.5 flex-1"
                  style={{ background: i < currentStep ? STATUS_META[report.status].color : "var(--border)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="leading-relaxed text-[var(--text)]">{report.description || "No description provided."}</p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={upvote}
              disabled={upvoted}
              className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95"
              style={{
                borderColor: upvoted ? "var(--brand)" : "var(--border)",
                background: upvoted ? "var(--brand-soft)" : "transparent",
                color: upvoted ? "var(--brand-dark)" : "var(--text)",
              }}
            >
              <ArrowFatUp size={16} weight={upvoted ? "fill" : "regular"} /> {report.upvotes} upvotes
            </button>
            <span
              className="rounded-md px-2.5 py-1 text-xs font-medium capitalize"
              style={{ color: report.priority === "high" ? "var(--danger)" : "var(--text-dim)" }}
            >
              {report.priority} priority
            </span>
          </div>

          {/* comments / updates */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ChatCircle size={20} /> Updates & discussion
              <span className="text-sm font-normal text-[var(--text-dim)]">({comments.length})</span>
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              {comments.length === 0 && (
                <p className="text-sm text-[var(--text-dim)]">No updates yet. Be the first to add context.</p>
              )}
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="grid h-7 w-7 place-items-center rounded-full text-xs font-semibold text-white"
                      style={{ background: c.role === "official" ? "var(--brand)" : "#94a3b8" }}
                    >
                      {c.role === "official" ? <ShieldCheck size={14} weight="fill" /> : c.author[0]?.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium">{c.author}</span>
                    {c.role === "official" && (
                      <span className="rounded-md bg-[var(--brand-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--brand-dark)]">
                        Official
                      </span>
                    )}
                    <span className="ml-auto text-xs text-[var(--text-dim)]">{timeAgo(new Date(c.created_at).getTime())}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text)]">{c.body}</p>
                </div>
              ))}
            </div>

            {/* add comment */}
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="mb-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={2}
                placeholder="Add an update or comment..."
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={postComment}
                  disabled={posting || !body.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--brand-dark)] active:scale-[0.98] disabled:opacity-50"
                >
                  <PaperPlaneTilt size={15} weight="fill" /> {posting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* sidebar: handling info + timeline */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">
              Handling
            </h3>
            <Row icon={Buildings} label="Department" value={report.department || "General"} />
            <Row icon={User} label="Reported by" value={report.reporter || "Resident"} />
            <Row icon={MapPin} label="Area" value={report.area} />
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">
              Timeline
            </h3>
            <ol className="flex flex-col gap-3">
              {report.timeline.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />
                    {i < report.timeline.length - 1 && <span className="my-0.5 w-0.5 flex-1 bg-[var(--border)]" />}
                  </div>
                  <div className="-mt-1">
                    <div className="text-sm font-medium">{t.label}</div>
                    <div className="text-xs text-[var(--text-dim)]">{timeAgo(t.at)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-[var(--border)] py-2 last:border-0">
      <Icon size={16} className="text-[var(--text-dim)]" />
      <span className="text-xs text-[var(--text-dim)]">{label}</span>
      <span className="ml-auto text-sm font-medium">{value}</span>
    </div>
  );
}
