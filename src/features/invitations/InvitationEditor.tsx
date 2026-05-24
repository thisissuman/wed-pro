"use client";

import Link from "next/link";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "@/lib/toast";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Globe2,
  Loader2,
  MessageCircle,
  Monitor,
  Save,
  Smartphone,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditorAccordion } from "@/features/dashboard/shared/EditorAccordion";
import { scrollPreviewToSection } from "@/features/dashboard/shared/preview-section-map";
import { WhatsAppShareDialog } from "@/features/invitations/WhatsAppShareDialog";
import { TemplateRenderer } from "@/templates/TemplateRenderer";
import { createClient } from "@/utils/supabase/client";
import {
  buildInvitationSlug,
  getInvitationTitle,
  getPublicInvitationUrl,
  resolveInvitationSlug,
  withEssentialSections,
} from "@/lib/invitations";
import { PublishShareDialog } from "@/features/invitations/PublishShareDialog";
import { useInvitationEditorStore } from "@/stores/invitation-editor-store";
import { WeddingDetailsPanel } from "@/features/dashboard/wedding-details/WeddingDetailsPanel";
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
  const [showPublishShareDialog, setShowPublishShareDialog] = useState(false);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const didInitialize = useRef(false);
  const skipAutosave = useRef(true);
  // Autosave queue: only ever one write in flight; coalesce intervening edits
  // into `pendingDraft` and apply after the active save resolves. A monotonic
  // generation token guards against out-of-order responses overwriting newer
  // state when network latency reorders requests.
  const saveGeneration = useRef(0);
  const inFlight = useRef(false);
  const pendingDraft = useRef<WeddingData | null>(null);
  const prevSaveState = useRef<string | null>(null);

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

        const normalizedSlug = resolveInvitationSlug(current);
        if (!normalizedSlug) {
          setSaveState("error", "Add bride and groom names before saving.");
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
          sections: withEssentialSections(current.sections),
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
    const prev = prevSaveState.current;
    if (prev === saveState) return;

    if (saveState === "saving") {
      toast.loading("Saving changes…");
    } else if (saveState === "saved" && prev === "saving") {
      toast.dismiss();
      toast.success("Changes saved");
    } else if (saveState === "error" && prev === "saving") {
      toast.dismiss();
      toast.error("Save failed", saveMessage || undefined);
    }

    prevSaveState.current = saveState;
  }, [saveState, saveMessage]);

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
      slug: resolveInvitationSlug(draft),
      sections: withEssentialSections(draft.sections),
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
      toast.error("Publish failed", error.message);
      setIsPublishing(false);
      return;
    }

    toast.success(
      draft.status === "published" ? "Invitation republished" : "Invitation published"
    );

    replaceDraft({
      ...content,
      meta: {
        ...content.meta,
        updatedAt: data?.updated_at ?? publishedAt,
        publishedAt: data?.published_at ?? publishedAt,
      },
    });
    setShowPublishShareDialog(true);
    setIsPublishing(false);
  };

  const updateCoupleNamesFromShare = (groomName: string, brideName: string) => {
    updateDraft((current) => {
      const slug = buildInvitationSlug(groomName, brideName) || current.slug;
      return {
        ...current,
        slug,
        couple: {
          ...current.couple,
          groom: { ...current.couple.groom, name: groomName },
          bride: { ...current.couple.bride, name: brideName },
        },
        seo: {
          ...current.seo,
          pageTitle: `${groomName || "Groom"} & ${brideName || "Bride"} - Wedding Invitation`,
        },
      };
    });
  };

  const copyShareLink = async () => {
    if (!draft) return;

    try {
      await navigator.clipboard.writeText(
        getPublicInvitationUrl(draft.slug, window.location.origin)
      );
      setCopied(true);
      toast.success("Share link copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy link");
    }
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
            className="inline-flex items-center justify-center gap-2 rounded-full gold-gradient px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-black transition active:scale-95 disabled:pointer-events-none disabled:opacity-60"
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
        <EditorAccordion
          defaultOpenId="wedding-details"
          onActivate={scrollPreviewToSection}
        >
          <EditorAccordion.Item id="wedding-details" title="Wedding Details">
            <WeddingDetailsPanel draft={draft} update={update} bare />
          </EditorAccordion.Item>
          <EditorAccordion.Item
            id="media"
            title="Media & Music"
            description="Hero background and optional ambient music."
          >
            <MediaMusicPanel draft={draft} update={update} bare />
          </EditorAccordion.Item>
          <EditorAccordion.Item id="events" title="Events">
            <EventsPanel draft={draft} update={update} bare />
          </EditorAccordion.Item>
          <EditorAccordion.Item id="story" title="Love Story">
            <StoryEditorPanel draft={draft} update={update} bare />
          </EditorAccordion.Item>
          <EditorAccordion.Item id="gallery" title="Gallery">
            <GalleryEditorPanel draft={draft} update={update} bare />
          </EditorAccordion.Item>
          <EditorAccordion.Item id="venue" title="Venue">
            <VenuePanel draft={draft} update={update} bare />
          </EditorAccordion.Item>
          <EditorAccordion.Item id="rsvp" title="RSVP">
            <RsvpPanel draft={draft} update={update} bare />
          </EditorAccordion.Item>
          <EditorAccordion.Item
            id="page-setup"
            title="Optional Sections"
            description="Show or hide extra sections. Events, gallery, and venue always stay on."
          >
            <SectionSettingsPanel draft={draft} update={update} bare />
          </EditorAccordion.Item>
        </EditorAccordion>

        <section className="lg:sticky lg:top-24 lg:h-[calc(100dvh-7rem)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold">Live Preview</p>
              <p className="mt-1 text-xs text-on-surface-variant/60">
                {previewMode === "mobile"
                  ? "Mobile-first invitation view"
                  : "Desktop responsive preview"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="inline-flex rounded-full border border-champagne-gold/25 bg-surface-container/80 p-0.5"
                role="group"
                aria-label="Preview viewport"
              >
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-full transition",
                    previewMode === "mobile"
                      ? "bg-champagne-gold/20 text-champagne-gold"
                      : "text-on-surface-variant/60 hover:text-champagne-gold"
                  )}
                  aria-label="Mobile preview"
                  aria-pressed={previewMode === "mobile"}
                >
                  <Smartphone size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-full transition",
                    previewMode === "desktop"
                      ? "bg-champagne-gold/20 text-champagne-gold"
                      : "text-on-surface-variant/60 hover:text-champagne-gold"
                  )}
                  aria-label="Desktop preview"
                  aria-pressed={previewMode === "desktop"}
                >
                  <Monitor size={16} />
                </button>
              </div>
              <Link
                href={`/dashboard/invitations/${draft.id}/preview`}
                className="inline-flex items-center gap-2 rounded-full border border-champagne-gold/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-champagne-gold transition hover:bg-champagne-gold/10"
              >
                Full
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>
          <div
            id="preview-scroll-container"
            className={cn(
              "mx-auto h-[720px] overflow-y-auto bg-background no-scrollbar lg:h-full",
              previewMode === "mobile"
                ? "max-w-[430px] rounded-[28px] border border-champagne-gold/20 shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
                : "max-w-full rounded-none border-0 shadow-none"
            )}
          >
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

      <PublishShareDialog
        draft={draft}
        open={showPublishShareDialog}
        onClose={() => setShowPublishShareDialog(false)}
        onUpdateNames={updateCoupleNamesFromShare}
      />
    </main>
  );
}
