"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, className }: SectionHeadingProps) {
  return (
    <div className={className ?? "text-center mb-12 md:mb-16"}>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.3em] text-[color-mix(in_srgb,var(--template-primary)_60%,transparent)] mb-3"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[var(--template-text,#FFFFF0)] font-semibold"
      >
        {title}
      </motion.h2>
    </div>
  );
}
