"use client";

import { useState } from "react";
import { X, MessageCircle, Copy, Check } from "lucide-react";
import { getInvitationTitle, getPublicInvitationUrl } from "@/lib/invitations";
import type { WeddingData } from "@/types/wedding.types";

interface WhatsAppShareDialogProps {
  draft: WeddingData;
  open: boolean;
  onClose: () => void;
}

function defaultTemplate(draft: WeddingData, url: string) {
  const title = getInvitationTitle(draft);
  return `With the blessings of our parents, ${title} invite you to celebrate our union.\n\nRead our story and RSVP here:\n${url}`;
}

export function WhatsAppShareDialog({ draft, open, onClose }: WhatsAppShareDialogProps) {
  if (!open) return null;
  // Remount on open so default message is recomputed from the latest draft.
  return <WhatsAppShareDialogContent draft={draft} onClose={onClose} />;
}

function WhatsAppShareDialogContent({
  draft,
  onClose,
}: {
  draft: WeddingData;
  onClose: () => void;
}) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const [message, setMessage] = useState(() =>
    defaultTemplate(draft, getPublicInvitationUrl(draft.slug, origin))
  );
  const [copied, setCopied] = useState(false);

  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Older browsers will simply not copy; user can copy manually.
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-black/70 px-4 py-6 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-champagne-gold/20 bg-surface-container p-5 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full border border-champagne-gold/15 p-2 text-on-surface-variant transition hover:text-champagne-gold"
        >
          <X size={14} />
        </button>

        <h2 className="font-heading text-xl text-ivory">Share on WhatsApp</h2>
        <p className="mt-1 text-xs leading-relaxed text-on-surface-variant/70">
          Edit the message below, then choose where to send it.
        </p>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={7}
          className="mt-4 w-full resize-none rounded-xl border border-champagne-gold/15 bg-charcoal-black/50 px-4 py-3 text-sm leading-relaxed text-ivory outline-none transition focus:border-champagne-gold/60"
        />

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:shadow-[0_0_20px_rgba(37,211,102,0.35)]"
          >
            <MessageCircle size={16} />
            Open WhatsApp
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-champagne-gold/25 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy Text"}
          </button>
        </div>
      </div>
    </div>
  );
}
