"use client";

import { motion } from "framer-motion";
import type { GalleryData } from "@/types/wedding.types";

interface GallerySectionProps {
  gallery: GalleryData;
}

/**
 * Royal Template — Gallery Section
 *
 * Responsive photo grid with cinematic reveal animations.
 */
export function GallerySection({ gallery }: GallerySectionProps) {
  const images = gallery.images
    .slice()
    .sort((a, b) => a.order - b.order);

  if (images.length === 0) return null;

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold/60 mb-3">
            Memories
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-ivory font-semibold">
            {gallery.heading || "Our Gallery"}
          </h2>
        </motion.div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((image, i) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`relative overflow-hidden rounded-xl group ${
                i === 0 ? "col-span-2 md:col-span-2 row-span-2" : ""
              }`}
            >
              <div
                className={`relative w-full overflow-hidden bg-surface-container ${
                  i === 0
                    ? "aspect-[4/3] md:aspect-[3/2]"
                    : "aspect-square"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt || image.caption || "Wedding photo"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Caption */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-[family-name:var(--font-body)] text-xs text-ivory/90 truncate">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
