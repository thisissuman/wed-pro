"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { templates } from "@/data/templates";

export function FinalCTA() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative rounded-3xl overflow-hidden mt-12 border border-champagne-gold/20 gold-aura"
      id="templates"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${templates[0].imageUrl}")` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-charcoal-black/80 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 p-10 md:p-16 text-center space-y-6">
        <h2 className="font-[family-name:var(--font-heading)] text-headline-lg md:text-display-lg text-champagne-gold font-bold">
          Begin Your Wedding Story Today.
        </h2>
        <p className="font-[family-name:var(--font-body)] text-body-md text-on-surface-variant max-w-xl mx-auto">
          Choose from our curated collection of premium templates and create
          your cinematic invitation in minutes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Link
            href="/template"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full gold-gradient text-deep-maroon font-[family-name:var(--font-body)] text-sm font-semibold tracking-wide hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Begin Your Story
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/template"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-champagne-gold/25 text-champagne-gold font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:bg-champagne-gold/5 hover:border-champagne-gold/40 active:scale-[0.98] transition-all duration-300"
          >
            Explore Templates
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
