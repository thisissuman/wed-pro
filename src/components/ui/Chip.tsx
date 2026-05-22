"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function Chip({ label, isActive = false, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap px-6 py-2 rounded-full",
        "font-[family-name:var(--font-body)] text-xs font-semibold uppercase tracking-widest",
        "transition-all duration-200 active:scale-95",
        isActive
          ? "bg-champagne-gold text-deep-maroon shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          : "bg-surface text-ivory border border-champagne-gold/20 hover:border-champagne-gold/50"
      )}
    >
      {label}
    </button>
  );
}
