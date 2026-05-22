"use client";

import { DemoCard } from "./DemoCard";
import { demoTemplates } from "@/data/templates";

export function LiveDemoSection() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <h2 className="font-[family-name:var(--font-heading)] text-headline-md text-champagne-gold font-medium">
          View Live Demo
        </h2>
      </div>

      {/* Responsive Grid/Carousel */}
      <div className="flex overflow-x-auto no-scrollbar gap-6 pb-8 -mx-[var(--spacing-container-margin)] px-[var(--spacing-container-margin)] md:mx-0 md:px-0 md:flex-row md:flex-wrap md:justify-center md:overflow-visible snap-x snap-mandatory">
        {demoTemplates.map((demo, i) => (
          <DemoCard
            key={demo.id}
            name={demo.name}
            imageUrl={demo.imageUrl}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
