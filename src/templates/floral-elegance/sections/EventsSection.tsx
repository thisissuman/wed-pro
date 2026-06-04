"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Navigation } from "lucide-react";
import { appleMapsUrl, googleMapsUrl } from "@/lib/maps";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
import type { WeddingEvent } from "@/types/wedding.types";

interface EventsSectionProps {
  events: WeddingEvent[];
}

const eventTypeEmoji: Record<string, string> = {
  mehendi: "🌿",
  haldi: "🌼",
  sangeet: "🌸",
  wedding: "🌺",
  reception: "🌹",
  other: "✨",
};

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <section id={PREVIEW_SECTION_IDS.events} className="px-6 py-16 md:py-24 bg-transparent">
      <div className="max-w-3xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.35em] text-[var(--template-primary)] mb-3 font-semibold">
            Celebrations
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[var(--template-text)] font-bold">
            Wedding Events
          </h2>
        </motion.div>

        {/* Events List */}
        <div className="space-y-8">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="relative rounded-[var(--template-card-radius)] bg-[var(--template-surface)]/60 border border-[color-mix(in_srgb,var(--template-primary)_15%,transparent)] p-6 md:p-8 overflow-hidden shadow-sm"
            >
              {/* Subtle design element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--template-primary)]/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                {/* Event Heading */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl select-none" role="img" aria-label="event icon">
                    {eventTypeEmoji[event.type] || "✨"}
                  </span>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl text-[var(--template-text)] font-semibold tracking-wide">
                    {event.title}
                  </h3>
                </div>

                {/* Description */}
                {event.description && (
                  <p className="font-[family-name:var(--font-body)] text-sm text-[var(--template-text-muted)] leading-relaxed mb-5 max-w-xl font-light">
                    {event.description}
                  </p>
                )}

                {/* Details Row */}
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-[var(--template-text-muted)] border-t border-[var(--template-primary)]/10 pt-4">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-[var(--template-primary)]" />
                    <span className="font-[family-name:var(--font-body)]">
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock size={14} className="text-[var(--template-primary)]" />
                    <span className="font-[family-name:var(--font-body)]">
                      {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin size={14} className="text-[var(--template-primary)]" />
                    <span className="font-[family-name:var(--font-body)]">
                      {event.venue}
                    </span>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <EventMapButtons event={event} />

                {/* Dress Code */}
                {event.dressCode && (
                  <p className="mt-4 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-[var(--template-text-muted)] font-medium">
                    Dress Code: <span className="text-[var(--template-primary)] font-semibold">{event.dressCode}</span>
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

function EventMapButtons({ event }: { event: WeddingEvent }) {
  const target = {
    coordinates: event.coordinates,
    label: event.venue || event.title,
    googleMapLink: event.googleMapLink,
  };
  const google = googleMapsUrl(target);
  const apple = appleMapsUrl(target);

  if (!google && !apple) return null;

  return (
    <div className="mt-5 flex flex-wrap gap-2.5">
      {google && (
        <a
          href={google}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--template-primary)]/20 bg-[var(--template-surface)] px-4 py-1.5 font-[family-name:var(--font-body)] text-xs text-[var(--template-primary)] font-medium transition duration-200 hover:bg-[var(--template-primary)]/10 shadow-sm"
        >
          <MapPin size={12} />
          Google Maps
        </a>
      )}
      {apple && (
        <a
          href={apple}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--template-primary)]/20 bg-[var(--template-surface)] px-4 py-1.5 font-[family-name:var(--font-body)] text-xs text-[var(--template-primary)] font-medium transition duration-200 hover:bg-[var(--template-primary)]/10 shadow-sm"
        >
          <Navigation size={12} />
          Apple Maps
        </a>
      )}
    </div>
  );
}
