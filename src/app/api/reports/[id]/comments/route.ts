import { NextResponse } from "next/server";
import { supabase, hasSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!hasSupabase) return NextResponse.json({ comments: [] });
  const { data, error } = await supabase
    .from("cityhelp_comments")
    .select("*")
    .eq("report_id", id)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ comments: [] });
  return NextResponse.json({ comments: data });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: { author?: string; body?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body.body?.trim()) {
    return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
  }
  if (!hasSupabase) {
    return NextResponse.json({ error: "Comments unavailable" }, { status: 503 });
  }
  const { data, error } = await supabase
    .from("cityhelp_comments")
    .insert({
      report_id: id,
      author: body.author?.trim() || "Resident",
      role: body.role === "official" ? "official" : "resident",
      body: body.body.trim(),
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: "Could not post comment" }, { status: 500 });
  return NextResponse.json({ comment: data });
}
