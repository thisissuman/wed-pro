"use client";

import Link from "next/link";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Globe2,
  Loader2,
  MessageCircle,
  Save,
  Users,
} from "lucide-react";
import { WhatsAppShareDialog } from "@/features/invitations/WhatsAppShareDialog";
import { TemplateRenderer } from "@/templates/TemplateRenderer";
import { createClient } from "@/utils/supabase/client";
import {
  getInvitationTitle,
  getPublicInvitationUrl,
  slugify,
} from "@/lib/invitations";
import { useInvitationEditorStore } from "@/stores/invitation-editor-store";
import { WeddingDetailsPanel } from "@/features/dashboard/wedding-details/WeddingDetailsPanel";
import { ShareUrlPanel } from "@/features/dashboard/share/ShareUrlPanel";
import { EventsPanel } from "@/features/dashboard/events/EventsPanel";
import { VenuePanel } from "@/features/dashboard/venue/VenuePanel";
import { RsvpPanel } from "@/features/dashboard/rsvp/RsvpPanel";
import { StoryEditorPanel } from "@/features/dashboard/story/StoryEditorPanel";
import { GalleryEditorPanel } from "@/features/dashboard/gallery/GalleryEditorPanel";
import { SectionSettingsPanel } from "@/features/dashboard/sections/SectionSettingsPanel";
import { MediaMusicPanel } from "@/features/dashboard/media/MediaMusicPanel";
import type { DraftUpdater } from "@/features/dashboard/shared/types";
import type { WeddingData } from "@/types/wedding.types";

interface InvitationEditorProps {
  initialData: WeddingData;
}

