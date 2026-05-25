"use client";

import { motion } from "framer-motion";
import type { BlessingSectionContract } from "@/templates/shared/sections/types";
import {
  GoldOrnamentDivider,
  TemplateSection,
} from "@/templates/shared/components";

/**
 * Royal Template — Blessing Section
 */
export function BlessingSection({ blessing }: BlessingSectionContract) {
  return (
    <TemplateSection>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto text-center space-y-6"
      >
        <GoldOrnamentDivider />

        <p className="font-[family-name:var(--font-heading)] text-xl md:text-2xl text-[var(--template-text,#FFFFF0)]/90 leading-relaxed italic">
          &ldquo;{blessing.message}&rdquo;
        </p>

        {blessing.from && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--template-primary)_60%,transparent)]"
          >
            — {blessing.from}
          </motion.p>
        )}

        <GoldOrnamentDivider />
      </motion.div>
    </TemplateSection>
  );
}
