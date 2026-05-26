"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { CoupleSectionContract } from "@/templates/shared/sections/types";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
import { SectionHeading, TemplateSection } from "@/templates/shared/components";
import { cn } from "@/lib/utils";
import { isValidDisplayUrl } from "@/lib/media-url";

/**
 * Royal Template — Couple Section
 *
 * Bride & Groom reveal with parent names, bios, and elegant layout.
 */
export function CoupleSection({ couple }: CoupleSectionContract) {
  const { bride, groom } = couple;
  const family = couple.family;
  const brideFirst = family?.displayOrder === "bride-first";
  const groomParentLine =
    getStructuredParentLine("groom", family?.groom.fatherName, family?.groom.motherName) ||
    groom.parentNames;
  const brideParentLine =
    getStructuredParentLine("bride", family?.bride.fatherName, family?.bride.motherName) ||
    bride.parentNames;
  const groomPhoto = isValidDisplayUrl(groom.photo) ? groom.photo?.trim() : undefined;
  const bridePhoto = isValidDisplayUrl(bride.photo) ? bride.photo?.trim() : undefined;
  const showGrandparents = family?.includeGrandparents ?? false;

  return (
    <TemplateSection id={PREVIEW_SECTION_IDS.couple}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <SectionHeading eyebrow="With Love" title="Meet The Couple" />

        {/* Couple cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Groom */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn("text-center space-y-4", brideFirst && "order-2")}
          >
            {/* Photo placeholder */}
            <div className="template-media-slot relative mx-auto flex aspect-square w-36 items-center justify-center md:w-44 rounded-full border-2 border-champagne-gold/20">
              {groomPhoto ? (
                <Image
                  src={groomPhoto}
                  alt={groom.name}
                  fill
                  sizes="(max-width: 768px) 144px, 176px"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-[family-name:var(--font-heading)] text-4xl text-champagne-gold/40">
                  {groom.name[0]}
                </span>
              )}
            </div>
            <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[var(--template-text)] font-semibold">
              {groom.name}
            </h3>
            {groomParentLine && (
              <p className="font-[family-name:var(--font-body)] text-xs text-[var(--template-text-muted)] tracking-wide">
                {groomParentLine}
              </p>
            )}
            {showGrandparents && family?.groom.grandparentsNames && (
              <p className="mx-auto max-w-xs font-[family-name:var(--font-body)] text-[11px] leading-relaxed text-[var(--template-text-muted)]">
                Grandson of {family.groom.grandparentsNames}
              </p>
            )}
            {groom.bio && (
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--template-text-muted)] leading-relaxed max-w-xs mx-auto italic">
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
            className={cn("text-center space-y-4", brideFirst && "order-1")}
          >
            <div className="template-media-slot relative mx-auto flex aspect-square w-36 items-center justify-center md:w-44 rounded-full border-2 border-champagne-gold/20">
              {bridePhoto ? (
                <Image
                  src={bridePhoto}
                  alt={bride.name}
                  fill
                  sizes="(max-width: 768px) 144px, 176px"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-[family-name:var(--font-heading)] text-4xl text-champagne-gold/40">
                  {bride.name[0]}
                </span>
              )}
            </div>
            <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[var(--template-text)] font-semibold">
              {bride.name}
            </h3>
            {brideParentLine && (
              <p className="font-[family-name:var(--font-body)] text-xs text-[var(--template-text-muted)] tracking-wide">
                {brideParentLine}
              </p>
            )}
            {showGrandparents && family?.bride.grandparentsNames && (
              <p className="mx-auto max-w-xs font-[family-name:var(--font-body)] text-[11px] leading-relaxed text-[var(--template-text-muted)]">
                Granddaughter of {family.bride.grandparentsNames}
              </p>
            )}
            {bride.bio && (
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--template-text-muted)] leading-relaxed max-w-xs mx-auto italic">
                &ldquo;{bride.bio}&rdquo;
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </TemplateSection>
  );
}

function getStructuredParentLine(
  side: "bride" | "groom",
  fatherName?: string,
  motherName?: string
) {
  const parents = [fatherName, motherName].filter((value) => value?.trim()).join(" & ");
  if (!parents) return "";
  return `${side === "bride" ? "Daughter" : "Son"} of ${parents}`;
}
