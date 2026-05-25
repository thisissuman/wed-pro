"use client";

/**
 * Ambient sparkle particles — CSS only (no JS animation loop).
 */
export function SparkleOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden opacity-40"
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
