"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { CoupleSectionContract } from "@/templates/shared/sections/types";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
import { SectionHeading, TemplateSection } from "@/templates/shared/components";
import { cn } from "@/lib/utils";
import { isValidDisplayUrl } from "@/lib/media-url";
import { CornerLeaves } from "../components/FloralOrnaments";

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
    <TemplateSection id={PREVIEW_SECTION_IDS.couple} className="relative overflow-hidden">
      {/* Corner leaf accents */}
      <CornerLeaves className="absolute -top-6 -left-6 transform rotate-90 w-24 h-24 md:w-32 md:h-32 text-[var(--template-secondary)]" />
      <CornerLeaves className="absolute -bottom-6 -right-6 transform -rotate-90 w-24 h-24 md:w-32 md:h-32 text-[var(--template-secondary)]" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <SectionHeading eyebrow="Together with Families" title="Meet the Couple" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 mt-12 md:mt-16">
          {/* Groom Block */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn("text-center space-y-5 flex flex-col items-center", brideFirst && "order-2")}
          >
            {/* Image Frame with floral background */}
            <div className="template-media-slot relative flex aspect-square w-40 items-center justify-center md:w-48 rounded-full border-4 border-double border-[var(--template-primary)] bg-[var(--template-surface)] shadow-md overflow-hidden">
              {groomPhoto ? (
                <Image
                  src={groomPhoto}
                  alt={groom.name}
                  fill
                  sizes="(max-width: 768px) 160px, 192px"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-[family-name:var(--font-heading)] text-5xl text-[var(--template-primary)]/40 font-semibold select-none">
                  {groom.name[0]}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[var(--template-text)] font-semibold tracking-wide">
                {groom.name}
              </h3>
              {groomParentLine && (
                <p className="font-[family-name:var(--font-body)] text-xs text-[var(--template-primary)] tracking-wide font-medium">
                  {groomParentLine}
                </p>
              )}
              {showGrandparents && family?.groom.grandparentsNames && (
                <p className="font-[family-name:var(--font-body)] text-[10px] text-[var(--template-text-muted)] tracking-wider italic">
                  Grandson of {family.groom.grandparentsNames}
                </p>
              )}
            </div>

            {groom.bio && (
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--template-text-muted)] leading-relaxed max-w-xs italic font-light px-4">
                &ldquo;{groom.bio}&rdquo;
              </p>
            )}
          </motion.div>

          {/* Bride Block */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={cn("text-center space-y-5 flex flex-col items-center", brideFirst && "order-1")}
          >
            <div className="template-media-slot relative flex aspect-square w-40 items-center justify-center md:w-48 rounded-full border-4 border-double border-[var(--template-primary)] bg-[var(--template-surface)] shadow-md overflow-hidden">
              {bridePhoto ? (
                <Image
                  src={bridePhoto}
                  alt={bride.name}
                  fill
                  sizes="(max-width: 768px) 160px, 192px"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-[family-name:var(--font-heading)] text-5xl text-[var(--template-primary)]/40 font-semibold select-none">
                  {bride.name[0]}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[var(--template-text)] font-semibold tracking-wide">
                {bride.name}
              </h3>
              {brideParentLine && (
                <p className="font-[family-name:var(--font-body)] text-xs text-[var(--template-primary)] tracking-wide font-medium">
                  {brideParentLine}
                </p>
              )}
              {showGrandparents && family?.bride.grandparentsNames && (
                <p className="font-[family-name:var(--font-body)] text-[10px] text-[var(--template-text-muted)] tracking-wider italic">
                  Granddaughter of {family.bride.grandparentsNames}
                </p>
              )}
            </div>

            {bride.bio && (
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--template-text-muted)] leading-relaxed max-w-xs italic font-light px-4">
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
