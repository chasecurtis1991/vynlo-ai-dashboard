import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, Clock, AlertTriangle, ArrowUpRight, MessageSquare } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "feature",
    title: "Dark/Light Mode Toggle Added",
    description: "Theme switcher implemented in header",
    time: "5 minutes ago",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: 2,
    type: "system",
    title: "Dashboard optimized for mobile",
    description: "Responsive layout improvements deployed",
    time: "1 hour ago",
    icon: ArrowUpRight,
    color: "text-blue-500",
  },
  {
    id: 3,
    type: "ai",
    title: "New feature suggestion generated",
    description: "Analytics Charts recommended for Q1 planning",
    time: "2 hours ago",
    icon: MessageSquare,
    color: "text-purple-500",
  },
  {
    id: 4,
    type: "warning",
    title: "API rate limit approaching",
    description: "Consider upgrading tier for automation tasks",
    time: "3 hours ago",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
  {
    id: 5,
    type: "task",
    title: "Task backlog sync completed",
    description: "15 tasks synchronized with project tracker",
    time: "4 hours ago",
    icon: Clock,
    color: "text-gray-500",
  },
];

const notifications = [
  { id: 1, message: "New feature request: Workflow Builder", priority: "high", time: "10m ago" },
  { id: 2, message: "Automation task #127 completed", priority: "low", time: "1h ago" },
  { id: 3, message: "Weekly digest ready for review", priority: "medium", time: "2h ago" },
  { id: 4, message: "New team member joined workspace", priority: "medium", time: "5h ago" },
];

export default function ActivityFeedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>
        <p className="text-muted-foreground mt-1">
          Real-time updates from your AI agent and system events
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Timeline */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Live feed of dashboard and AI agent events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className={`mt-0.5 ${activity.color}`}>
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{activity.title}</p>
                      <Badge variant={activity.type === "warning" ? "destructive" : "secondary"}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Priority alerts and announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <p className="text-sm">{notif.message}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        notif.priority === "high"
                          ? "destructive"
                          : notif.priority === "medium"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {notif.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>AI agent and integration health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "AI Agent", status: "active", uptime: "99.9%" },
                { name: "Telegram Integration", status: "connected", uptime: "100%" },
                { name: "Automation Engine", status: "running", uptime: "98.5%" },
                { name: "Database", status: "healthy", uptime: "99.99%" },
              ].map((system) => (
                <div
                  key={system.name}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{system.name}</p>
                    <p className="text-xs text-muted-foreground">Uptime: {system.uptime}</p>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    {system.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
