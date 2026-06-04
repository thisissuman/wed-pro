"use client";

import { motion } from "framer-motion";
import { firstName, getOrderedCoupleMembers } from "@/lib/couple-order";
import type { ThankYouData, CoupleData } from "@/types/wedding.types";
import { FloralDivider } from "../components/FloralOrnaments";

interface ThankYouSectionProps {
  thankYou: ThankYouData;
  couple: CoupleData;
}

export function ThankYouSection({ thankYou, couple }: ThankYouSectionProps) {
  const [nameFirst, nameSecond] = getOrderedCoupleMembers(couple, couple.family);

  return (
    <section className="px-6 py-16 md:py-24 bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="max-w-xl mx-auto text-center space-y-6"
      >
        <div className="flex justify-center">
          <FloralDivider className="w-32 text-[var(--template-primary)]/40" />
        </div>

        {/* Thank You Message */}
        <p className="font-[family-name:var(--font-heading)] text-lg md:text-xl text-[var(--template-text)] leading-relaxed italic font-light px-4 select-none">
          {thankYou.message}
        </p>

        {/* Couple Names */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-1 pt-3"
        >
          <p className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[var(--template-primary)] font-bold">
            {firstName(nameFirst.person.name)} &amp; {firstName(nameSecond.person.name)}
          </p>
          <p className="font-[family-name:var(--font-body)] text-[9px] uppercase tracking-[0.3em] text-[var(--template-text-muted)] font-semibold">
            With Love
          </p>
        </motion.div>

        <div className="flex justify-center pt-2">
          <FloralDivider className="w-32 text-[var(--template-primary)]/40" />
        </div>
      </motion.div>
    </section>
  );
}
