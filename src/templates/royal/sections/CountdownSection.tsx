"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { CountdownData } from "@/types/wedding.types";

interface CountdownSectionProps {
  countdown: CountdownData;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * Royal Template — Countdown Section
 *
 * Live countdown timer to the wedding date with elegant typography.
 */
const EMPTY_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function CountdownSection({ countdown }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(EMPTY_TIME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calcTimeLeft(countdown.targetDate));

    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(countdown.targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown.targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section id="preview-section-countdown" className="px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Label */}
        {countdown.label && (
          <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold/60 mb-6">
            {countdown.label}
          </p>
        )}

        {/* Countdown grid */}
        <div className="grid grid-cols-4 gap-3 md:gap-6">
          {units.map((unit, i) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="flex flex-col items-center"
            >
              <div className="w-full aspect-square max-w-[100px] rounded-2xl bg-surface-container border border-champagne-gold/10 flex items-center justify-center mb-2">
                <span className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl text-ivory font-bold tabular-nums">
                  {mounted ? String(unit.value).padStart(2, "0") : "--"}
                </span>
              </div>
              <span className="font-[family-name:var(--font-body)] text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
