import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import type { Report, Status } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const area = searchParams.get("area") || "";
  const sort = searchParams.get("sort") || "recent";

  const store = getStore();
  let reports = [...store.reports];

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

  // stats over the full store (not filtered)
  const all = store.reports;
  const byStatus: Record<Status, number> = { open: 0, progress: 0, resolved: 0 };
  const byCategory: Record<string, number> = {};
  for (const r of all) {
    byStatus[r.status]++;
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
  }
  const resolvedRate = all.length ? Math.round((byStatus.resolved / all.length) * 100) : 0;

  return NextResponse.json({
    reports,
    stats: { total: all.length, byStatus, byCategory, resolvedRate },
  });
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
  const store = getStore();
  const report: Report = {
    id: "u-" + Math.random().toString(36).slice(2, 9),
    title: body.title,
    category: body.category,
    description: body.description || "",
    area: body.area,
    status: "open",
    priority: (body.priority as Report["priority"]) || "medium",
    upvotes: 1,
    createdAt: Date.now(),
    x: typeof body.x === "number" ? body.x : Math.round(Math.random() * 80 + 10),
    y: typeof body.y === "number" ? body.y : Math.round(Math.random() * 70 + 12),
    timeline: [{ label: "Reported", at: Date.now() }],
  };
  store.reports.unshift(report);
  return NextResponse.json({ report });
}
