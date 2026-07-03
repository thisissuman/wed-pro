"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VariantRenderer, type OpenerVariant } from "./variants";

const STORAGE_KEY_PREFIX = "wed-pro-opener-seen-";

export interface InvitationOpenerProps {
  children: React.ReactNode;
  variant?: OpenerVariant;
  primaryColor?: string;
  secondaryColor?: string;
  onComplete?: () => void;
  slug?: string;
  isPreviewMode?: boolean;
  bypassOpener?: boolean;
  sealType?: "wax-seal" | "gold-coin" | "none";
  monogram?: string;
}

export function InvitationOpener({
  children,
  variant = "royal-door",
  primaryColor = "#D4AF37",
  secondaryColor = "#6B1F1F",
  onComplete,
  slug = "default",
  isPreviewMode = false,
  bypassOpener = false,
  sealType = "wax-seal",
  monogram = "❦",
}: InvitationOpenerProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isOpening, setIsOpening] = useState(false);

  const storageKey = `${STORAGE_KEY_PREFIX}${slug}`;

  // 1. SSR-Safe Mounting check & Session Caching check
  useEffect(() => {
    if (bypassOpener || isOpening) return;

    const timer = setTimeout(() => {
      setMounted(true);
      
      if (isPreviewMode) {
        setVisible(true);
        return;
      }

      try {
        const seen = sessionStorage.getItem(storageKey);
        if (seen) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      } catch {
        // In case cookies/sessionStorage are blocked
        setVisible(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [storageKey, isPreviewMode, isOpening, bypassOpener]);

  // 2. Open action handler
  const handleOpen = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);

    try {
      if (!isPreviewMode) {
        sessionStorage.setItem(storageKey, "true");
      }
    } catch {
      // ignore
    }
  }, [isOpening, storageKey, isPreviewMode]);

  // 3. Animation complete callback
  const handleAnimationComplete = useCallback(() => {
    setVisible(false);
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  // If we are bypassing the opener entirely, render children directly
  if (bypassOpener) {
    return <>{children}</>;
  }

  // Once mounted and visible is false, clean up and render children directly
  if (mounted && !visible) {
    return <>{children}</>;
  }

  const coverId = `opener-cover-${slug}`;
  const contentId = `opener-content-${slug}`;

  return (
    <div className="relative min-h-screen w-full">
      {/* Inline script to prevent hydration flash for returning users (wrapped in a hidden div to avoid React 19 warnings) */}
      <div
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{
          __html: `
            <script>
              try {
                if (!${isPreviewMode} && sessionStorage.getItem('${storageKey}')) {
                  var style = document.createElement('style');
                  style.innerHTML = '#${coverId} { display: none !important; } #${contentId} { opacity: 1 !important; pointer-events: auto !important; max-height: none !important; overflow: visible !important; }';
                  document.head.appendChild(style);
                }
              } catch (e) {}
            </script>
          `
        }}
      />

      {/* Underlying content is rendered but kept invisible/inert until open to allow SEO indexation */}
      <div 
        id={contentId}
        aria-hidden={visible} 
        className={`w-full ${visible ? "pointer-events-none select-none max-h-screen overflow-hidden opacity-0" : ""}`}
      >
        {children}
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            id={coverId}
            role="dialog"
            aria-modal="true"
            aria-label="Wedding Invitation Opener Cover"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onClick={handleOpen}
            className="fixed inset-0 w-full h-full z-50 flex items-center justify-center select-none overflow-hidden touch-manipulation cursor-pointer"
            style={{ backgroundColor: secondaryColor }}
          >
            {/* 1. Variant Background and Panels */}
            <VariantRenderer
              variant={variant}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              isOpening={isOpening}
              onAnimationComplete={handleAnimationComplete}
              sealType={sealType}
              monogram={monogram}
            />

            {/* Subtle instructional tap hint (fades away quickly) */}
            {!isOpening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.45, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="absolute bottom-12 inset-x-0 text-center pointer-events-none z-30"
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">
                  Tap anywhere to enter
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
