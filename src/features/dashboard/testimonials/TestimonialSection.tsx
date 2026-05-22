"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export function TestimonialSection() {
  // Duplicate testimonials to create a seamless infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="space-y-8 overflow-hidden py-4 relative">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-headline-lg text-champagne-gold mb-2 font-semibold">
          What Our Couples Say
        </h2>
      </div>

      {/* Cinematic Fade Overlays */}
      <div className="absolute top-16 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-charcoal-black to-transparent z-10 pointer-events-none" />
      <div className="absolute top-16 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-charcoal-black to-transparent z-10 pointer-events-none" />

      {/* Infinite Scrolling Marquee Container */}
      <div className="w-full overflow-hidden py-4 flex">
        <motion.div
          className="flex gap-6 w-max"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            ease: "linear",
            duration: 35,
            repeat: Infinity,
          }}
          // Pause on hover
          whileHover={{ animationPlayState: "paused" }}
          style={{ display: "flex" }}
        >
          {duplicatedTestimonials.map((testimonial, i) => (
            <div
              key={`${testimonial.id}-${i}`}
              className="shrink-0 w-[300px] md:w-[400px] bg-surface p-6 rounded-2xl border border-champagne-gold/20 flex flex-col gap-4 relative select-none"
            >
              {/* Decorative Quote Mark */}
              <div className="absolute -top-4 -left-2 text-champagne-gold/20 font-[family-name:var(--font-heading)] text-6xl select-none">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-1 text-champagne-gold">
                {Array.from({ length: testimonial.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={18}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="font-[family-name:var(--font-body)] text-on-surface italic relative z-10">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Couple Name */}
              <div className="mt-auto pt-4 border-t border-surface-bright">
                <p className="font-[family-name:var(--font-heading)] text-body-lg text-ivory font-medium">
                  {testimonial.coupleName}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

