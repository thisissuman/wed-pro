"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Check, Copy, ExternalLink, PartyPopper, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
  buildInvitationSlug,
  getPublicInvitationPath,
  getPublicInvitationUrl,
} from "@/lib/invitations";
import { firePublishConfetti } from "@/lib/fire-confetti";
import { isSlugAvailable } from "@/lib/publish";
import { toast } from "@/lib/toast";
import type { WeddingData } from "@/types/wedding.types";

interface PublishShareDialogProps {
  draft: WeddingData;
  open: boolean;
  slugAdjusted?: boolean;
  requestedSlug?: string;
  onClose: () => void;
  onUpdateNames: (groomName: string, brideName: string) => void;
}

export function PublishShareDialog({
  draft,
  open,
  slugAdjusted = false,
  requestedSlug,
  onClose,
  onUpdateNames,
}: PublishShareDialogProps) {
  if (!open) return null;

  return (
    <PublishShareDialogContent
      draft={draft}
      slugAdjusted={slugAdjusted}
      requestedSlug={requestedSlug}
      onClose={onClose}
      onUpdateNames={onUpdateNames}
    />
  );
}

function PublishShareDialogContent({
  draft,
  slugAdjusted,
  requestedSlug,
  onClose,
  onUpdateNames,
}: Omit<PublishShareDialogProps, "open">) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const [groomName, setGroomName] = useState(draft.couple.groom.name);
  const [brideName, setBrideName] = useState(draft.couple.bride.name);
  const [copied, setCopied] = useState(false);
  const [slugConflict, setSlugConflict] = useState(false);

  const slug = draft.slug;
  const sharePath = getPublicInvitationPath(slug);
  const shareUrl = getPublicInvitationUrl(slug, origin);

  useEffect(() => {
    firePublishConfetti();
  }, []);

  useEffect(() => {
    const candidate = buildInvitationSlug(groomName, brideName) || slug;
    const timeout = window.setTimeout(() => {
      if (!candidate) {
        setSlugConflict(false);
        return;
      }

      const supabase = createClient();
      void isSlugAvailable(supabase, candidate, draft.id)
        .then((available) => setSlugConflict(!available))
        .catch(() => setSlugConflict(false));
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [groomName, brideName, slug, draft.id]);

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

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="mb-4 flex items-center gap-3"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <PartyPopper size={22} aria-hidden />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/90">
              Published
            </p>
            <h2 className="font-heading text-2xl text-ivory">Share your link</h2>
          </div>
        </motion.div>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant/80">
          Your link uses the groom and bride names. Edit only the names below to update the URL
          before your next publish.
        </p>

        {slugAdjusted && requestedSlug && requestedSlug !== slug && (
          <div className="mt-4 flex gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-3 py-2.5 text-xs leading-relaxed text-amber-100/90">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-300" />
            <p>
              <span className="font-semibold">Link adjusted.</span> /w/{requestedSlug} was already
              taken, so we published at <span className="font-mono text-champagne-gold">/w/{slug}</span>{" "}
              instead.
            </p>
          </div>
        )}

        {slugConflict && !slugAdjusted && (
          <div className="mt-4 flex gap-2 rounded-xl border border-[#ffb4a8]/25 bg-[#8f0f07]/15 px-3 py-2.5 text-xs leading-relaxed text-[#ffb4a8]">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p>
              This link may conflict with another invitation. Republish to auto-assign a suffix like{" "}
              <span className="font-mono">-2</span>, or change names in Share Preview.
            </p>
          </div>
        )}

        <div className="mt-5 rounded-xl border border-champagne-gold/15 bg-charcoal-black/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/50">
            Your link
          </p>
          <p className="mt-2 break-all font-mono text-sm text-champagne-gold">
            {origin}
            {sharePath}
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
