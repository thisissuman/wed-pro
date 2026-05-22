"use client";

import { motion } from "framer-motion";
import type { CoupleData, CountdownData, HeroData } from "@/types/wedding.types";

interface HeroSectionProps {
  couple: CoupleData;
  countdown: CountdownData;
  hero: HeroData;
}

/**
 * Royal Template — Hero Section
 *
 * The emotional anchor of the invitation.
 * Animated couple names, wedding date, subtitle, and a cinematic reveal.
 */
export function HeroSection({ couple, countdown, hero }: HeroSectionProps) {
  const weddingDate = new Date(countdown.targetDate);
  const formattedDate = weddingDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background media */}
      {hero.backgroundMedia && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${hero.backgroundMedia}")` }}
        />
      )}

      {/* Background overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: hero.backgroundMedia
            ? `rgba(0,0,0,${hero.overlayOpacity ?? 0.7})`
            : "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Decorative top ornament line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-champagne-gold to-transparent mb-8"
        />

        {/* Overlay text (e.g. "Save the Date") */}
        {hero.overlayText && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-[family-name:var(--font-body)] text-[10px] md:text-xs uppercase tracking-[0.4em] text-champagne-gold/50 mb-4"
          >
            {hero.overlayText}
          </motion.p>
        )}

        {/* Wedding label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-[family-name:var(--font-body)] text-[10px] md:text-xs uppercase tracking-[0.4em] text-champagne-gold/70 mb-6"
        >
          Wedding Invitation
        </motion.p>

        {/* Groom name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl lg:text-7xl text-ivory font-bold leading-tight"
        >
          {couple.groom.name.split(" ")[0]}
        </motion.h1>

        {/* Ampersand */}
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-champagne-gold my-3 italic"
        >
          &amp;
        </motion.span>

        {/* Bride name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl lg:text-7xl text-ivory font-bold leading-tight"
        >
          {couple.bride.name.split(" ")[0]}
        </motion.h1>

        {/* Subtitle */}
        {hero.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="font-[family-name:var(--font-body)] text-xs md:text-sm text-on-surface-variant/70 mt-4 max-w-md leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>
        )}

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-champagne-gold to-transparent my-8"
        />

        {/* Wedding date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="font-[family-name:var(--font-body)] text-sm md:text-base text-champagne-gold/80 tracking-widest uppercase"
        >
          {formattedDate}
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-champagne-gold/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-champagne-gold/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
