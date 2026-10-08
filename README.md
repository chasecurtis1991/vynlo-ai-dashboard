# Vynlo AI Dashboard

A small full-stack dashboard built with Next.js 14 (App Router) and an Express + SQLite API. It demonstrates a drag-and-drop Kanban task board backed by a REST API, an analytics page rendered with Chart.js from backend data, a settings page with a Telegram notification integration, and a shadcn/ui-style component layer with dark/light theming.

The project was built as an internal dashboard concept for a small AI automation agency. All data in this repository is fake demo data generated on first run; nothing here connects to a real customer or business system.

## What it does

| Page | Route | What's behind it |
|------|-------|------------------|
| **Task Board** | `/tasks` | Kanban board with four columns (Backlog, To Do, In Progress, Done). Drag-and-drop between columns via `@dnd-kit`, create/edit/delete tasks in a dialog, full-text search and priority/category filters, per-column counts. All reads and writes go to the Express API and persist in SQLite. |
| **Analytics** | `/analytics` | Summary cards plus three Chart.js charts (tasks over time, AI activity, task distribution by status). The client calls Next.js route handlers under `src/app/api/analytics/*`, which proxy to the backend. |
| **Settings** | `/settings` | Profile fields and avatar upload (stored in `localStorage` as a data URL), notification and appearance toggles, and a Telegram bot token / chat ID form with a "Test" button that sends a message through the `/api/telegram` route handler. |
| **Overview** | `/` | Landing page with summary cards, recent/upcoming feature lists and quick-action shortcuts. This page uses static placeholder content, not live data. |
| **Activity Feed** | `/features` | Static mock activity timeline, notifications and system status cards. |
| **Quick Actions** | `/actions` | Static mock action cards and automation queue. |

Shared layout: collapsible sidebar, sticky header, and a light/dark toggle built on `next-themes`.

## Tech stack

Verified against `package.json` and `backend/package.json`:

**Frontend** (`/`)
- Next.js 14.2 (App Router) + React 18 + TypeScript 5
- Tailwind CSS 3.4
- shadcn/ui-style components written by hand in `src/components/ui` (`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` icons). The shadcn CLI and Radix primitives are not used.
- `@dnd-kit/core` + `@dnd-kit/sortable` for drag and drop
- Chart.js 4 + `react-chartjs-2`
- `next-themes` for theming
- ESLint (`eslint-config-next`)

**Backend** (`/backend`)
- Node.js + Express 4
- SQLite via the `sqlite3` driver (file-based database created on first start)

There is no authentication layer and no test suite in this repository.

## Getting started

Tested from a clean checkout with Node.js 22 and npm 10.

### 1. Start the backend

```bash
cd backend
npm install
npm start
```

This starts the API on `http://localhost:3001`. On first start it creates `backend/data/analytics.db` (git-ignored) and seeds it with fake demo tasks and 30 days of random metrics. See [`backend/README.md`](backend/README.md) for the endpoint list.

### 2. Start the frontend

In a second terminal, from the repository root:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The frontend talks to the backend at `http://localhost:3001` by default. To point it elsewhere, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_BACKEND_URL`.

### Other scripts

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # ESLint (next/core-web-vitals)
npx tsc --noEmit
```

### Optional: Telegram notifications

The Settings page accepts a Telegram bot token and chat ID, keeps them in the browser's `localStorage`, and can send a test message via `POST /api/telegram`. `scripts/notify-telegram.js` is a small CLI helper that does the same from the command line using the `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` environment variables. Neither is required to run the app.

## Project structure

```
.
├── backend/
│   ├── server.js            # Express app, SQLite schema, seed data, REST endpoints
│   └── data/                # SQLite database (created at runtime, git-ignored)
├── scripts/
│   └── notify-telegram.js   # CLI helper for Telegram messages
├── src/
│   ├── app/
│   │   ├── page.tsx         # Overview
│   │   ├── tasks/           # Task board
│   │   ├── analytics/       # Charts
│   │   ├── settings/        # Settings
│   │   ├── features/        # Activity feed (static)
│   │   ├── actions/         # Quick actions (static)
│   │   └── api/             # Route handlers: analytics proxy + telegram
│   ├── components/
│   │   ├── ui/              # Button, Card, Badge, Dialog, Input, Select
│   │   ├── charts/          # Chart.js components
│   │   ├── dashboard-shell.tsx
│   │   └── theme-toggle.tsx
│   └── lib/                 # cn() helper, Telegram notify utility
└── .github/workflows/ci.yml # Lint, type check and build on push / PR
```

## Continuous integration

`.github/workflows/ci.yml` runs on pushes and pull requests to `main`: it installs dependencies, runs ESLint, type-checks with `tsc`, builds the Next.js app, and syntax-checks the backend. There is no automated deployment.

## License

MIT — see [LICENSE](LICENSE).
