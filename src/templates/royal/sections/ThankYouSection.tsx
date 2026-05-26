"use client";

import { motion } from "framer-motion";
import { firstName, getOrderedCoupleMembers } from "@/lib/couple-order";
import type { ThankYouData, CoupleData } from "@/types/wedding.types";

interface ThankYouSectionProps {
  thankYou: ThankYouData;
  couple: CoupleData;
}

/**
 * Royal Template — Thank You Section
 *
 * Emotional closure with couple names and gratitude message.
 */
export function ThankYouSection({ thankYou, couple }: ThankYouSectionProps) {
  const [nameFirst, nameSecond] = getOrderedCoupleMembers(couple, couple.family);

  return (
    <section className="px-6 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="max-w-xl mx-auto text-center space-y-8"
      >
        {/* Decorative ornament */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-champagne-gold/40 to-transparent mx-auto" />

        {/* Thank you message */}
        <p className="font-[family-name:var(--font-heading)] text-lg md:text-xl text-ivory/80 leading-relaxed italic">
          {thankYou.message}
        </p>

        {/* Couple names */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-1"
        >
          <p className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-champagne-gold font-semibold">
            {firstName(nameFirst.person.name)} &amp; {firstName(nameSecond.person.name)}
          </p>
          <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold/50">
            With Love
          </p>
        </motion.div>

        {/* Decorative ornament */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-champagne-gold/40 to-transparent mx-auto" />
      </motion.div>
    </section>
  );
}
