"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { BlurFade, BlurFadeText } from "@/components/magic-ui/blur-fade-text";

export function HeroSection() {
  return (
    <section className="relative space-y-6 pt-8 pb-8 text-center md:pt-16 md:pb-12">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-2xl h-[300px] bg-champagne-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 1, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <span className="inline-block font-[family-name:var(--font-body)] text-[10px] md:text-xs text-champagne-gold uppercase tracking-[0.3em] font-semibold bg-champagne-gold/5 border border-champagne-gold/15 px-4 py-1.5 rounded-full">
          Open Beta · Free Digital Wedding Invitations
        </span>
      </motion.div>

      {/* Main Heading — explicit lines so gold phrase never breaks mid-word on mobile */}
      <h1 className="relative z-10 mx-auto max-w-3xl font-[family-name:var(--font-heading)] text-[2rem] font-bold leading-tight sm:text-[2.25rem] sm:leading-[2.75rem] md:text-display-lg">
        <span className="block text-on-surface">
          <BlurFadeText text="Your Love Story," className="text-on-surface" delay={0.1} />
        </span>
        <span className="mt-1 block text-champagne-gold">
          <BlurFadeText text="Artfully Crafted" className="text-champagne-gold" delay={0.35} />
        </span>
      </h1>

      {/* Subheading */}
      <BlurFade
        delay={0.5}
        className="font-[family-name:var(--font-body)] text-body-md md:text-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed"
      >
        Create cinematic digital invitations that capture the elegance and
        emotion of your royal celebration. Free during beta, with instant
        sharing through WhatsApp and Instagram.
      </BlurFade>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 1, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
      >
        {/* Primary CTA */}
        <Link
          href="/template"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full gold-gradient text-charcoal-black font-[family-name:var(--font-body)] text-sm font-semibold tracking-wide hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          Begin Your Story
          <ArrowRight size={16} />
        </Link>

        {/* Secondary CTA */}
        <Link
          href="/preview/royal"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-champagne-gold/25 text-champagne-gold font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:bg-champagne-gold/5 hover:border-champagne-gold/40 active:scale-[0.98] transition-all duration-300"
        >
          <Play size={14} fill="currentColor" />
          Live Demo
        </Link>
      </motion.div>
    </section>
  );
}
