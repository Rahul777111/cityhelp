# CityHelp — Report. Track. Resolve.

A full-stack civic platform for a city (modeled on Hyderabad). Residents report issues, rally support with upvotes, track resolutions on a live dashboard and map, and find every city service in one place.

![Tech](https://img.shields.io/badge/Next.js-16-0d9488) ![Tech](https://img.shields.io/badge/API%20Routes-server-blue) ![Tech](https://img.shields.io/badge/Recharts-charts-black)

## Features

- **Report an issue** — categorized reports (potholes, water, drainage, power, traffic, and more) with area, priority, and description, submitted through a serverless API.
- **Community feed** — search and filter by status, category, and area; sort by recent or most upvoted; upvote reports you care about.
- **Live dashboard** — totals, status breakdown donut, and category bar chart computed server-side.
- **City map** — every report plotted as a status-colored pin on a stylized city grid; tap a pin to inspect it.
- **Services directory** — emergency, utility, and support helplines with one-tap calling.
- Responsive, animated with Motion, civic teal theme.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · API Routes · Recharts · Motion · Phosphor Icons

## Getting started

```bash
npm install
npm run dev
npm run build && npm start
```

## Architecture

Reports live in a serverless in-memory store seeded with realistic data. The API exposes `GET/POST /api/reports`, `GET/PATCH /api/reports/[id]` (upvote), and computes aggregate stats. The UI is a client app that talks to those routes.

## Author

**D L Narayana** — [GitHub](https://github.com/Rahul777111)
