import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Clock, CheckCircle2, ArrowRight, Sparkles, BarChart3 } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Active Features", value: "4", change: "+2 this week", trend: "up" },
  { label: "AI Tasks Completed", value: "127", change: "+23% vs last week", trend: "up" },
  { label: "Automation Rate", value: "94%", change: "+5% improvement", trend: "up" },
  { label: "Last Update", value: "2h ago", change: "Auto-deployed", trend: "neutral" },
];

const recentFeatures = [
  { name: "Analytics Charts", status: "active", date: "Today", description: "Real-time performance charts with Chart.js" },
  { name: "Dashboard Overview", status: "active", date: "Today", description: "Main landing page with key metrics" },
  { name: "Quick Actions Module", status: "active", date: "Today", description: "Fast access to common tasks" },
  { name: "Settings Panel", status: "pending", date: "Tomorrow", description: "User preferences configuration" },
];

const upcomingFeatures = [
  { name: "Notification Center", priority: "high", icon: "🔔", href: "#" },
  { name: "Task Backlog", priority: "medium", icon: "📋", href: "#" },
  { name: "Team Status", priority: "medium", icon: "👥", href: "#" },
  { name: "Export Reports", priority: "low", icon: "📤", href: "#" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to Vynlo AI Dashboard — your AI agent is working hard.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">AI Agent Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              {stat.trend === "up" && (
                <div className="h-2 w-2 rounded-full bg-green-500" />
              )}
              {stat.trend === "neutral" && (
                <Clock className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Recent Features
            </CardTitle>
            <CardDescription>Features added by your AI agent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeatures.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {feature.status === "active" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{feature.name}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={feature.status === "active" ? "default" : "secondary"}>
                      {feature.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{feature.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Coming Soon
            </CardTitle>
            <CardDescription>Features your AI agent is planning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingFeatures.map((feature) => (
                <Link
                  key={feature.name}
                  href={feature.href || "#"}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{feature.name}</p>
                    <Badge
                      variant={feature.priority === "high" ? "destructive" : "secondary"}
                      className="mt-1"
                    >
                      {feature.priority} priority
                    </Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Request a Feature
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/analytics" className="block">
              <Button variant="outline" className="h-20 w-full flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </Link>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Brain className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Zap className="h-6 w-6" />
              <span>Run Automation</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CheckCircle2 className="h-6 w-6" />
              <span>Review Tasks</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
