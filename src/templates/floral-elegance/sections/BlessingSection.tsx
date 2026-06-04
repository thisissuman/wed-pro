"use client";

import { motion } from "framer-motion";
import type { BlessingSectionContract } from "@/templates/shared/sections/types";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
import { FloralDivider } from "../components/FloralOrnaments";

export function BlessingSection({ blessing }: BlessingSectionContract) {
  if (!blessing.message?.trim()) return null;

  return (
    <section
      id={PREVIEW_SECTION_IDS.blessing}
      className="px-6 py-16 md:py-24 relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center space-y-6"
      >
        <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.35em] text-[var(--template-text-muted)] font-medium">
          Family Blessings
        </p>

        <div className="relative p-8 md:p-12 rounded-[var(--template-card-radius)] border-2 border-double border-[var(--template-primary)]/20 bg-[var(--template-surface)]/60 backdrop-blur-sm shadow-sm space-y-6">
          <p className="font-[family-name:var(--font-heading)] text-lg md:text-xl text-[var(--template-text)] italic leading-relaxed font-light">
            &ldquo;{blessing.message}&rdquo;
          </p>

          {blessing.from && (
            <p className="font-[family-name:var(--font-body)] text-xs text-[var(--template-primary)] font-semibold tracking-wider uppercase pt-2">
              — {blessing.from}
            </p>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <FloralDivider className="w-48 text-[var(--template-primary)]" />
        </div>
      </motion.div>
    </section>
  );
}
