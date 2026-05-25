"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { isValidDisplayUrl } from "@/lib/media-url";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
import type { GalleryData } from "@/types/wedding.types";

interface GallerySectionProps {
  gallery: GalleryData;
}

export function GallerySection({ gallery }: GallerySectionProps) {
  const images = gallery.images
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((image) => isValidDisplayUrl(image.url));
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const isOpen = activeIndex !== null;
  const activeImage = activeIndex !== null ? images[activeIndex] : null;

  const close = useCallback(() => setActiveIndex(null), []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => {
      if (i === null) return null;
      return i === 0 ? images.length - 1 : i - 1;
    });
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => {
      if (i === null) return null;
      return i === images.length - 1 ? 0 : i + 1;
    });
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close, goPrev, goNext]);

  if (images.length === 0) return null;

  return (
    <>
      <section id={PREVIEW_SECTION_IDS.gallery} className="px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {images.map((image, i) => (
              <motion.button
                key={image.id}
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                onClick={() => setActiveIndex(i)}
                className={`relative overflow-hidden rounded-xl group text-left ${
                  i === 0 ? "col-span-2 md:col-span-2 row-span-2" : ""
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden bg-surface-container ${
                    i === 0 ? "aspect-[4/3] md:aspect-[3/2]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || image.caption || "Wedding photo"}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="font-[family-name:var(--font-body)] text-xs text-ivory/90 truncate">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isOpen && activeImage && activeIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-black/95 backdrop-blur-md"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="absolute right-4 top-4 z-10 rounded-full border border-champagne-gold/30 p-3 text-ivory transition hover:bg-champagne-gold/10"
            >
              <X size={22} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-champagne-gold/30 p-3 text-ivory transition hover:bg-champagne-gold/10 md:left-6"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-champagne-gold/30 p-3 text-ivory transition hover:bg-champagne-gold/10 md:right-6"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <motion.div
              key={activeImage.id}
              initial={reduceMotion ? false : { scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? undefined : { scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              drag={reduceMotion ? false : "y"}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 400) close();
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative mx-4 h-[min(80vh,720px)] w-[min(92vw,960px)]"
            >
              <Image
                src={activeImage.url}
                alt={activeImage.alt || activeImage.caption || "Wedding photo"}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
              {activeImage.caption && (
                <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal-black/90 to-transparent px-4 py-6 text-center text-sm text-ivory">
                  {activeImage.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
