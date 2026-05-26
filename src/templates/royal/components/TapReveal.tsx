"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface TapRevealProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

/**
 * Tap-to-reveal overlay (mobile-friendly alternative to canvas scratch).
 */
export function TapReveal({
  children,
  label = "Tap to reveal the date",
  className = "",
}: TapRevealProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reducedMotion);

  if (revealed) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      <div className="opacity-40 blur-[2px] select-none pointer-events-none" aria-hidden>
        {children}
      </div>
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        onClick={() => setRevealed(true)}
        className="absolute inset-0 flex min-h-[44px] flex-col items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--template-primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--template-background,#131313)_75%,transparent)] px-4 backdrop-blur-sm"
        aria-label={label}
      >
        <span className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.28em] text-[color-mix(in_srgb,var(--template-primary)_80%,transparent)]">
          {label}
        </span>
      </motion.button>
    </div>
  );
}
