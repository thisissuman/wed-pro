"use client";

import { motion } from "framer-motion";
import type { CoupleData } from "@/types/wedding.types";

interface CoupleSectionProps {
  couple: CoupleData;
}

/**
 * Royal Template — Couple Section
 *
 * Bride & Groom reveal with parent names, bios, and elegant layout.
 */
export function CoupleSection({ couple }: CoupleSectionProps) {
  const { bride, groom } = couple;

  return (
    <section id="preview-section-couple" className="px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Section heading */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold/60 mb-3"
          >
            With Love
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-ivory font-semibold"
          >
            Meet The Couple
          </motion.h2>
        </div>

        {/* Couple cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Groom */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-4"
          >
            {/* Photo placeholder */}
            <div className="w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full bg-surface-container border-2 border-champagne-gold/20 overflow-hidden flex items-center justify-center">
              {groom.photo?.trim() ? (
                <img
                  src={groom.photo}
                  alt={groom.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-[family-name:var(--font-heading)] text-4xl text-champagne-gold/40">
                  {groom.name[0]}
                </span>
              )}
            </div>
            <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-ivory font-semibold">
              {groom.name}
            </h3>
            {groom.parentNames && (
              <p className="font-[family-name:var(--font-body)] text-xs text-champagne-gold/60 tracking-wide">
                {groom.parentNames}
              </p>
            )}
            {groom.bio && (
              <p className="font-[family-name:var(--font-body)] text-sm text-on-surface-variant/80 leading-relaxed max-w-xs mx-auto italic">
                &ldquo;{groom.bio}&rdquo;
              </p>
            )}
          </motion.div>

          {/* Bride */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center space-y-4"
          >
            <div className="w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full bg-surface-container border-2 border-champagne-gold/20 overflow-hidden flex items-center justify-center">
              {bride.photo?.trim() ? (
                <img
                  src={bride.photo}
                  alt={bride.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-[family-name:var(--font-heading)] text-4xl text-champagne-gold/40">
                  {bride.name[0]}
                </span>
              )}
            </div>
            <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-ivory font-semibold">
              {bride.name}
            </h3>
            {bride.parentNames && (
              <p className="font-[family-name:var(--font-body)] text-xs text-champagne-gold/60 tracking-wide">
                {bride.parentNames}
              </p>
            )}
            {bride.bio && (
              <p className="font-[family-name:var(--font-body)] text-sm text-on-surface-variant/80 leading-relaxed max-w-xs mx-auto italic">
                &ldquo;{bride.bio}&rdquo;
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
