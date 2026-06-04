"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X, PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react";
import { CATEGORIES, AREAS, type Report } from "@/lib/data";
import { CategoryIcon } from "./shared";

export default function ReportForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (r: Report) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("pothole");
  const [area, setArea] = useState(AREAS[0]);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!title.trim()) {
      setError("Please add a short title.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), category, area, priority, description }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not submit report.");
      } else {
        setDone(true);
        setTimeout(() => onCreated(json.report), 900);
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setBusy(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-base font-semibold">Report an issue</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-dim)] hover:bg-[var(--muted)]">
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
            <CheckCircle size={44} weight="fill" className="text-[var(--resolved)]" />
            <p className="font-medium">Report submitted</p>
            <p className="text-sm text-[var(--text-dim)]">Thanks for helping improve your city.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-5 py-5">
            <Field label="Title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pothole near the bus stop"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]"
              />
            </Field>

            <Field label="Category">
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((c) => {
                  const active = category === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className="flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[11px] transition"
                      style={{
                        borderColor: active ? "var(--brand)" : "var(--border)",
                        background: active ? "var(--brand-soft)" : "var(--surface)",
                        color: active ? "var(--brand-dark)" : "var(--text-dim)",
                      }}
                    >
                      <CategoryIcon category={c.id} size={18} />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Area">
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]"
                >
                  {AREAS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </Field>
              <Field label="Priority">
                <div className="flex gap-1.5">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className="flex-1 rounded-xl border px-2 py-2.5 text-xs capitalize transition"
                      style={{
                        borderColor: priority === p ? "var(--brand)" : "var(--border)",
                        background: priority === p ? "var(--brand-soft)" : "var(--surface)",
                        color: priority === p ? "var(--brand-dark)" : "var(--text-dim)",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Add any details that would help the city team."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]"
              />
            </Field>

            {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

            <button
              onClick={submit}
              disabled={busy}
              className="flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] py-3 font-medium text-white transition hover:bg-[var(--brand-dark)] active:scale-[0.99] disabled:opacity-60"
            >
              <PaperPlaneTilt size={17} weight="fill" /> {busy ? "Submitting..." : "Submit report"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[var(--text-dim)]">{label}</span>
      {children}
    </label>
  );
}
