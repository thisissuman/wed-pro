"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { isValidDisplayUrl } from "@/lib/media-url";
import type { HeroSectionContract } from "@/templates/shared/sections/types";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
import { firstName, getOrderedCoupleMembers } from "@/lib/couple-order";
import { FloralWreath, BananaLeaf } from "../components/FloralOrnaments";
import { WeddingDateScratchReveal } from "../components/WeddingDateScratchReveal";

export function HeroSection({ couple, countdown, hero, weddingHashtag }: HeroSectionContract) {
  const [nameFirst, nameSecond] = getOrderedCoupleMembers(couple, couple.family);
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
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-transparent"
    >
      {/* Background Media */}
      {heroBackgroundSrc && isValidDisplayUrl(heroBackgroundSrc) && (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src={heroBackgroundSrc}
            alt="Wedding Hero Background"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      )}

      {/* Background Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: hero.backgroundMedia
            ? `rgba(0,0,0,${hero.overlayOpacity ?? 0.45})`
            : "radial-gradient(ellipse at center, color-mix(in srgb, var(--template-primary) 6%, transparent) 0%, transparent 80%)",
        }}
      />

      {/* Ambient gradient fade to base background at bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[25%] bg-gradient-to-t from-[var(--template-background)] to-transparent"
        aria-hidden="true"
      />

      {/* Botanical Banana Leaves watermark on sides */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-36 overflow-hidden flex items-center justify-start pointer-events-none z-0">
        <BananaLeaf className="w-full h-[60vh] -translate-x-[20%] rotate-[12deg] text-[var(--template-primary)]/10" />
      </div>
      <div className="absolute inset-y-0 right-0 w-24 md:w-36 overflow-hidden flex items-center justify-end pointer-events-none z-0">
        <BananaLeaf className="w-full h-[60vh] translate-x-[20%] -rotate-[12deg] text-[var(--template-primary)]/10" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto">
        {/* Overlay text */}
        {hero.overlayText && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-body)] text-[11px] uppercase tracking-[0.45em] text-[var(--template-primary)] mb-4 font-semibold"
          >
            {hero.overlayText}
          </motion.p>
        )}

        {/* Small subtitle indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.3em] text-[var(--template-text)] mb-8"
        >
          We Invite You to Celebrate
        </motion.p>

        {/* Main Monogram/Wreath Block */}
        <div className="relative flex items-center justify-center my-4">
          <motion.div
            initial={{ scale: 0.75, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 0.4, rotate: 0 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
            className="absolute z-0 pointer-events-none"
          >
            <FloralWreath className="w-56 h-56 md:w-64 md:h-64" />
          </motion.div>

          {/* Names block */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl text-[var(--template-text)] font-bold tracking-tight"
            >
              {firstName(nameFirst.person.name)}
            </motion.h1>

            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="font-[family-name:var(--font-heading)] text-3xl text-[var(--template-primary)] my-3 italic"
            >
              &amp;
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl text-[var(--template-text)] font-bold tracking-tight"
            >
              {firstName(nameSecond.person.name)}
            </motion.h1>
          </div>
        </div>

        {/* User custom subtitle */}
        {hero.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="font-[family-name:var(--font-body)] text-xs md:text-sm text-[var(--template-text-muted)] mt-6 max-w-sm leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>
        )}

        {/* Wedding date — scratch to reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="w-full max-w-md mx-auto mt-8"
        >
          <WeddingDateScratchReveal date={formattedDate} />
        </motion.div>

        {/* Hashtag */}
        {hashtag && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="mt-5 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.35em] text-[var(--template-primary)] font-semibold"
          >
            {hashtag.startsWith("#") ? hashtag : `#${hashtag}`}
          </motion.p>
        )}
      </div>
    </section>
  );
}
