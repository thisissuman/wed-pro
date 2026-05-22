"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import type { WeddingEvent } from "@/types/wedding.types";

interface EventsSectionProps {
  events: WeddingEvent[];
}

const eventTypeEmoji: Record<string, string> = {
  mehendi: "🌿",
  haldi: "🌻",
  sangeet: "🎶",
  wedding: "💍",
  reception: "🥂",
  other: "✨",
};

/**
 * Royal Template — Events Section
 *
 * Timeline of wedding events (Mehendi, Haldi, Sangeet, Wedding, Reception).
 * Each event card supports venue, time, and Google Maps link.
 */
export function EventsSection({ events }: EventsSectionProps) {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold/60 mb-3">
            Celebrations
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-ivory font-semibold">
            Wedding Events
          </h2>
        </motion.div>

        {/* Events timeline */}
        <div className="space-y-6 md:space-y-8">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative rounded-2xl bg-surface-container border border-champagne-gold/10 p-6 md:p-8 overflow-hidden"
            >
              {/* Subtle gold glow in top-right */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-champagne-gold/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Event emoji + title */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">
                    {eventTypeEmoji[event.type] || "✨"}
                  </span>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl text-ivory font-semibold">
                    {event.title}
                  </h3>
                </div>

                {/* Description */}
                {event.description && (
                  <p className="font-[family-name:var(--font-body)] text-sm text-on-surface-variant/80 leading-relaxed mb-4 max-w-xl">
                    {event.description}
                  </p>
                )}

                {/* Date, time, venue details */}
                <div className="flex flex-wrap gap-4 text-xs text-champagne-gold/70">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span className="font-[family-name:var(--font-body)]">
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} />
                    <span className="font-[family-name:var(--font-body)]">
                      {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    <span className="font-[family-name:var(--font-body)]">
                      {event.venue}
                    </span>
                  </div>
                </div>

                {/* Google Maps CTA */}
                {event.googleMapLink && (
                  <a
                    href={event.googleMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 font-[family-name:var(--font-body)] text-xs text-champagne-gold hover:text-champagne-gold/80 underline underline-offset-2 transition-colors"
                  >
                    <MapPin size={12} />
                    View on Map
                  </a>
                )}

                {/* Dress code */}
                {event.dressCode && (
                  <p className="mt-3 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50">
                    Dress Code: <span className="text-champagne-gold/60">{event.dressCode}</span>
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
