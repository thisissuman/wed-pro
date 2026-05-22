"use client";

import { motion } from "framer-motion";
import type { BlessingData } from "@/types/wedding.types";

interface BlessingSectionProps {
  blessing: BlessingData;
}

/**
 * Royal Template — Blessing Section
 *
 * Family blessing message with elegant, breathable typography.
 */
export function BlessingSection({ blessing }: BlessingSectionProps) {
  return (
    <section className="px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto text-center space-y-6"
      >
        {/* Decorative ornament */}
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-champagne-gold/40 to-transparent mx-auto" />

        {/* Blessing message */}
        <p className="font-[family-name:var(--font-heading)] text-xl md:text-2xl text-ivory/90 leading-relaxed italic">
          &ldquo;{blessing.message}&rdquo;
        </p>

        {/* From */}
        {blessing.from && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.2em] text-champagne-gold/60"
          >
            — {blessing.from}
          </motion.p>
        )}

        {/* Decorative ornament */}
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-champagne-gold/40 to-transparent mx-auto" />
      </motion.div>
    </section>
  );
}
