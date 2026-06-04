import { NextResponse } from "next/server";
import { supabase, hasSupabase } from "@/lib/supabase";
import { getStore } from "@/lib/store";
import { CATEGORIES, AREAS, DEPARTMENTS } from "@/lib/data";

export const dynamic = "force-dynamic";

type R = {
  category: string;
  status: string;
  area: string;
  priority: string;
  upvotes: number;
  created_at?: string;
  createdAt?: number;
  timeline?: { label: string; at?: number }[];
};

export async function GET() {
  let rows: R[] = [];
  if (hasSupabase) {
    const { data } = await supabase.from("cityhelp_reports").select("*");
    rows = (data as R[]) || [];
  } else {
    rows = getStore().reports as unknown as R[];
  }

  const total = rows.length;
  const byStatus = { open: 0, progress: 0, resolved: 0 } as Record<string, number>;
  const byCategory: Record<string, number> = {};
  const byArea: Record<string, number> = {};
  const byDept: Record<string, number> = {};
  let totalUpvotes = 0;
  let resolvedCount = 0;
  let resolutionHoursSum = 0;
  let resolutionSamples = 0;

  for (const r of rows) {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
    byArea[r.area] = (byArea[r.area] || 0) + 1;
    const dept = DEPARTMENTS[r.category] || "General";
    byDept[dept] = (byDept[dept] || 0) + 1;
    totalUpvotes += r.upvotes || 0;

    if (r.status === "resolved") {
      resolvedCount++;
      const created = r.createdAt ?? (r.created_at ? new Date(r.created_at).getTime() : 0);
      const tl = r.timeline || [];
      const resolvedAt = tl.length ? tl[tl.length - 1].at : undefined;
      if (created && resolvedAt) {
        resolutionHoursSum += (resolvedAt - created) / 3600000;
        resolutionSamples++;
      }
    }
  }

  const categoryData = CATEGORIES.map((c) => ({
    name: c.label,
    id: c.id,
    value: byCategory[c.id] || 0,
  }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const areaData = AREAS.map((a) => ({ name: a, value: byArea[a] || 0 }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const deptData = Object.entries(byDept)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // synthetic 7-day trend from created_at (counts per day)
  const days: { label: string; reports: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    let count = 0;
    for (const r of rows) {
      const t = r.createdAt ?? (r.created_at ? new Date(r.created_at).getTime() : 0);
      const rd = new Date(t);
      if (`${rd.getFullYear()}-${rd.getMonth()}-${rd.getDate()}` === key) count++;
    }
    days.push({ label: d.toLocaleDateString([], { weekday: "short" }), reports: count });
  }

  const resolvedRate = total ? Math.round((byStatus.resolved / total) * 100) : 0;
  const avgResolutionHours = resolutionSamples
    ? Math.round(resolutionHoursSum / resolutionSamples)
    : 0;

  return NextResponse.json({
    total,
    byStatus,
    totalUpvotes,
    resolvedRate,
    avgResolutionHours,
    resolvedCount,
    categoryData,
    areaData,
    deptData,
    trend: days,
  });
}
