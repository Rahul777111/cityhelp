import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { supabase, hasSupabase } from "@/lib/supabase";
import { AREA_COORDS, DEPARTMENTS, type Report, type Status } from "@/lib/data";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  title: string;
  category: string;
  description: string;
  area: string;
  status: Status;
  priority: Report["priority"];
  upvotes: number;
  x: number;
  y: number;
  timeline: { label: string; at?: number }[];
  lat: number | null;
  lng: number | null;
  photo: string | null;
  department: string | null;
  reporter: string | null;
  created_at: string;
};

function rowToReport(r: Row): Report {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    description: r.description || "",
    area: r.area,
    status: r.status,
    priority: r.priority,
    upvotes: r.upvotes,
    x: r.x,
    y: r.y,
    lat: r.lat ?? 17.44,
    lng: r.lng ?? 78.43,
    photo: r.photo ?? null,
    department: r.department ?? null,
    reporter: r.reporter ?? "Resident",
    timeline: (r.timeline || []).map((t) => ({
      label: t.label,
      at: t.at ?? new Date(r.created_at).getTime(),
    })),
    createdAt: new Date(r.created_at).getTime(),
  };
}

function buildStats(all: Report[]) {
  const byStatus: Record<Status, number> = { open: 0, progress: 0, resolved: 0 };
  const byCategory: Record<string, number> = {};
  for (const r of all) {
    byStatus[r.status]++;
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
  }
  const resolvedRate = all.length ? Math.round((byStatus.resolved / all.length) * 100) : 0;
  return { total: all.length, byStatus, byCategory, resolvedRate };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const area = searchParams.get("area") || "";
  const sort = searchParams.get("sort") || "recent";

  let all: Report[] = [];

  if (hasSupabase) {
    const { data, error } = await supabase.from("cityhelp_reports").select("*");
    if (!error && data) {
      all = (data as Row[]).map(rowToReport);
    } else {
      all = getStore().reports;
    }
  } else {
    all = getStore().reports;
  }

  let reports = [...all];
  if (q)
    reports = reports.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q)
    );
  if (category) reports = reports.filter((r) => r.category === category);
  if (status) reports = reports.filter((r) => r.status === status);
  if (area) reports = reports.filter((r) => r.area === area);

  if (sort === "top") reports.sort((a, b) => b.upvotes - a.upvotes);
  else reports.sort((a, b) => b.createdAt - a.createdAt);

  return NextResponse.json({ reports, stats: buildStats(all) });
}

export async function POST(req: Request) {
  let body: Partial<Report>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body.title || !body.category || !body.area) {
    return NextResponse.json(
      { error: "Title, category, and area are required" },
      { status: 400 }
    );
  }

  const coords = AREA_COORDS[body.area] || { lat: 17.44, lng: 78.43 };
  // small jitter so multiple reports in one area do not stack exactly
  const jitter = () => (Math.random() - 0.5) * 0.012;
  const base = {
    title: body.title,
    category: body.category,
    description: body.description || "",
    area: body.area,
    status: "open" as Status,
    priority: (body.priority as Report["priority"]) || "medium",
    upvotes: 1,
    x: typeof body.x === "number" ? body.x : Math.round(Math.random() * 80 + 10),
    y: typeof body.y === "number" ? body.y : Math.round(Math.random() * 70 + 12),
    lat: coords.lat + jitter(),
    lng: coords.lng + jitter(),
    photo: `/issues/${body.category}.jpg`,
    department: DEPARTMENTS[body.category] || "General",
    reporter: (body.reporter as string) || "Resident",
    timeline: [{ label: "Reported", at: Date.now() }],
  };

  if (hasSupabase) {
    const { data, error } = await supabase
      .from("cityhelp_reports")
      .insert({ ...base, timeline: base.timeline })
      .select("*")
      .single();
    if (!error && data) {
      return NextResponse.json({ report: rowToReport(data as Row) });
    }
    // fall through to in-memory on error
  }

  const store = getStore();
  const report: Report = {
    id: "u-" + Math.random().toString(36).slice(2, 9),
    createdAt: Date.now(),
    ...base,
  };
  store.reports.unshift(report);
  return NextResponse.json({ report });
}
