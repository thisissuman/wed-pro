"use client";
/* eslint-disable @next/next/no-img-element -- opener artwork is immutable local template media */

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { LoaderCircle, Volume2 } from "lucide-react";
import { royalCinemaAssets } from "../assets";

interface RoyalSealOpenerProps {
  slug: string;
  initials: string;
  coupleNames: string;
  bypass?: boolean;
  onOpenFromGesture: () => void;
}

const OPENING_RUNWAY_FRAMES = 12;

export function RoyalSealOpener({
  slug,
  initials,
  coupleNames,
  bypass = false,
  onOpenFromGesture,
}: RoyalSealOpenerProps) {
  const [visible, setVisible] = useState(!bypass);
  const [opening, setOpening] = useState(false);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const loadedFrameIndexesRef = useRef(new Set<number>());
  const storageKey = `vivasha:royal-3d-cinema:opened:${slug || "preview"}`;
  const progressPercent = Math.round(
    (loadedFrames / OPENING_RUNWAY_FRAMES) * 100,
  );
  const assetsReady = loadedFrames >= OPENING_RUNWAY_FRAMES;

  useEffect(() => {
    if (bypass || !visible) return;

    try {
      if (window.sessionStorage.getItem(storageKey) === "1") {
        const dismissTimer = window.setTimeout(() => setVisible(false), 0);
        return () => window.clearTimeout(dismissTimer);
      }
    } catch {
      // The invitation remains usable when session storage is unavailable.
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [bypass, storageKey, visible]);

  useEffect(() => {
    if (!visible) return;
    const focusTimer = window.setTimeout(() => buttonRef.current?.focus(), 80);
    return () => window.clearTimeout(focusTimer);
  }, [visible]);

  if (!visible) return null;

  const markFrameReady = (frame: number) => {
    if (loadedFrameIndexesRef.current.has(frame)) return;
    loadedFrameIndexesRef.current.add(frame);
    setLoadedFrames(loadedFrameIndexesRef.current.size);
  };

  const openInvitation = () => {
    if (opening) return;
    onOpenFromGesture();
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // Opening must never depend on storage access.
    }
    setOpening(true);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.setTimeout(() => setVisible(false), reduceMotion ? 0 : 720);
  };

  return (
    <div
      className="cinema-opener"
      data-opening={opening || undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cinema-opener-title"
    >
      <div className="cinema-opener__preload" aria-hidden="true">
        {Array.from({ length: OPENING_RUNWAY_FRAMES }, (_, index) => {
          const frame = index + 1;
          return (
            <img
              key={frame}
              src={royalCinemaAssets.hero.low(frame)}
              alt=""
              loading="eager"
              decoding="async"
              ref={(image) => {
                if (image?.complete) markFrameReady(frame);
              }}
              onLoad={() => markFrameReady(frame)}
              onError={() => markFrameReady(frame)}
            />
          );
        })}
      </div>
      <img
        src={royalCinemaAssets.decor.toran}
        alt=""
        aria-hidden="true"
        className="cinema-opener__toran"
        decoding="async"
        fetchPriority="high"
      />
      <img
        src={royalCinemaAssets.decor.arch}
        alt=""
        aria-hidden="true"
        className="cinema-opener__arch"
        decoding="async"
        fetchPriority="high"
      />
      <div className="cinema-opener__veil" aria-hidden="true" />
      <div className="cinema-opener__content">
        <p className="cinema-eyebrow">A royal invitation</p>
        <h1 id="cinema-opener-title">{coupleNames}</h1>
        <p className="cinema-opener__note">
          Together with their families, invite you to enter their celebration.
        </p>
        <button
          ref={buttonRef}
          type="button"
          onClick={openInvitation}
          className="cinema-seal-button"
          data-loading={!assetsReady || undefined}
          aria-busy={!assetsReady}
          aria-label={`Open the wedding invitation for ${coupleNames}`}
          style={
            {
              "--cinema-load-progress": `${progressPercent}%`,
            } as CSSProperties
          }
        >
          <span className="cinema-seal-button__ring" aria-hidden="true" />
          {!assetsReady && (
            <span
              className="cinema-seal-button__progress"
              aria-hidden="true"
            />
          )}
          <span className="cinema-seal-button__initials">
            {assetsReady ? initials : `${progressPercent}%`}
          </span>
        </button>
        <span className="cinema-opener__action" aria-live="polite">
          {assetsReady ? (
            <>
              <Volume2 aria-hidden="true" size={16} />
              Tap the seal to open with music
            </>
          ) : (
            <>
              <LoaderCircle
                aria-hidden="true"
                className="cinema-opener__spinner"
                size={16}
              />
              Preparing your invitation, {progressPercent}% ready. Tap to
              enter now.
            </>
          )}
        </span>
      </div>
    </div>
  );
}
