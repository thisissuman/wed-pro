"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ShineBorderProps extends HTMLAttributes<HTMLDivElement> {
  borderWidth?: number;
  duration?: number;
  shineColor?: string | string[];
}

export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = ["#D4AF37", "#B76E79", "#f2ca50", "#D4AF37"],
  className,
  style,
  children,
  ...props
}: ShineBorderProps) {
  const colors = Array.isArray(shineColor) ? shineColor.join(", ") : shineColor;

  return (
    <div
      className={cn("relative rounded-2xl", className)}
      style={
        {
          padding: borderWidth,
          backgroundImage: `linear-gradient(135deg, ${colors})`,
          backgroundSize: "300% 300%",
          animation: `shine ${duration}s linear infinite`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[calc(1rem-2px)]">
        {children}
      </div>
    </div>
  );
}
