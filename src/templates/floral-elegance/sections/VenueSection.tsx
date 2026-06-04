"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { appleMapsUrl, googleMapsUrl } from "@/lib/maps";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
import type { VenueData } from "@/types/wedding.types";

interface VenueSectionProps {
  venue: VenueData;
}

export function VenueSection({ venue }: VenueSectionProps) {
  return (
    <section id={PREVIEW_SECTION_IDS.venue} className="px-6 py-16 md:py-24 bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center space-y-6"
      >
        {/* Section Heading */}
        <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.35em] text-[var(--template-primary)] font-semibold">
          The Venue
        </p>
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[var(--template-text)] font-bold">
          {venue.name}
        </h2>

        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--template-text-muted)] leading-relaxed max-w-md mx-auto font-light">
          {venue.address}
        </p>

        {/* Venue Description */}
        {venue.description && (
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--template-text-muted)]/70 leading-relaxed max-w-md mx-auto italic font-light">
            {venue.description}
          </p>
        )}

        {/* Maps Navigation */}
        <VenueMapButtons venue={venue} />
      </motion.div>
    </section>
  );
}

function VenueMapButtons({ venue }: { venue: VenueData }) {
  const target = { coordinates: venue.coordinates, label: venue.name, googleMapLink: venue.googleMapLink };
  const google = googleMapsUrl(target);
  const apple = appleMapsUrl(target);

  if (!google && !apple) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
      {google && (
        <motion.a
          href={google}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--template-primary)]/20 bg-[var(--template-surface)] text-[var(--template-primary)] font-[family-name:var(--font-body)] text-sm font-semibold hover:bg-[var(--template-primary)]/10 shadow-sm transition-colors duration-200"
        >
          <MapPin size={16} />
          Google Maps
        </motion.a>
      )}
      {apple && (
        <motion.a
          href={apple}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--template-primary)]/20 bg-[var(--template-surface)] text-[var(--template-primary)] font-[family-name:var(--font-body)] text-sm font-semibold hover:bg-[var(--template-primary)]/10 shadow-sm transition-colors duration-200"
        >
          <Navigation size={16} />
          Apple Maps
        </motion.a>
      )}
    </div>
  );
}
