import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AccentBorderCardProps {
  children: ReactNode;
  className?: string;
  dashed?: boolean;
}

export function AccentBorderCard({
  children,
  className,
  dashed = false,
}: AccentBorderCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface-container border border-[color-mix(in_srgb,var(--template-primary)_10%,transparent)]",
        dashed && "border-dashed",
        className
      )}
    >
      {children}
    </div>
  );
}
