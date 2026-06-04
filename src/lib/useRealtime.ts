"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Browser client for realtime subscriptions.
const client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

export function useReportsRealtime(onChange: () => void) {
  useEffect(() => {
    if (!client) return;
    const channel = client
      .channel("cityhelp-reports")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cityhelp_reports" },
        () => onChange()
      )
      .subscribe();
    return () => {
      client.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
