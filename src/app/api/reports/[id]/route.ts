import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = getStore().reports.find((r) => r.id === id);
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ report });
}

// PATCH for upvote or status change
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = getStore().reports.find((r) => r.id === id);
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: { action?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  if (body.action === "upvote") {
    report.upvotes += 1;
  }
  return NextResponse.json({ report });
}
