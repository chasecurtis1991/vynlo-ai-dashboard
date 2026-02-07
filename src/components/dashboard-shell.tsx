"use client";

import { Activity, Brain, Zap, Settings, Bell, Menu, X, BarChart3, CheckSquare } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "Overview", icon: Activity },
  { href: "/tasks", label: "Task Board", icon: CheckSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/features", label: "Features", icon: Brain },
  { href: "/actions", label: "Quick Actions", icon: Zap },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    const savedAvatar = localStorage.getItem("vynlo_avatar");
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-card border-r z-40 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Sidebar header - Menu controls */}
        <div className="h-16 flex items-center">
          {sidebarOpen ? (
            <div className="flex items-center justify-between px-4 w-full">
              <span className="text-xl font-bold truncate pl-3">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 hover:bg-accent rounded-md transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full flex items-center justify-center p-4 hover:bg-accent rounded-md transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors ${
                !sidebarOpen && "justify-center"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer - Actions */}
        <div className={`p-4 space-y-2 ${!sidebarOpen && "flex flex-col items-center"}`}>
          <button className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors w-full ${!sidebarOpen && "justify-center"}`}>
            <Bell className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium truncate">Notifications</span>}
          </button>
          <Link href="/settings" className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors w-full ${!sidebarOpen && "justify-center"}`}>
            <Settings className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium truncate">Settings</span>}
          </Link>
          <Link href="/settings" className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors w-full ${!sidebarOpen && "justify-center"}`}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-5 w-5 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-primary">V</span>
              </div>
            )}
            {sidebarOpen && <span className="text-sm font-medium truncate">Profile</span>}
          </Link>
        </div>
      </aside>

      {/* Main content with sidebar offset */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
          {/* Vynlo AI branding - always centered */}
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Vynlo AI</span>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}