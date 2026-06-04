"use client";

import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import type { CountdownSectionContract } from "@/templates/shared/sections/types";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";

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

const EMPTY_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function CountdownSectionInner({ countdown }: CountdownSectionContract) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(EMPTY_TIME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mountTimer = window.setTimeout(() => {
      setMounted(true);
      setTimeLeft(calcTimeLeft(countdown.targetDate));
    }, 0);

    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(countdown.targetDate));
    }, 1000);

    return () => {
      window.clearTimeout(mountTimer);
      clearInterval(interval);
    };
  }, [countdown.targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section id={PREVIEW_SECTION_IDS.countdown} className="px-6 py-12 md:py-16 bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Label */}
        {countdown.label && (
          <p className="font-[family-name:var(--font-heading)] text-lg md:text-xl text-[var(--template-primary)] italic mb-8 select-none">
            {countdown.label}
          </p>
        )}

        {/* Countdown Grid */}
        <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-lg mx-auto">
          {units.map((unit, i) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="flex flex-col items-center"
            >
              <div className="w-full aspect-square max-w-[90px] rounded-full border-2 border-double border-[var(--template-primary)]/40 bg-[var(--template-surface)]/40 flex flex-col items-center justify-center shadow-sm">
                <span className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[var(--template-text)] font-semibold tabular-nums">
                  {mounted ? String(unit.value).padStart(2, "0") : "--"}
                </span>
              </div>
              <span className="font-[family-name:var(--font-body)] text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[var(--template-text-muted)] mt-3 font-medium">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export const CountdownSection = memo(CountdownSectionInner);
