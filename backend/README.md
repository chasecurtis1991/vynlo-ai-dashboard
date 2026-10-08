# Vynlo Dashboard Backend

Node.js + Express + SQLite API that powers the Task Board and Analytics pages of the dashboard.

## Setup

```bash
cd backend
npm install
npm start        # or: npm run dev (restarts on file changes)
```

The server listens on `http://localhost:3001` (override with the `PORT` env var).

## Database

On startup the server creates `backend/data/analytics.db` if it does not exist (the `data/`
directory and all `*.db` files are git-ignored) and seeds it with **fake demo data**:

- 30 days of randomly generated `daily_metrics`
- 10 sample `tasks` spread across the `backlog`, `todo`, `in_progress` and `done` columns

Delete `backend/data/analytics.db` to reset to a fresh seed.

Tables:

| Table | Purpose |
|-------|---------|
| `tasks` | Task board items (title, description, status, priority, category, order, dates) |
| `daily_metrics` | Per-day counters used by the analytics charts |
| `analytics_events` | Free-form event log (written via `POST /api/analytics/events`) |

## API Endpoints

### Analytics

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/tasks-over-time?days=30` | GET | Tasks completed and automations run per day |
| `/api/analytics/ai-activity?days=30` | GET | AI responses and efficiency score per day |
| `/api/analytics/task-distribution` | GET | Task counts grouped by status |
| `/api/analytics/summary` | GET | Totals and average efficiency |
| `/api/analytics/events?limit=10` | GET | Most recent recorded events |
| `/api/analytics/events` | POST | Record an event (`event_type`, `event_name`, `value`, `metadata`) |

### Tasks

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tasks?status=&priority=&category=&search=` | GET | List tasks with optional filters |
| `/api/tasks/:id` | GET | Get a single task |
| `/api/tasks` | POST | Create a task |
| `/api/tasks/:id` | PUT | Update a task |
| `/api/tasks/:id/move` | PUT | Move a task to a column/position (`status`, `newOrder`) |
| `/api/tasks/:id` | DELETE | Delete a task |
| `/api/tasks/stats/summary` | GET | Task counts per column |