export function InvitationEditor({ initialData }: InvitationEditorProps) {
  const supabase = useMemo(() => createClient(), []);
  const draft = useInvitationEditorStore((state) => state.draft);
  const saveState = useInvitationEditorStore((state) => state.saveState);
  const saveMessage = useInvitationEditorStore((state) => state.saveMessage);
  const lastSavedAt = useInvitationEditorStore((state) => state.lastSavedAt);
  const initialize = useInvitationEditorStore((state) => state.initialize);
  const updateDraft = useInvitationEditorStore((state) => state.updateDraft);
  const replaceDraft = useInvitationEditorStore((state) => state.replaceDraft);
  const setSaveState = useInvitationEditorStore((state) => state.setSaveState);
  const setLastSavedAt = useInvitationEditorStore((state) => state.setLastSavedAt);
  const previewData = useDeferredValue(draft);
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const didInitialize = useRef(false);
  const skipAutosave = useRef(true);
  // Autosave queue: only ever one write in flight; coalesce intervening edits
  // into `pendingDraft` and apply after the active save resolves. A monotonic
  // generation token guards against out-of-order responses overwriting newer
  // state when network latency reorders requests.
  const saveGeneration = useRef(0);
  const inFlight = useRef(false);
  const pendingDraft = useRef<WeddingData | null>(null);

  useEffect(() => {
    initialize(initialData);
    didInitialize.current = true;
  }, [initialData, initialize]);

  const saveDraft = useCallback(
    async (nextDraft: WeddingData) => {
      if (inFlight.current) {
        // Save in progress — queue the latest snapshot and let the active save
        // flush it when done. Newer edits overwrite older queued snapshots.
        pendingDraft.current = nextDraft;
        return;
      }

      let queued: WeddingData | null = nextDraft;
      while (queued) {
        const current: WeddingData = queued;
        queued = null;

        const normalizedSlug = slugify(current.slug || getInvitationTitle(current));
        if (!normalizedSlug) {
          setSaveState("error", "Add a share URL slug before saving.");
          return;
        }

        saveGeneration.current += 1;
        const generation = saveGeneration.current;
        inFlight.current = true;
        setSaveState("saving", "Saving changes");

        const updatedAt = new Date().toISOString();
        const content: WeddingData = {
          ...current,
          slug: normalizedSlug,
          meta: {
            ...current.meta,
            updatedAt,
          },
        };

        const { data, error } = await supabase
          .from("invitations")
          .update({
            slug: normalizedSlug,
            template_id: content.templateId,
            status: content.status,
            content,
          })
          .eq("id", content.id)
          .select("updated_at")
          .single();

        inFlight.current = false;

        // Stale response from a save that has already been superseded — drop it.
        if (generation !== saveGeneration.current) {
          continue;
        }

        if (error) {
          setSaveState("error", error.message);
          // Drop queued snapshots so the error message isn't masked.
          pendingDraft.current = null;
          return;
        }

        setLastSavedAt(data?.updated_at ?? updatedAt);
        setSaveState("saved", "Saved");

        // Flush any draft that arrived while this save was in flight.
        if (pendingDraft.current) {
          queued = pendingDraft.current;
          pendingDraft.current = null;
        }
      }
    },
    [setLastSavedAt, setSaveState, supabase]
  );

  useEffect(() => {
    if (!draft || !didInitialize.current) return;

    if (skipAutosave.current) {
      skipAutosave.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      void saveDraft(draft);
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [draft, saveDraft]);

  // Warn before leaving the page while there are unsaved or in-flight edits.
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (saveState === "saving" || saveState === "idle") {
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [saveState]);

  const update: DraftUpdater = useCallback(
    (updater) => updateDraft((current) => updater(current)),
    [updateDraft]
  );

  const publish = async () => {
    if (!draft) return;

    setIsPublishing(true);
    const publishedAt = new Date().toISOString();
    const content: WeddingData = {
      ...draft,
      status: "published",
      slug: slugify(draft.slug || getInvitationTitle(draft)),
      meta: {
        ...draft.meta,
        publishedAt,
        updatedAt: publishedAt,
      },
    };

    const { data, error } = await supabase
      .from("invitations")
      .update({
        slug: content.slug,
        status: "published",
        published_at: publishedAt,
        content,
      })
      .eq("id", content.id)
      .select("updated_at,published_at")
      .single();

    if (error) {
      setSaveState("error", error.message);
      setIsPublishing(false);
      return;
    }

    replaceDraft({
      ...content,
      meta: {
        ...content.meta,
        updatedAt: data?.updated_at ?? publishedAt,
        publishedAt: data?.published_at ?? publishedAt,
      },
    });
    setIsPublishing(false);
  };

  const copyShareLink = async () => {
    if (!draft) return;

    await navigator.clipboard.writeText(getPublicInvitationUrl(draft.slug, window.location.origin));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  if (!draft) {
    return (
      <div className="min-h-screen px-[var(--spacing-container-margin)] py-16 text-center text-on-surface-variant">
        Loading editor...
      </div>
    );
  }

  const canShare = draft.status === "published";

  return (
    <main className="mx-auto max-w-[1440px] px-[var(--spacing-container-margin)] pb-28 pt-6 md:pt-10">
      <header className="mb-6 flex flex-col gap-4 border-b border-champagne-gold/10 pb-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold/80 transition hover:text-champagne-gold"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <div>
            <h1 className="font-heading text-3xl text-ivory md:text-4xl">{getInvitationTitle(draft)}</h1>
            <p className="mt-2 font-body text-sm text-on-surface-variant/70">
              Autosaved draft · {lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Not saved yet"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne-gold/15 px-4 py-2 text-xs text-on-surface-variant">
            {saveState === "saving" && <Loader2 size={14} className="animate-spin text-champagne-gold" />}
            {saveState === "saved" && <Check size={14} className="text-champagne-gold" />}
            {saveState === "idle" && <Save size={14} className="text-champagne-gold" />}
            {saveState === "error" ? saveMessage : saveMessage || "Ready"}
          </span>

          <button
            type="button"
            onClick={() => void publish()}
            disabled={isPublishing}
            className="inline-flex items-center justify-center gap-2 rounded-full gold-gradient px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-deep-maroon transition active:scale-95 disabled:pointer-events-none disabled:opacity-60"
          >
            {isPublishing ? <Loader2 size={15} className="animate-spin" /> : <Globe2 size={15} />}
            {draft.status === "published" ? "Republish" : "Publish"}
          </button>

          {canShare && (
            <button
              type="button"
              onClick={() => void copyShareLink()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-champagne-gold/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy Link"}
            </button>
          )}

          {canShare && (
            <button
              type="button"
              onClick={() => setShowShareDialog(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#25D366] transition hover:bg-[#25D366]/25"
            >
              <MessageCircle size={15} />
              WhatsApp
            </button>
          )}

          <Link
            href={`/dashboard/invitations/${draft.id}/guests`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-champagne-gold/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10"
          >
            <Users size={15} />
            Guests
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <section className="space-y-4">
          <WeddingDetailsPanel draft={draft} update={update} />
          <ShareUrlPanel draft={draft} update={update} />
          <SectionSettingsPanel draft={draft} update={update} />
          <MediaMusicPanel draft={draft} update={update} />
          <EventsPanel draft={draft} update={update} />
          <StoryEditorPanel draft={draft} update={update} />
          <GalleryEditorPanel draft={draft} update={update} />
          <VenuePanel draft={draft} update={update} />
          <RsvpPanel draft={draft} update={update} />
        </section>

        <section className="lg:sticky lg:top-24 lg:h-[calc(100dvh-7rem)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold">Live Preview</p>
              <p className="mt-1 text-xs text-on-surface-variant/60">Mobile-first invitation view</p>
            </div>
            <Link
              href={`/dashboard/invitations/${draft.id}/preview`}
              className="inline-flex items-center gap-2 rounded-full border border-champagne-gold/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-champagne-gold transition hover:bg-champagne-gold/10"
            >
              Full
              <ExternalLink size={13} />
            </Link>
          </div>
          <div className="mx-auto h-[720px] max-w-[430px] overflow-y-auto rounded-[28px] border border-champagne-gold/20 bg-background shadow-[0_30px_100px_rgba(0,0,0,0.45)] no-scrollbar lg:h-full">
            {previewData && (
              <TemplateRenderer templateId={previewData.templateId} data={previewData} isPreview />
            )}
          </div>
        </section>
      </div>

      <WhatsAppShareDialog
        draft={draft}
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />
    </main>
  );
}
