"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import "./love-shower.css";

const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

type HeartSpec = {
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

/** Red-leaning palette tuned for dark template bg. */
const HEARTS: HeartSpec[] = [
  { left: "6%", speed: "14s", delay: "-2s", scale: 0.7, sway: 22, swaySpeed: "3.2s", opacity: 0.55, fill: "url(#lsGradGold)" },
  { left: "18%", speed: "18s", delay: "-9s", scale: 0.45, sway: 14, swaySpeed: "4.2s", opacity: 0.38, fill: "url(#lsGradBlush)" },
  { left: "30%", speed: "10s", delay: "-1s", scale: 1, sway: 36, swaySpeed: "2.5s", opacity: 0.62, fill: "url(#lsGradRose)", glow: true },
  { left: "42%", speed: "16s", delay: "-6s", scale: 0.55, sway: 20, swaySpeed: "3.6s", opacity: 0.42, fill: "url(#lsGradGold)" },
  { left: "52%", speed: "11s", delay: "-4s", scale: 0.85, sway: 28, swaySpeed: "2.9s", opacity: 0.58, fill: "url(#lsGradRose)", glow: true },
  { left: "64%", speed: "20s", delay: "-12s", scale: 0.38, sway: 12, swaySpeed: "4.8s", opacity: 0.35, fill: "url(#lsGradBlush)" },
  { left: "74%", speed: "12s", delay: "-3s", scale: 0.72, sway: 26, swaySpeed: "3.1s", opacity: 0.5, fill: "url(#lsGradGold)" },
  { left: "86%", speed: "9s", delay: "-5s", scale: 1.1, sway: 38, swaySpeed: "2.3s", opacity: 0.6, fill: "url(#lsGradRose)", glow: true },
  { left: "12%", speed: "13s", delay: "-7s", scale: 0.8, sway: 30, swaySpeed: "3s", opacity: 0.48, fill: "url(#lsGradBlush)" },
  { left: "38%", speed: "15s", delay: "-11s", scale: 0.5, sway: 18, swaySpeed: "3.8s", opacity: 0.4, fill: "url(#lsGradGold)" },
  { left: "58%", speed: "10.5s", delay: "-2.5s", scale: 0.95, sway: 34, swaySpeed: "2.6s", opacity: 0.55, fill: "url(#lsGradRose)" },
  { left: "48%", speed: "17s", delay: "-8s", scale: 0.48, sway: 16, swaySpeed: "4.4s", opacity: 0.36, fill: "url(#lsGradBlush)" },
  { left: "22%", speed: "12.5s", delay: "-5.5s", scale: 0.88, sway: 32, swaySpeed: "2.8s", opacity: 0.52, fill: "url(#lsGradGold)", glow: true },
  { left: "70%", speed: "14.5s", delay: "-10s", scale: 0.62, sway: 24, swaySpeed: "3.4s", opacity: 0.46, fill: "url(#lsGradBlush)" },
  { left: "92%", speed: "11.5s", delay: "-1.5s", scale: 0.78, sway: 28, swaySpeed: "3s", opacity: 0.5, fill: "url(#lsGradGold)" },
  { left: "80%", speed: "19s", delay: "-14s", scale: 0.42, sway: 14, swaySpeed: "4.6s", opacity: 0.32, fill: "url(#lsGradRose)" },
  { left: "34%", speed: "8.5s", delay: "-0.5s", scale: 1.15, sway: 40, swaySpeed: "2.2s", opacity: 0.58, fill: "url(#lsGradGold)", glow: true },
  { left: "96%", speed: "13.5s", delay: "-6.5s", scale: 0.58, sway: 22, swaySpeed: "3.5s", opacity: 0.44, fill: "url(#lsGradBlush)" },
];

interface LoveShowerBackgroundProps {
  embedded?: boolean;
}

/**
 * Falling hearts behind invitation content — CSS transform/opacity only.
 */
export function LoveShowerBackground({ embedded = false }: LoveShowerBackgroundProps) {
  return (
    <div
      className={cn(
        "love-shower-bg density-adaptive",
        embedded && "love-shower-embedded"
      )}
      aria-hidden
    >
      <svg className="love-shower-defs" aria-hidden focusable="false">
        <defs>
          <linearGradient id="lsGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="100%" stopColor="#d90429" />
          </linearGradient>
          <linearGradient id="lsGradRose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff758f" />
            <stop offset="50%" stopColor="#ff4d6d" />
            <stop offset="100%" stopColor="#c1121f" />
          </linearGradient>
          <linearGradient id="lsGradBlush" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb3c1" />
            <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0.85" />
          </linearGradient>
          <filter id="lsHeartGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {HEARTS.map((heart, index) => (
        <div
          key={index}
          className="heart-container"
          style={
            {
              "--left": heart.left,
              "--speed": heart.speed,
              "--delay": heart.delay,
              "--scale": heart.scale,
              "--sway-amount": `${heart.sway}px`,
              "--sway-speed": heart.swaySpeed,
              "--opacity": heart.opacity,
            } as CSSProperties
          }
        >
          <svg
            className="heart-svg"
            viewBox="0 0 24 24"
            style={{
              fill: heart.fill,
              filter: heart.glow
                ? "url(#lsHeartGlow) drop-shadow(0 2px 6px rgba(255, 77, 109, 0.35))"
                : "drop-shadow(0 1px 3px rgba(217, 4, 41, 0.22))",
            }}
          >
            <path d={HEART_PATH} />
          </svg>
        </div>
      ))}
    </div>
  );
}
