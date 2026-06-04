import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { supabase, hasSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (hasSupabase) {
    const { data, error } = await supabase
      .from("cityhelp_reports")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) return NextResponse.json({ report: data });
  }
  const report = getStore().reports.find((r) => r.id === id);
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ report });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: { action?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  if (hasSupabase && body.action === "upvote") {
    // read current, increment, write back
    const { data: cur } = await supabase
      .from("cityhelp_reports")
      .select("upvotes")
      .eq("id", id)
      .single();
    if (cur) {
      const { data, error } = await supabase
        .from("cityhelp_reports")
        .update({ upvotes: (cur.upvotes as number) + 1 })
        .eq("id", id)
        .select("*")
        .single();
      if (!error && data) return NextResponse.json({ report: data });
    }
  }

  const report = getStore().reports.find((r) => r.id === id);
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (body.action === "upvote") report.upvotes += 1;
  return NextResponse.json({ report });
}
