"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface DraftLimitDialogProps {
  open: boolean;
  onClose: () => void;
}

export function DraftLimitDialog({ open, onClose }: DraftLimitDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-black/70 px-4 py-6 backdrop-blur-sm sm:items-center"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-champagne-gold/20 bg-surface-container p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full border border-champagne-gold/20 p-2 text-on-surface-variant hover:bg-champagne-gold/10"
        >
          <X size={16} />
        </button>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold/70">
          Draft Limit Reached
        </p>
        <h2 className="mt-2 font-heading text-xl text-ivory">Three stories at a time</h2>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant/80">
          You have reached the limit of 3 wedding invitations. Please delete an old draft
          from your dashboard before starting a new story.
        </p>
        <Link
          href="/dashboard"
          onClick={onClose}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full gold-gradient px-6 py-3 text-sm font-semibold text-charcoal-black transition active:scale-[0.98]"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
