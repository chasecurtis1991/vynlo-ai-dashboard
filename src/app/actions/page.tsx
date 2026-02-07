import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  CheckCircle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  MoreHorizontal,
  Brain,
} from "lucide-react";

const quickActions = [
  {
    id: 1,
    name: "Generate Weekly Report",
    description: "Compile AI task metrics and feature updates",
    icon: Brain,
    category: "AI",
    status: "ready",
  },
  {
    id: 2,
    name: "Sync Task Backlog",
    description: "Pull latest tasks from project tracker",
    icon: RotateCcw,
    category: "Sync",
    status: "ready",
  },
  {
    id: 3,
    name: "Run Health Check",
    description: "Verify all integrations and services",
    icon: CheckCircle,
    category: "System",
    status: "ready",
  },
  {
    id: 4,
    name: "Deploy New Features",
    description: "Push queued features to production",
    icon: Play,
    category: "Deploy",
    status: "paused",
  },
];

const automationQueue = [
  { id: 1, name: "Daily Digest Generator", schedule: "Every 8 hours", nextRun: "In 3 hours", status: "active" },
  { id: 2, name: "Feature Analysis", schedule: "Every 6 hours", nextRun: "In 2 hours", status: "active" },
  { id: 3, name: "Metrics Sync", schedule: "Every hour", nextRun: "In 45 min", status: "active" },
  { id: 4, name: "Backup Dashboard", schedule: "Daily at midnight", nextRun: "In 8 hours", status: "paused" },
];

export default function QuickActionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quick Actions</h1>
          <p className="text-muted-foreground mt-1">
            Common operations and automation controls
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Action
        </Button>
      </div>

      {/* Action Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card key={action.id} className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant={action.status === "ready" ? "default" : "secondary"}>
                  {action.status}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-3">{action.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{action.description}</p>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="h-3 w-3 mr-1" />
                  Run
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Automation Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Automation Queue
          </CardTitle>
          <CardDescription>Scheduled and queued automation tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {automationQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    {item.status === "active" ? (
                      <Clock className="h-5 w-5 text-green-500 animate-pulse" />
                    ) : (
                      <Pause className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.schedule} • Next: {item.nextRun}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.status === "active" ? "default" : "secondary"}>
                    {item.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    {item.status === "active" ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
