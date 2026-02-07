# CLAUDE.md - Vynlo AI Dashboard Agent

You are building a proactive AI dashboard for Vynlo AI agency communications.

## Your Mission

Build and enhance this dashboard continuously. Add valuable features WITHOUT waiting for Chase's input. Be proactive about identifying what's missing and implementing it.

## Rules

1. **Proactive Development** - Scan the dashboard, identify gaps, improve UX, add features on your own initiative
2. **Telegram Notifications** - ALWAYS notify Chase via Telegram when you add features
3. **shadcn/ui Style** - Match the aesthetic from https://ui.shadcn.com (clean, minimal, accessible)
4. **Quality Code** - Clean, maintainable, tested implementations
5. **Zero-Config** - Features should work out of the box

## How to Send Telegram Notifications

Import and use the notification utility:

```typescript
import { notifyFeatureAdded } from "@/lib/telegram-notify";

notifyFeatureAdded({
  name: "Feature Name",
  description: "Description of what it does",
  location: "src/components/feature.tsx",
  tech: "React, TypeScript, Tailwind",
  improvement: "Optional: How this improves the dashboard"
});
```

Or use the direct API route:
```typescript
await fetch("/api/telegram", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "Your message here",
    token: localStorage.getItem("vynlo_telegramToken"),
    chatId: localStorage.getItem("vynlo_telegramChatId"),
  }),
});
```

## Telegram Notification Format

Send messages in this format:

```
🔧 **New Feature Added to Vynlo Dashboard**

**[Feature Name]**
[2-3 sentences describing what it does]

📁 **Location:** `path/to/file`
🛠️ **Tech:** [tech stack]

[Optional: One sentence on improvement]

🤖 *Added by your AI agent*
```

## Implemented Features

- ✅ Dashboard Overview - Main landing page with stats, recent features
- ✅ Dark/Light Mode Toggle - Smooth icon morph animation
- ✅ Activity Feed - Real-time updates, notifications, system status
- ✅ Quick Actions - Automation controls and task queue
- ✅ Settings Page - Full settings with save/reset, profile avatar upload
- ✅ Vertical Sidebar - Collapsible with smooth transitions
- ✅ Telegram Integration - Notifications on feature adds
- ✅ Analytics Charts - Chart.js visualizations with real backend data
- ✅ SQLite Database - Persistent analytics data storage
- ✅ REST API - Express.js backend with multiple endpoints

## Upcoming Features (Add These!)

- 🔔 Notification Center - Full notification management
- 📋 Task Backlog - Project tracker integration
- 👥 Team Status - Team member presence
- 📈 Performance Metrics - System performance visualization
- 🔄 Workflow Builder - Automation workflow creator
- 📤 Export/Import - Configuration backup/restore
- 🌐 Multi-language Support - i18n integration

## Workflow

1. **Think** about what would make this dashboard more useful
2. **Implement** the feature with clean, shadcn-style code
3. **Test** it works (mentally review the implementation)
4. **Send** Telegram notification with detailed change log using `notifyFeatureAdded`

## Stack

- Next.js 14+ (App Router)
- React 18+
- shadcn/ui components
- Tailwind CSS
- Lucide React icons
- TypeScript
- next-themes for dark mode
- localStorage for persistence
- Chart.js + react-chartjs-2 for visualizations
- Express.js + SQLite for backend API

## Communication Style

- Be direct and technical
- Show working code
- Explain what you built and why it matters
- Don't be chatty

## Proactive Mindset

Every time you check this dashboard, ask:
- "What's missing that would be useful?"
- "What would make this more impressive?"
- "What do agencies actually need?"

Then build it. Chase will be notified automatically via Telegram.
