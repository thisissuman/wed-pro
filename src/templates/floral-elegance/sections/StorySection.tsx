"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { StorySectionContract } from "@/templates/shared/sections/types";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
import { SectionHeading, TemplateSection } from "@/templates/shared/components";
import { isValidDisplayUrl } from "@/lib/media-url";

export function StorySection({ story }: StorySectionContract) {
  const milestones = story.timeline || [];
  if (milestones.length === 0) return null;

  return (
    <TemplateSection id={PREVIEW_SECTION_IDS.story} className="relative overflow-hidden bg-transparent">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="Our Journey"
          title={story.heading || "Our Love Story"}
        />

        {story.quote && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center font-[family-name:var(--font-heading)] text-lg md:text-xl text-[var(--template-primary)] italic max-w-lg mx-auto mt-4 mb-16 leading-relaxed px-4 select-none"
          >
            &ldquo;{story.quote}&rdquo;
          </motion.p>
        )}

        {/* Timeline container */}
        <div className="relative border-l border-[var(--template-primary)]/20 ml-4 md:ml-12 pl-6 md:pl-10 space-y-12">
          {milestones.map((milestone, i) => {
            const photo = isValidDisplayUrl(milestone.photo) ? milestone.photo?.trim() : undefined;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="relative space-y-3"
              >
                {/* Timeline node node - botanical leaf spray shape or delicate ring */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-2 border-[var(--template-primary)] bg-[var(--template-surface)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--template-primary)]" />
                  </div>
                </div>

                <div className="space-y-1">
                  {milestone.date && (
                    <span className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-[var(--template-primary)] font-semibold">
                      {milestone.date}
                    </span>
                  )}
                  <h3 className="font-[family-name:var(--font-heading)] text-xl text-[var(--template-text)] font-semibold">
                    {milestone.title}
                  </h3>
                </div>

                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--template-text-muted)] leading-relaxed max-w-xl font-light">
                  {milestone.description}
                </p>

                {photo && (
                  <div className="template-media-slot relative w-full max-w-md aspect-[16/10] rounded-[var(--template-card-radius)] overflow-hidden shadow-sm mt-4 border border-[var(--template-primary)]/10">
                    <Image
                      src={photo}
                      alt={milestone.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                      className="object-cover object-center"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </TemplateSection>
  );
}
