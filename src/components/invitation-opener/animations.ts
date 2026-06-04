import type { Transition } from "framer-motion";

export const durations = {
  fast: 0.25,
  standard: 0.45,
  reveal: 0.75,
  cinematic: 1.1,
  gateOpen: 1.4,
} as const;

export const easings = {
  easeOut: "easeOut",
  // Premium luxurious cinematic ease-out curve (smooth deceleration)
  luxury: [0.22, 1, 0.36, 1] as [number, number, number, number],
  // Majestic dramatic curve (slight wind-up, very smooth float)
  majestic: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  // Smooth fabric-like ease
  drape: [0.4, 0, 0.2, 1] as [number, number, number, number],
} as const;

export const springPresets = {
  // Heavy gate swing with a tiny realistic bounce at the end
  heavyGate: {
    type: "spring",
    stiffness: 45,
    damping: 12,
    mass: 1.2,
  } as Transition,
  
  // Quick energetic click/snap for envelopes
  flapUnlock: {
    type: "spring",
    stiffness: 110,
    damping: 18,
    mass: 0.8,
  } as Transition,

  // Smooth bounce for elements pop
  softBounce: {
    type: "spring",
    stiffness: 80,
    damping: 15,
  } as Transition,
} as const;

export const globalTransition = {
  duration: durations.cinematic,
  ease: easings.luxury,
};
