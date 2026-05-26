"use client";

import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function applyLovePointerCursor(active: boolean) {
  const root = document.documentElement;
  const body = document.body;

  root.classList.toggle("love-pointer-active", active);

  if (active) {
    root.style.cursor = "none";
    body.style.cursor = "none";
  } else {
    root.style.cursor = "";
    body.style.cursor = "";
  }
}

function useDesktopFinePointer() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mqFine = window.matchMedia("(pointer: fine)");
    const mqDesktop = window.matchMedia("(min-width: 768px)");

    const sync = () => {
      const active = mqFine.matches && mqDesktop.matches;
      setEnabled(active);
      applyLovePointerCursor(active);
    };

    sync();
    mqFine.addEventListener("change", sync);
    mqDesktop.addEventListener("change", sync);

    return () => {
      mqFine.removeEventListener("change", sync);
      mqDesktop.removeEventListener("change", sync);
      applyLovePointerCursor(false);
    };
  }, [mounted]);

  return enabled && mounted;
}

/**
 * Animated gold heart cursor for desktop (fine pointer, md+).
 * Mounted once in the root layout — follows the mouse on every page.
 */
export function GlobalLovePointer() {
  const enabled = useDesktopFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };

    const onWindowLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onWindowLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onWindowLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const heart = (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[9999]"
          style={{ x, y, translateX: "-50%", translateY: "-50%" }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          aria-hidden="true"
        >
          <motion.div
            animate={{
              scale: [0.85, 1, 0.85],
              rotate: [0, 4, -4, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-champagne-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            >
              <motion.path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="currentColor"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(heart, document.body);
}
