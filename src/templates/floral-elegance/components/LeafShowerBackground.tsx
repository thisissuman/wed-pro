"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import "./leaf-shower.css";

const LEAF_HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

type LeafSpec = {
  left: string;
  speed: string;
  delay: string;
  scale: number;
  sway: number;
  swaySpeed: string;
  opacity: number;
  fill: string;
  glow?: boolean;
};

/** Botanical Green & Gold Leaf Shower Palette */
const LEAVES: LeafSpec[] = [
  { left: "5%", speed: "15s", delay: "-1s", scale: 0.75, sway: 24, swaySpeed: "3.4s", opacity: 0.6, fill: "url(#lsGreenLight)" },
  { left: "16%", speed: "19s", delay: "-7s", scale: 0.5, sway: 16, swaySpeed: "4.5s", opacity: 0.45, fill: "url(#lsGreenSage)" },
  { left: "28%", speed: "11s", delay: "-2s", scale: 0.95, sway: 32, swaySpeed: "2.7s", opacity: 0.65, fill: "url(#lsGreenForest)", glow: true },
  { left: "40%", speed: "17s", delay: "-5s", scale: 0.6, sway: 20, swaySpeed: "3.8s", opacity: 0.5, fill: "url(#lsGreenGold)" },
  { left: "50%", speed: "12s", delay: "-3s", scale: 0.85, sway: 28, swaySpeed: "3s", opacity: 0.6, fill: "url(#lsGreenForest)", glow: true },
  { left: "62%", speed: "21s", delay: "-10s", scale: 0.45, sway: 14, swaySpeed: "5s", opacity: 0.4, fill: "url(#lsGreenSage)" },
  { left: "72%", speed: "13s", delay: "-4s", scale: 0.75, sway: 26, swaySpeed: "3.2s", opacity: 0.55, fill: "url(#lsGreenLight)" },
  { left: "84%", speed: "10s", delay: "-6s", scale: 1.05, sway: 36, swaySpeed: "2.4s", opacity: 0.65, fill: "url(#lsGreenForest)", glow: true },
  { left: "10%", speed: "14s", delay: "-8s", scale: 0.8, sway: 30, swaySpeed: "3.1s", opacity: 0.55, fill: "url(#lsGreenSage)" },
  { left: "35%", speed: "16s", delay: "-9s", scale: 0.55, sway: 18, swaySpeed: "4s", opacity: 0.45, fill: "url(#lsGreenLight)" },
  { left: "55%", speed: "11.5s", delay: "-2s", scale: 0.9, sway: 30, swaySpeed: "2.8s", opacity: 0.6, fill: "url(#lsGreenGold)" },
  { left: "46%", speed: "18s", delay: "-7s", scale: 0.5, sway: 15, swaySpeed: "4.6s", opacity: 0.4, fill: "url(#lsGreenSage)" },
  { left: "21%", speed: "13s", delay: "-4.5s", scale: 0.85, sway: 28, swaySpeed: "3s", opacity: 0.55, fill: "url(#lsGreenLight)", glow: true },
  { left: "68%", speed: "15s", delay: "-11s", scale: 0.65, sway: 22, swaySpeed: "3.5s", opacity: 0.5, fill: "url(#lsGreenSage)" },
  { left: "90%", speed: "12s", delay: "-1s", scale: 0.8, sway: 26, swaySpeed: "3.1s", opacity: 0.55, fill: "url(#lsGreenGold)" },
  { left: "78%", speed: "20s", delay: "-13s", scale: 0.45, sway: 12, swaySpeed: "4.8s", opacity: 0.35, fill: "url(#lsGreenForest)" },
  { left: "32%", speed: "9s", delay: "-1s", scale: 1.1, sway: 38, swaySpeed: "2.3s", opacity: 0.62, fill: "url(#lsGreenForest)", glow: true },
  { left: "94%", speed: "14s", delay: "-6s", scale: 0.6, sway: 20, swaySpeed: "3.6s", opacity: 0.48, fill: "url(#lsGreenLight)" },
];

interface LeafShowerBackgroundProps {
  embedded?: boolean;
}

/**
 * Falling heart-shaped leaves behind invitation content.
 */
export function LeafShowerBackground({ embedded = false }: LeafShowerBackgroundProps) {
  return (
    <div
      className={cn(
        "leaf-shower-bg density-adaptive",
        embedded && "leaf-shower-embedded"
      )}
      aria-hidden
    >
      <svg className="leaf-shower-defs" aria-hidden focusable="false">
        <defs>
          {/* Gradients representing botanical leaf colors */}
          <linearGradient id="lsGreenLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a8e6cf" />
            <stop offset="100%" stopColor="#56ab2f" />
          </linearGradient>
          <linearGradient id="lsGreenSage" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4fc79" />
            <stop offset="100%" stopColor="#96e6a1" />
          </linearGradient>
          <linearGradient id="lsGreenForest" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#84af9b" />
            <stop offset="50%" stopColor="#5c7c64" />
            <stop offset="100%" stopColor="#2c3e35" />
          </linearGradient>
          <linearGradient id="lsGreenGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2d1a6" />
            <stop offset="100%" stopColor="#6e7e60" />
          </linearGradient>
          <filter id="lsLeafGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {LEAVES.map((leaf, index) => (
        <div
          key={index}
          className="leaf-container"
          style={
            {
              "--left": leaf.left,
              "--speed": leaf.speed,
              "--delay": leaf.delay,
              "--scale": leaf.scale,
              "--sway-amount": `${leaf.sway}px`,
              "--sway-speed": leaf.swaySpeed,
              "--opacity": leaf.opacity,
            } as CSSProperties
          }
        >
          <svg
            className="leaf-svg"
            viewBox="0 0 24 24"
            style={{
              fill: leaf.fill,
              filter: leaf.glow
                ? "url(#lsLeafGlow) drop-shadow(0 2px 4px rgba(92, 124, 100, 0.25))"
                : "drop-shadow(0 1px 2px rgba(44, 62, 53, 0.15))",
            }}
          >
            {/* Heart shape leaf */}
            <path d={LEAF_HEART_PATH} />
            {/* Center leaf vein */}
            <path d="M12 5.5v12.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
            {/* Branch veins */}
            <path d="M12 9 C9.5 8 9.5 8 9.5 8" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <path d="M12 9 C14.5 8 14.5 8 14.5 8" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <path d="M12 12.5 C9 11 9 11 9 11" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <path d="M12 12.5 C15 11 15 11 15 11" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <path d="M12 16 C9.5 14.5 9.5 14.5 9.5 14.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <path d="M12 16 C14.5 14.5 14.5 14.5 14.5 14.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
          </svg>
        </div>
      ))}
    </div>
  );
}
