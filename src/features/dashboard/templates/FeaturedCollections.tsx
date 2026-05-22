"use client";

import { TemplateCard } from "./TemplateCard";
import { templates } from "@/data/templates";

export function FeaturedCollections() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <h2 className="font-[family-name:var(--font-heading)] text-headline-md text-champagne-gold font-medium">
          Featured Collections
        </h2>
        <button className="font-[family-name:var(--font-body)] text-xs font-semibold text-on-surface-variant hover:text-champagne-gold transition-colors uppercase tracking-widest">
          View All
        </button>
      </div>

      {/* Responsive Grid/Carousel */}
      <div className="flex overflow-x-auto no-scrollbar gap-6 pb-8 -mx-[var(--spacing-container-margin)] px-[var(--spacing-container-margin)] md:mx-0 md:px-0 md:flex-row md:flex-wrap md:justify-center md:overflow-visible snap-x snap-mandatory">
        {templates.map((template, i) => (
          <TemplateCard key={template.id} template={template} index={i} />
        ))}
      </div>
    </section>
  );
}
