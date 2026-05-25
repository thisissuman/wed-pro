"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { templateMotion } from "../../shared/motion/presets";

const INTRO_STORAGE_PREFIX = "vivaha-cinematic-intro-";

interface CinematicIntroProps {
  slug: string;
  isPreview?: boolean;
}

/**
 * Curtain-style opening reveal on first visit per session.
 * Skipped in editor preview and when prefers-reduced-motion.
 */
export function CinematicIntro({ slug, isPreview }: CinematicIntroProps) {
  const reducedMotion = usePrefersReducedMotion();
  const storageKey = `${INTRO_STORAGE_PREFIX}${slug}`;
  const [visible, setVisible] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (isPreview || reducedMotion) {
        return;
      }
      try {
        const seen = sessionStorage.getItem(storageKey);
        setVisible(!seen);
      } catch {
        setVisible(true);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [isPreview, reducedMotion, storageKey]);

  const dismiss = useCallback(() => {
    if (opening) return;
    setOpening(true);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setVisible(false), 900);
  }, [opening, storageKey]);

  if (!visible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-label="Open invitation"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#0a0a0a] touch-manipulation"
        onClick={dismiss}
      >
        <motion.div
          initial={{ x: 0 }}
          animate={opening ? { x: "-100%" } : { x: 0 }}
          transition={templateMotion.curtain}
          className="absolute inset-y-0 left-0 w-1/2 origin-left bg-gradient-to-r from-[#1a0f0f] via-[var(--template-secondary)] to-[#1a0f0f] border-r border-[color-mix(in_srgb,var(--template-primary)_20%,transparent)]"
          style={{ willChange: "transform" }}
        />
        <motion.div
          initial={{ x: 0 }}
          animate={opening ? { x: "100%" } : { x: 0 }}
          transition={templateMotion.curtain}
          className="absolute inset-y-0 right-0 w-1/2 origin-right bg-gradient-to-l from-[#1a0f0f] via-[var(--template-secondary)] to-[#1a0f0f] border-l border-[color-mix(in_srgb,var(--template-primary)_20%,transparent)]"
          style={{ willChange: "transform" }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: opening ? 0 : 1 }}
          className="relative z-10 px-8 text-center pointer-events-none"
        >
          <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.35em] text-[color-mix(in_srgb,var(--template-primary)_70%,transparent)] mb-3">
            You are invited
          </p>
          <p className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[var(--template-text)] font-semibold">
            Tap to enter
          </p>
        </motion.div>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          className="relative z-10 mt-10 min-h-[44px] min-w-[44px] rounded-full border border-[color-mix(in_srgb,var(--template-primary)_40%,transparent)] px-8 py-3 font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.2em] text-[var(--template-primary)] hover:bg-champagne-gold/10 transition-colors"
        >
          Open invitation
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
