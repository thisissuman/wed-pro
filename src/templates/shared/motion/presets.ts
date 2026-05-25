import type { Transition } from "framer-motion";

export const motionDurations = {
  fast: 0.18,
  standard: 0.35,
  reveal: 0.6,
  cinematic: 0.75,
} as const;

export const motionEase = {
  out: "easeOut",
  cinematic: [0.22, 1, 0.36, 1],
} as const;

export const templateMotion = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: {
      duration: motionDurations.reveal,
      ease: motionEase.out,
    } satisfies Transition,
  },
  softScale: {
    initial: { opacity: 0, scale: 0.96 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-50px" },
    transition: {
      duration: motionDurations.standard,
      ease: motionEase.out,
    } satisfies Transition,
  },
  curtain: {
    duration: motionDurations.cinematic,
    ease: motionEase.cinematic,
  } satisfies Transition,
} as const;
