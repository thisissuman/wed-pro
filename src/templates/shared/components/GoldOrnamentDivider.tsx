import { cn } from "@/lib/utils";

interface GoldOrnamentDividerProps {
  className?: string;
  width?: "sm" | "md";
}

export function GoldOrnamentDivider({ className, width = "sm" }: GoldOrnamentDividerProps) {
  return (
    <div
      className={cn(
        "h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--template-primary)_40%,transparent)] to-transparent mx-auto",
        width === "sm" ? "w-12" : "w-24",
        className
      )}
      aria-hidden="true"
    />
  );
}
