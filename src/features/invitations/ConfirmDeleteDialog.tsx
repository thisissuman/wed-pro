"use client";

import { Loader2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function ConfirmDeleteDialog({
  open,
  title,
  onClose,
  onConfirm,
  isDeleting,
}: ConfirmDeleteDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-black/70 px-4 py-6 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-champagne-gold/20 bg-surface-container p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
        <h2 className="font-heading text-xl text-ivory">Delete this invitation?</h2>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant/80">
          <span className="font-semibold text-champagne-gold">{title}</span> will be
          permanently removed. This cannot be undone.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full border border-champagne-gold/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-champagne-gold transition hover:bg-champagne-gold/10 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ffb4a8]/30 bg-[#8f0f07]/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#ffb4a8] transition hover:bg-[#8f0f07]/35 disabled:opacity-50"
          >
            {isDeleting && <Loader2 size={14} className="animate-spin" />}
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
}
