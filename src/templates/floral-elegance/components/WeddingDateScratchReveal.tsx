"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ScratchToReveal } from "@/components/magicui/scratch-to-reveal";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const FLORAL_SCRATCH_GRADIENT: [string, string, string] = ["#5e705c", "#d6b570", "#a66c75"];

interface WeddingDateScratchRevealProps {
  date: string;
}

function DateText({ date, animateIn }: { date: string; animateIn?: boolean }) {
  return (
    <motion.p
      initial={animateIn ? { opacity: 0.4, scale: 0.92 } : false}
      animate={animateIn ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="px-3 text-center font-[family-name:var(--font-heading)] text-xl font-bold uppercase leading-snug tracking-[0.14em] text-[var(--template-primary)] md:text-2xl md:tracking-[0.16em] lg:text-3xl"
    >
      {date}
    </motion.p>
  );
}

/**
 * Floral Elegance hero — scratch-off wedding date (Magic UI) with reduced-motion fallback.
 */
export function WeddingDateScratchReveal({ date }: WeddingDateScratchRevealProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reducedMotion);
  const [size, setSize] = useState({ width: 300, height: 96 });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      setSize(mq.matches ? { width: 340, height: 108 } : { width: 300, height: 96 });
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (reducedMotion) {
    return (
      <div className="px-6 py-4 rounded-2xl border border-[color-mix(in_srgb,var(--template-primary)_25%,transparent)] bg-[var(--template-surface)]/60 shadow-sm">
        <DateText date={date} animateIn />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <p className="mb-3 text-center font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.3em] text-[var(--template-primary)] font-medium">
        Scratch to reveal the date
      </p>
      <ScratchToReveal
        width={size.width}
        height={size.height}
        minScratchPercentage={65}
        gradientColors={FLORAL_SCRATCH_GRADIENT}
        onComplete={() => setRevealed(true)}
        className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--template-primary)_25%,transparent)] bg-[var(--template-surface)]/60 shadow-md backdrop-blur-sm cursor-crosshair"
      >
        <DateText date={date} animateIn={revealed} />
      </ScratchToReveal>
    </div>
  );
}
