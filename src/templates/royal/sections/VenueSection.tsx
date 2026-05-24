"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { appleMapsUrl, googleMapsUrl } from "@/lib/maps";
import type { VenueData } from "@/types/wedding.types";

interface VenueSectionProps {
  venue: VenueData;
}

/**
 * Royal Template — Venue Section
 *
 * Primary wedding venue with address and Google Maps CTA.
 */
export function VenueSection({ venue }: VenueSectionProps) {
  return (
    <section id="preview-section-venue" className="px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center space-y-6"
      >
        {/* Section heading */}
        <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold/60">
          The Venue
        </p>
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-ivory font-semibold">
          {venue.name}
        </h2>

        <p className="font-[family-name:var(--font-body)] text-sm text-on-surface-variant/80 leading-relaxed max-w-md mx-auto">
          {venue.address}
        </p>

        {/* Venue description */}
        {venue.description && (
          <p className="font-[family-name:var(--font-body)] text-xs text-on-surface-variant/60 leading-relaxed max-w-md mx-auto">
            {venue.description}
          </p>
        )}

        {/* Map deep links */}
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
    <div className="flex flex-wrap items-center justify-center gap-2">
      {google && (
        <motion.a
          href={google}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-champagne-gold/30 text-champagne-gold font-[family-name:var(--font-body)] text-sm font-medium hover:bg-champagne-gold/10 transition-colors duration-200"
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
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-champagne-gold/30 text-champagne-gold font-[family-name:var(--font-body)] text-sm font-medium hover:bg-champagne-gold/10 transition-colors duration-200"
        >
          <Navigation size={16} />
          Apple Maps
        </motion.a>
      )}
    </div>
  );
}
