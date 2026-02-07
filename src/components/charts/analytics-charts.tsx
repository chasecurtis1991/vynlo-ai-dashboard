"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
    tension?: number;
  }[];
}

interface TasksOverTimeData {
  labels: string[];
  tasks: number[];
  automations: number[];
}

interface AiActivityData {
  labels: string[];
  aiResponses: number[];
  efficiency: number[];
}

interface TaskDistributionData {
  labels: string[];
  data: number[];
}

interface SummaryData {
  totalTasks: number;
  totalAutomations: number;
  totalAiResponses: number;
  avgEfficiency: number;
}

export function TasksOverTimeChart() {
  const [data, setData] = useState<TasksOverTimeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/tasks-over-time")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks & Automations</CardTitle>
          <CardDescription>Activity over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks & Automations</CardTitle>
          <CardDescription>Activity over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData: ChartData = {
    labels: data.labels.slice(-14), // Show last 14 days
    datasets: [
      {
        label: "Tasks Completed",
        data: data.tasks.slice(-14),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Automations Run",
        data: data.automations.slice(-14),
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks & Automations</CardTitle>
        <CardDescription>Activity over the last 14 days</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <Line data={chartData} options={options} />
      </CardContent>
    </Card>
  );
}

export function AiActivityChart() {
  const [data, setData] = useState<AiActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/ai-activity")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Activity & Efficiency</CardTitle>
          <CardDescription>AI responses and efficiency score</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Activity & Efficiency</CardTitle>
          <CardDescription>AI responses and efficiency score</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData: ChartData = {
    labels: data.labels.slice(-14),
    datasets: [
      {
        label: "AI Responses",
        data: data.aiResponses.slice(-14),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Efficiency Score (%)",
        data: data.efficiency.slice(-14),
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Activity & Efficiency</CardTitle>
        <CardDescription>Last 14 days performance</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <Line data={chartData} options={options} />
      </CardContent>
    </Card>
  );
}

export function TaskDistributionChart() {
  const [data, setData] = useState<TaskDistributionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/task-distribution")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Distribution</CardTitle>
          <CardDescription>Tasks by status</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.labels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Distribution</CardTitle>
          <CardDescription>Tasks by status</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const colors = [
    "rgba(34, 197, 94, 0.8)",
    "rgba(59, 130, 246, 0.8)",
    "rgba(249, 115, 22, 0.8)",
    "rgba(168, 85, 247, 0.8)",
  ];

  const chartData = {
    labels: data.labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1).replace("_", " ")),
    datasets: [
      {
        data: data.data,
        backgroundColor: colors.slice(0, data.labels.length),
        borderColor: colors.slice(0, data.labels.length).map((c) => c.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Distribution</CardTitle>
        <CardDescription>Current tasks by status</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <Doughnut data={chartData} options={options} />
      </CardContent>
    </Card>
  );
}

export function AnalyticsSummaryCards() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/summary")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return null;
  }

  if (!data) {
    return null;
  }

  const stats = [
    { label: "Total Tasks", value: data.totalTasks.toLocaleString(), color: "text-green-500" },
    { label: "Automations", value: data.totalAutomations.toLocaleString(), color: "text-purple-500" },
    { label: "AI Responses", value: data.totalAiResponses.toLocaleString(), color: "text-blue-500" },
    { label: "Avg Efficiency", value: `${data.avgEfficiency}%`, color: "text-orange-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
