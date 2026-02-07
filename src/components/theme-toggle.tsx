"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted) {
      setIsDark(theme === "dark");
    }
  }, [mounted, theme]);

  const toggleTheme = () => {
    // Trigger fade out
    document.body.classList.add("theme-fading");
    
    // Switch theme after fade out starts
    setTimeout(() => {
      setIsDark(!isDark);
      setTheme(!isDark ? "dark" : "light");
    }, 150);
    
    // Fade back in
    setTimeout(() => {
      document.body.classList.remove("theme-fading");
    }, 300);
  };

  if (!mounted) {
    return (
      <button className="theme-btn w-9 h-9 flex items-center justify-center" aria-label="Toggle theme">
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`theme-btn w-9 h-9 flex items-center justify-center ${isDark ? "show-moon" : "show-sun"}`}
      aria-label="Toggle theme"
    >
      <Sun className="icon-sun h-5 w-5" />
      <Moon className="icon-moon h-5 w-5" />
    </button>
  );
}
