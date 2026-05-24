"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, X } from "lucide-react";
import {
  buildInvitationSlug,
  getPublicInvitationPath,
  getPublicInvitationUrl,
} from "@/lib/invitations";
import { toast } from "@/lib/toast";
import type { WeddingData } from "@/types/wedding.types";

interface PublishShareDialogProps {
  draft: WeddingData;
  open: boolean;
  onClose: () => void;
  onUpdateNames: (groomName: string, brideName: string) => void;
}

export function PublishShareDialog({
  draft,
  open,
  onClose,
  onUpdateNames,
}: PublishShareDialogProps) {
  if (!open) return null;

  return (
    <PublishShareDialogContent
      draft={draft}
      onClose={onClose}
      onUpdateNames={onUpdateNames}
    />
  );
}

function PublishShareDialogContent({
  draft,
  onClose,
  onUpdateNames,
}: Omit<PublishShareDialogProps, "open">) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const [groomName, setGroomName] = useState(draft.couple.groom.name);
  const [brideName, setBrideName] = useState(draft.couple.bride.name);
  const [copied, setCopied] = useState(false);

  const slug = buildInvitationSlug(groomName, brideName) || draft.slug;
  const sharePath = getPublicInvitationPath(slug);
  const shareUrl = getPublicInvitationUrl(slug, origin);

  const applyNames = (nextGroom: string, nextBride: string) => {
    setGroomName(nextGroom);
    setBrideName(nextBride);
    onUpdateNames(nextGroom, nextBride);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Share link copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-black/75 px-4 py-6 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-champagne-gold/20 bg-surface-container p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full border border-champagne-gold/20 p-2 text-on-surface-variant transition hover:bg-champagne-gold/10"
        >
          <X size={16} />
        </button>

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold/70">
          Your invitation is live
        </p>
        <h2 className="mt-2 font-heading text-2xl text-ivory">Share your link</h2>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant/80">
          Your link uses the groom and bride names. Edit only the names below to
          update the URL.
        </p>

        <div className="mt-5 rounded-xl border border-champagne-gold/15 bg-charcoal-black/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/50">
            Your link
          </p>
          <p className="mt-2 break-all font-mono text-sm text-champagne-gold">
            {origin}
            {sharePath}
          </p>
          <p className="mt-2 text-[11px] text-on-surface-variant/55">
            Example: <span className="text-on-surface-variant/75">/w/rahul-weds-ananya</span>
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
              Groom name
            </span>
            <input
              type="text"
              value={groomName}
              placeholder="Rahul"
              onChange={(event) => applyNames(event.target.value, brideName)}
              className="w-full rounded-xl border border-champagne-gold/15 bg-charcoal-black/50 px-3 py-2.5 text-sm text-ivory outline-none transition focus:border-champagne-gold/60"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
              Bride name
            </span>
            <input
              type="text"
              value={brideName}
              placeholder="Ananya"
              onChange={(event) => applyNames(groomName, event.target.value)}
              className="w-full rounded-xl border border-champagne-gold/15 bg-charcoal-black/50 px-3 py-2.5 text-sm text-ivory outline-none transition focus:border-champagne-gold/60"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full gold-gradient px-5 py-3 text-sm font-semibold text-charcoal-black transition active:scale-[0.98]"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy Link"}
          </button>
          <Link
            href={sharePath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-champagne-gold/25 px-5 py-3 text-sm font-semibold text-champagne-gold transition hover:bg-champagne-gold/10"
          >
            Open
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
