"use client";

import { AnimatePresence, motion, useMotionValue, type HTMLMotionProps } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Custom pointer that follows the cursor inside the parent element (Magic UI pattern).
 * Parent gets `cursor: none` while active. Hidden on touch / narrow viewports.
 */
export function Pointer({
  className,
  style,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isActive, setIsActive] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    if (coarse || narrow) return;

    const timer = window.setTimeout(() => setEnabled(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const parentElement = containerRef.current?.parentElement ?? null;

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsActive(true);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    if (parentElement) {
      parentElement.style.cursor = "none";
      parentElement.addEventListener("mousemove", handleMouseMove);
      parentElement.addEventListener("mouseenter", handleMouseEnter);
      parentElement.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (parentElement) {
        parentElement.style.cursor = "";
        parentElement.removeEventListener("mousemove", handleMouseMove);
        parentElement.removeEventListener("mouseenter", handleMouseEnter);
        parentElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <div ref={containerRef} />
      <AnimatePresence>
        {isActive && (
          <motion.div
            className={cn("pointer-events-none fixed left-0 top-0 z-[35]", className)}
            style={{ x, y, translateX: "-50%", translateY: "-50%", ...style }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            {...props}
          >
            {children ?? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-champagne-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                aria-hidden="true"
              >
                <path
                  d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
