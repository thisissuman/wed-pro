import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TemplateSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Taller closing section (e.g. thank you) */
  variant?: "default" | "closing";
}

export function TemplateSection({
  id,
  children,
  className,
  variant = "default",
}: TemplateSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "px-[var(--template-container-x,1.5rem)]",
        variant === "closing" ? "py-20 md:py-28" : "py-16 md:py-24",
        className
      )}
    >
      {children}
    </section>
  );
}
