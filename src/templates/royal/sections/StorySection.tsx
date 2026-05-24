"use client";

import { motion } from "framer-motion";
import type { StoryData } from "@/types/wedding.types";

interface StorySectionProps {
  story: StoryData;
}

/**
 * Royal Template — Story Section
 *
 * Couple's love story timeline with emotional pacing.
 */
export function StorySection({ story }: StorySectionProps) {
  const timeline = story.timeline;

  return (
    <section id="preview-section-story" className="px-6 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold/60 mb-3">
            Our Journey
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-ivory font-semibold">
            {story.heading || "Our Love Story"}
          </h2>
          {story.quote && (
            <p className="font-[family-name:var(--font-heading)] text-sm md:text-base text-on-surface-variant/60 italic mt-4 max-w-md mx-auto">
              &ldquo;{story.quote}&rdquo;
            </p>
          )}
        </motion.div>

        {/* Timeline */}
        {timeline.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-champagne-gold/20 bg-charcoal-black/20 px-6 py-8 text-center">
            <p className="font-[family-name:var(--font-body)] text-sm text-on-surface-variant/70">
              Your love story milestones will appear here as you add them in the editor.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-champagne-gold/15" />

            <div className="space-y-12">
              {timeline.map((milestone, i) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative pl-12 md:pl-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 md:left-1/2 md:-translate-x-1/2 top-1 w-3 h-3 rounded-full bg-champagne-gold/40 border-2 border-champagne-gold/60" />

                  {/* Content — alternates sides on desktop */}
                  <div
                    className={`md:w-[45%] ${
                      i % 2 === 0 ? "md:ml-auto md:pl-8" : "md:mr-auto md:pr-8 md:text-right"
                    }`}
                  >
                    {milestone.date && (
                      <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-champagne-gold/50 mb-1">
                        {milestone.date}
                      </p>
                    )}
                    <h3 className="font-[family-name:var(--font-heading)] text-xl text-ivory font-semibold mb-2">
                      {milestone.title}
                    </h3>
                    <p className="font-[family-name:var(--font-body)] text-sm text-on-surface-variant/80 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
