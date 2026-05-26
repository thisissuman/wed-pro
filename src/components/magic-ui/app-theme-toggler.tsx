"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AppThemeTogglerProps {
  className?: string;
}

export function AppThemeToggler({ className }: AppThemeTogglerProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <span
        className={cn(
          "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-champagne-gold/20",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  const isDark = (resolvedTheme ?? theme) === "dark";

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    const apply = () => setTheme(next);

    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-champagne-gold/20 text-champagne-gold transition hover:bg-champagne-gold/10 active:scale-95",
        className
      )}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
