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
  const images = (gallery.images || [])
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
      <section id={PREVIEW_SECTION_IDS.gallery} className="px-6 py-16 md:py-24 bg-transparent">
        <div className="max-w-4xl mx-auto">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.35em] text-[var(--template-primary)] mb-3 font-semibold">
              Memories
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[var(--template-text)] font-bold">
              {gallery.heading || "Our Gallery"}
            </h2>
          </motion.div>

          {/* Staggered Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, i) => (
              <motion.button
                key={image.id}
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                onClick={() => setActiveIndex(i)}
                className={`relative overflow-hidden rounded-[var(--template-card-radius)] border border-[var(--template-primary)]/10 group text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--template-primary)]/50 ${
                  i === 0 ? "col-span-2 md:col-span-2 row-span-2" : ""
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden bg-[var(--template-surface)]/60 ${
                    i === 0 ? "aspect-[4/3] md:aspect-[3/2]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || image.caption || "Wedding photo"}
                    fill
                    sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--template-text)]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-350 bg-gradient-to-t from-[var(--template-surface)] to-transparent pointer-events-none">
                      <p className="font-[family-name:var(--font-body)] text-xs text-[var(--template-text)] font-medium truncate">
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && activeImage && activeIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[color-mix(in_srgb,var(--template-text)_95%,transparent)] backdrop-blur-md"
            onClick={close}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="absolute right-4 top-4 z-10 rounded-full border border-[var(--template-primary)]/30 p-3 text-[var(--template-background)] transition duration-200 hover:bg-[var(--template-primary)]/20 cursor-pointer"
            >
              <X size={22} />
            </button>

            {/* Lightbox Navigation */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[var(--template-primary)]/30 p-3 text-[var(--template-background)] transition duration-200 hover:bg-[var(--template-primary)]/20 cursor-pointer md:left-6"
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
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[var(--template-primary)]/30 p-3 text-[var(--template-background)] transition duration-200 hover:bg-[var(--template-primary)]/20 cursor-pointer md:right-6"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image Viewer */}
            <motion.div
              key={activeImage.id}
              initial={reduceMotion ? false : { scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? undefined : { scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
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
                <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-6 text-center text-sm text-white font-medium">
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
