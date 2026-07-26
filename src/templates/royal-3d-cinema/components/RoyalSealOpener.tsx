"use client";
/* eslint-disable @next/next/no-img-element -- opener artwork is immutable local template media */

import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { royalCinemaAssets } from "../assets";

interface RoyalSealOpenerProps {
  slug: string;
  initials: string;
  coupleNames: string;
  bypass?: boolean;
  onOpenFromGesture: () => void;
}

export function RoyalSealOpener({
  slug,
  initials,
  coupleNames,
  bypass = false,
  onOpenFromGesture,
}: RoyalSealOpenerProps) {
  const [visible, setVisible] = useState(!bypass);
  const [opening, setOpening] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const storageKey = `vivasha:royal-3d-cinema:opened:${slug || "preview"}`;

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
    const focusTimer = window.setTimeout(() => buttonRef.current?.focus(), 80);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [bypass, storageKey, visible]);

  if (!visible) return null;

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
      <img
        src={royalCinemaAssets.decor.toran}
        alt=""
        aria-hidden="true"
        className="cinema-opener__toran"
      />
      <img
        src={royalCinemaAssets.decor.arch}
        alt=""
        aria-hidden="true"
        className="cinema-opener__arch"
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
          aria-label={`Open the wedding invitation for ${coupleNames}`}
        >
          <span className="cinema-seal-button__ring" aria-hidden="true" />
          <span className="cinema-seal-button__initials">{initials}</span>
        </button>
        <span className="cinema-opener__action">
          <Volume2 aria-hidden="true" size={16} />
          Tap the seal to open with music
        </span>
      </div>
    </div>
  );
}
