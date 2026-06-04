import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Server-side client. RLS policies allow public read + insert + update
// for this demo civic app, so the publishable/anon key is sufficient.
export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

export const hasSupabase = Boolean(url && key);
