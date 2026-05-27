"use client";

interface SparkleOverlayProps {
  /** When true, particles stay inside the preview scroll container. */
  embedded?: boolean;
}

/**
 * Ambient sparkle particles — CSS only (no JS animation loop).
 */
export function SparkleOverlay({ embedded = false }: SparkleOverlayProps) {
  return (
    <div
      className={`pointer-events-none inset-0 z-[1] overflow-hidden opacity-30 ${
        embedded ? "absolute" : "fixed"
      }`}
      aria-hidden="true"
    >
      <span className="royal-sparkle absolute left-[12%] top-[18%]" />
      <span className="royal-sparkle absolute left-[78%] top-[22%] [animation-delay:1.2s]" />
      <span className="royal-sparkle absolute left-[45%] top-[8%] [animation-delay:2.4s]" />
      <span className="royal-sparkle absolute left-[88%] top-[55%] [animation-delay:0.6s]" />
      <span className="royal-sparkle absolute left-[8%] top-[62%] [animation-delay:1.8s]" />
    </div>
  );
}
