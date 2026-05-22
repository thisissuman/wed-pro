"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
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
    <section className="px-6 py-16 md:py-24">
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

        {/* Google Maps CTA */}
        {venue.googleMapLink && (
          <motion.a
            href={venue.googleMapLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-champagne-gold/30 text-champagne-gold font-[family-name:var(--font-body)] text-sm font-medium hover:bg-champagne-gold/10 transition-colors duration-200"
          >
            <MapPin size={16} />
            Open in Google Maps
          </motion.a>
        )}
      </motion.div>
    </section>
  );
}
