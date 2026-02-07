# Vynlo Dashboard Backend

Node.js + Express + SQLite backend for the Vynlo Dashboard analytics.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

   The server runs on `http://localhost:3001`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/tasks-over-time` | GET | Tasks and automations data for line chart |
| `/api/analytics/ai-activity` | GET | AI responses and efficiency data |
| `/api/analytics/task-distribution` | GET | Task status distribution for pie chart |
| `/api/analytics/summary` | GET | Summary statistics |
| `/api/analytics/events` | GET/POST | Record and fetch analytics events |

## Database

Uses SQLite with tables:
- `analytics_events` - Event tracking
- `tasks` - Task status data
- `daily_metrics` - Daily performance metrics

The database auto-seeds with 30 days of sample data on first run.