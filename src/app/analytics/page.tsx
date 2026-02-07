import { Brain } from "lucide-react";
import {
  TasksOverTimeChart,
  AiActivityChart,
  TaskDistributionChart,
  AnalyticsSummaryCards,
} from "@/components/charts/analytics-charts";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your AI agent performance and productivity metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">Real-time data</span>
        </div>
      </div>

      {/* Summary Cards */}
      <AnalyticsSummaryCards />

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TasksOverTimeChart />
        <AiActivityChart />
      </div>

      {/* Task Distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        <TaskDistributionChart />
      </div>
    </div>
  );
}