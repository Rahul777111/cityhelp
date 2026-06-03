import { SEED_REPORTS, type Report } from "./data";

type Store = { reports: Report[] };

const g = globalThis as unknown as { __cityHelp?: Store };

export function getStore(): Store {
  if (!g.__cityHelp) {
    g.__cityHelp = { reports: SEED_REPORTS.map((r) => ({ ...r, timeline: [...r.timeline] })) };
  }
  return g.__cityHelp;
}
