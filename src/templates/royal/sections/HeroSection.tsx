"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { isValidDisplayUrl } from "@/lib/media-url";
import type { HeroSectionContract } from "@/templates/shared/sections/types";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
import { ScratchReveal } from "../components/ScratchReveal";
import { templateMotion } from "../../shared/motion/presets";

/**
 * Royal Template — Hero Section
 *
 * The emotional anchor of the invitation.
 * Animated couple names, wedding date, subtitle, and a cinematic reveal.
 */
export function HeroSection({ couple, countdown, hero, weddingHashtag }: HeroSectionContract) {
  const heroBackgroundSrc = hero.backgroundMedia?.trim();
  const hashtag = weddingHashtag?.trim();
  const weddingDate = new Date(countdown.targetDate);
  const formattedDate = weddingDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      id={PREVIEW_SECTION_IDS.hero}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Background media — next/image for optimized LCP */}
      {heroBackgroundSrc && isValidDisplayUrl(heroBackgroundSrc) && (
        <Image
          src={heroBackgroundSrc}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 100vw"
          className="object-cover"
          aria-hidden="true"
        />
      )}

      {/* Background overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: hero.backgroundMedia
            ? `rgba(0,0,0,${hero.overlayOpacity ?? 0.7})`
            : "radial-gradient(ellipse at center, color-mix(in srgb, var(--template-primary) 8%, transparent) 0%, transparent 70%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[30%] bg-gradient-to-t from-[#131313] to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Decorative top ornament line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ ...templateMotion.curtain, duration: 0.8, delay: 0.2 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-[var(--template-primary)] to-transparent mb-8"
        />

        {/* Overlay text (e.g. "Save the Date") */}
        {hero.overlayText && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-[family-name:var(--font-body)] text-[10px] md:text-xs uppercase tracking-[0.4em] text-[color-mix(in_srgb,var(--template-primary)_50%,transparent)] mb-4"
          >
            {hero.overlayText}
          </motion.p>
        )}

        {/* Wedding label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-[family-name:var(--font-body)] text-[10px] md:text-xs uppercase tracking-[0.4em] text-[color-mix(in_srgb,var(--template-primary)_70%,transparent)] mb-6"
        >
          Wedding Invitation
        </motion.p>

        {/* Groom name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl lg:text-7xl text-[var(--template-text)] font-bold leading-tight"
        >
          {couple.groom.name.split(" ")[0]}
        </motion.h1>

        {/* Ampersand */}
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[var(--template-primary)] my-3 italic"
        >
          &amp;
        </motion.span>

        {/* Bride name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl lg:text-7xl text-[var(--template-text)] font-bold leading-tight"
        >
          {couple.bride.name.split(" ")[0]}
        </motion.h1>

        {/* Subtitle */}
        {hero.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="font-[family-name:var(--font-body)] text-xs md:text-sm text-[color-mix(in_srgb,var(--template-text-muted)_70%,transparent)] mt-4 max-w-md leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>
        )}

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ ...templateMotion.curtain, duration: 0.8, delay: 1.2 }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--template-primary)] to-transparent my-8"
        />

        {/* Wedding date — scratch to reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="w-full max-w-xs mx-auto"
        >
          <ScratchReveal label="Scratch to reveal the date">
            <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-[color-mix(in_srgb,var(--template-primary)_80%,transparent)] tracking-widest uppercase py-3">
              {formattedDate}
            </p>
          </ScratchReveal>
        </motion.div>

        {hashtag && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.55 }}
            className="mt-3 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.28em] text-[color-mix(in_srgb,var(--template-primary)_55%,transparent)]"
          >
            {hashtag.startsWith("#") ? hashtag : `#${hashtag}`}
          </motion.p>
        )}

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
            className="w-5 h-8 rounded-full border border-[color-mix(in_srgb,var(--template-primary)_30%,transparent)] flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-[color-mix(in_srgb,var(--template-primary)_60%,transparent)]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
