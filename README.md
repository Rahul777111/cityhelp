# CityHelp — Report. Track. Resolve.

**Live demo: [cityhelp-sage.vercel.app](https://cityhelp-sage.vercel.app)**

A full-stack civic platform for a city (modeled on Hyderabad). Residents report issues, rally support with upvotes, follow a transparent resolution workflow on a live map and analytics dashboard, discuss reports with officials, and find every city service in one place.

![Tech](https://img.shields.io/badge/Next.js-16-0d9488) ![Tech](https://img.shields.io/badge/Supabase-realtime-3ecf8e) ![Tech](https://img.shields.io/badge/Leaflet-map-199900) ![Tech](https://img.shields.io/badge/Recharts-charts-black)

## Features

- **Report an issue** — categorized reports (potholes, streetlights, water, drainage, power, traffic, garbage, parks) with area, priority, description, and an auto-attached issue photo, submitted through a serverless API and persisted to Supabase.
- **Report detail pages** — every report has its own page with a status progress tracker (open to in progress to resolved), a full event timeline, the routed city department, and a comment thread where residents and officials respond.
- **Comment threads** — leave updates on any report; official responses are flagged. Comments persist to Supabase with realtime sync.
- **Community feed** — search and filter by status, category, and area; sort by recent or most upvoted; upvote reports; rich report cards with photos.
- **Analytics dashboard** — a dedicated `/analytics` page with KPIs, a 7-day reporting trend, category distribution, area hotspots, and per-department workload, all aggregated server-side.
- **Live map** — every report plotted as a status-colored pin on a real Leaflet map of Hyderabad; click a pin to open the report.
- **Realtime** — new reports, upvotes, status changes, and comments stream to every open client through Supabase Realtime.
- **Department routing** — each category is routed to the responsible city department (GHMC, HMWSSB, TSSPDCL, Traffic Police, and more).
- **Services directory** — emergency, utility, and support helplines with one-tap calling.
- Responsive, animated with Motion, civic teal theme.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Realtime) · API Routes · Leaflet / React-Leaflet · Recharts · Motion · Phosphor Icons

## Getting started

```bash
npm install
# add .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
npm run build && npm start
```

## Architecture

Reports and comments are stored in Supabase Postgres with row-level security (public read, insert, update) and Realtime enabled. The API exposes `GET/POST /api/reports`, `GET/PATCH /api/reports/[id]` (status + upvotes), `GET/POST /api/reports/[id]/comments`, and `GET /api/analytics` for the aggregated dashboard. The client subscribes to Supabase Realtime channels so the feed, map, and detail pages update without a refresh. If Supabase is not configured the app falls back to a seeded in-memory store so it still runs locally.

## Author

**D L Narayana** — [GitHub](https://github.com/Rahul777111)
