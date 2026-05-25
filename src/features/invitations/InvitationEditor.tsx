"use client";

import Link from "next/link";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "@/lib/toast";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  ExternalLink,
  Globe2,
  Loader2,
  MessageCircle,
  Monitor,
  Save,
  Smartphone,
  Undo2,
  X,
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
import { ConfirmUnpublishDialog } from "@/features/invitations/ConfirmUnpublishDialog";
import {
  describeSlugAdjustment,
  publishInvitation,
  unpublishInvitation,
} from "@/lib/publish";
import { useInvitationEditorStore } from "@/stores/invitation-editor-store";
import { WeddingDetailsPanel } from "@/features/dashboard/wedding-details/WeddingDetailsPanel";
import { EventsPanel } from "@/features/dashboard/events/EventsPanel";
import { VenuePanel } from "@/features/dashboard/venue/VenuePanel";
import { RsvpPanel } from "@/features/dashboard/rsvp/RsvpPanel";
import { StoryEditorPanel } from "@/features/dashboard/story/StoryEditorPanel";
import { GalleryEditorPanel } from "@/features/dashboard/gallery/GalleryEditorPanel";
import { SectionSettingsPanel } from "@/features/dashboard/sections/SectionSettingsPanel";
import { MediaMusicPanel } from "@/features/dashboard/media/MediaMusicPanel";
import { SharePreviewPanel } from "@/features/dashboard/share/SharePreviewPanel";
import type { DraftUpdater } from "@/features/dashboard/shared/types";
import type { WeddingData } from "@/types/wedding.types";

interface InvitationEditorProps {
  initialData: WeddingData;
}

const editorSteps = [
  {
    id: "wedding-details",
    title: "Wedding Details",
    description: "Couple names, family details, date, and countdown.",
  },
  {
    id: "media",
    title: "Media & Music",
    description: "Hero background and optional ambient music.",
  },
  { id: "events", title: "Events", description: "Ceremony timings and locations." },
  { id: "story", title: "Love Story", description: "Your journey as a couple." },
  { id: "gallery", title: "Gallery", description: "Photos and captions." },
  { id: "venue", title: "Venue", description: "Main venue and directions." },
  { id: "rsvp", title: "RSVP", description: "Guest confirmation settings." },
  {
    id: "share-preview",
    title: "Share Preview",
    description: "WhatsApp and social link preview when you share your invite.",
  },
  {
    id: "page-setup",
    title: "Optional Sections",
    description: "Choose which emotional sections appear.",
  },
] as const;

type EditorStepId = (typeof editorSteps)[number]["id"];

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
  const [publishSlugAdjusted, setPublishSlugAdjusted] = useState(false);
  const [publishRequestedSlug, setPublishRequestedSlug] = useState<string | undefined>();
  const [showUnpublishDialog, setShowUnpublishDialog] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [mobileStepIndex, setMobileStepIndex] = useState(0);
  const didInitialize = useRef(false);
  const skipAutosave = useRef(true);
  const mobileEditorTopRef = useRef<HTMLDivElement | null>(null);
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

  const goToMobileStep = useCallback((nextIndex: number) => {
    const clamped = Math.min(Math.max(nextIndex, 0), editorSteps.length - 1);
    setMobileStepIndex(clamped);
    const top = mobileEditorTopRef.current?.getBoundingClientRect().top;
    if (typeof top === "number") {
      window.scrollTo({
        top: window.scrollY + top - 84,
        behavior: "smooth",
      });
    }
    scrollPreviewToSection(editorSteps[clamped].id);
  }, []);

  const publish = async () => {
    if (!draft) return;

    setIsPublishing(true);
    setPublishSlugAdjusted(false);
    setPublishRequestedSlug(undefined);

    const result = await publishInvitation(supabase, draft);

    if (!result.ok) {
      setSaveState("error", result.message);
      toast.error("Publish failed", result.message);
      setIsPublishing(false);
      return;
    }

    const wasPublished = draft.status === "published";
    toast.success(
      result.slugAdjusted
        ? "Published with adjusted link"
        : wasPublished
          ? "Invitation republished"
          : "Invitation published"
    );

    if (result.slugAdjusted) {
      toast.info("Link updated", describeSlugAdjustment(result.requestedSlug, result.resolvedSlug));
    }

    replaceDraft({
      ...result.content,
      meta: {
        ...result.content.meta,
        updatedAt: result.updatedAt,
        publishedAt: result.publishedAt,
      },
    });
    setPublishSlugAdjusted(result.slugAdjusted);
    setPublishRequestedSlug(result.requestedSlug);
    setShowPublishShareDialog(true);
    setIsPublishing(false);
  };

  const unpublish = async () => {
    if (!draft) return;

    setIsUnpublishing(true);
    const result = await unpublishInvitation(supabase, draft);

    if (!result.ok) {
      toast.error("Unpublish failed", result.message);
      setIsUnpublishing(false);
      return;
    }

    replaceDraft({
      ...result.content,
      meta: {
        ...result.content.meta,
        updatedAt: result.updatedAt,
      },
    });
    setShowUnpublishDialog(false);
    toast.success("Invitation unpublished");
    setIsUnpublishing(false);
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
  const currentMobileStep = editorSteps[mobileStepIndex];
  const isLastMobileStep = mobileStepIndex === editorSteps.length - 1;

  const renderStepPanel = (stepId: EditorStepId) => {
    switch (stepId) {
      case "wedding-details":
        return <WeddingDetailsPanel draft={draft} update={update} bare />;
      case "media":
        return <MediaMusicPanel draft={draft} update={update} bare />;
      case "events":
        return <EventsPanel draft={draft} update={update} bare />;
      case "story":
        return <StoryEditorPanel draft={draft} update={update} bare />;
      case "gallery":
        return <GalleryEditorPanel draft={draft} update={update} bare />;
      case "venue":
        return <VenuePanel draft={draft} update={update} bare />;
      case "rsvp":
        return <RsvpPanel draft={draft} update={update} bare />;
      case "share-preview":
        return <SharePreviewPanel draft={draft} update={update} bare />;
      case "page-setup":
        return <SectionSettingsPanel draft={draft} update={update} bare />;
    }
  };

  return (
    <main className="mx-auto max-w-[1440px] px-[var(--spacing-container-margin)] pb-32 pt-6 md:pt-10 md:pb-28 lg:pb-28">
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
            className="hidden items-center justify-center gap-2 rounded-full gold-gradient px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-black transition active:scale-95 disabled:pointer-events-none disabled:opacity-60 lg:inline-flex"
          >
            {isPublishing ? <Loader2 size={15} className="animate-spin" /> : <Globe2 size={15} />}
            {draft.status === "published" ? "Republish" : "Publish"}
          </button>

          {canShare && (
            <button
              type="button"
              onClick={() => void copyShareLink()}
              className="hidden items-center justify-center gap-2 rounded-full border border-champagne-gold/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10 lg:inline-flex"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy Link"}
            </button>
          )}

          {canShare && (
            <button
              type="button"
              onClick={() => setShowShareDialog(true)}
              className="hidden items-center justify-center gap-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#25D366] transition hover:bg-[#25D366]/25 lg:inline-flex"
            >
              <MessageCircle size={15} />
              WhatsApp
            </button>
          )}

          {canShare && (
            <button
              type="button"
              onClick={() => setShowUnpublishDialog(true)}
              className="hidden items-center justify-center gap-2 rounded-full border border-[#ffb4a8]/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#ffb4a8] transition hover:bg-[#8f0f07]/15 lg:inline-flex"
            >
              <Undo2 size={15} />
              Unpublish
            </button>
          )}

        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <section ref={mobileEditorTopRef} className="lg:hidden">
          <div className="mb-4 rounded-2xl border border-champagne-gold/10 bg-surface-container/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold/70">
                  Step {mobileStepIndex + 1} of {editorSteps.length}
                </p>
                <h2 className="mt-1 font-heading text-xl text-ivory">
                  {currentMobileStep.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-on-surface-variant/60">
                  {currentMobileStep.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMobilePreview(true)}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-champagne-gold/20 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition active:scale-95"
              >
                <Eye size={15} />
                Preview
              </button>
            </div>

            <div className="mt-4 grid grid-cols-9 gap-1" aria-label="Editor progress">
              {editorSteps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToMobileStep(index)}
                  aria-label={`Go to ${step.title}`}
                  aria-current={index === mobileStepIndex ? "step" : undefined}
                  className={cn(
                    "h-1.5 rounded-full transition",
                    index <= mobileStepIndex ? "bg-champagne-gold" : "bg-champagne-gold/15"
                  )}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentMobileStep.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="rounded-2xl border border-champagne-gold/10 bg-surface-container/70 px-5 pb-6 pt-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]"
            >
              {renderStepPanel(currentMobileStep.id)}
            </motion.div>
          </AnimatePresence>
        </section>

        <div className="hidden lg:block">
          <EditorAccordion
            defaultOpenId="wedding-details"
            onActivate={scrollPreviewToSection}
          >
            {editorSteps.map((step) => (
              <EditorAccordion.Item
                key={step.id}
                id={step.id}
                title={step.title}
                description={step.id === "page-setup" ? "Show or hide extra sections. Events, gallery, and venue always stay on." : step.description}
              >
                {renderStepPanel(step.id)}
              </EditorAccordion.Item>
            ))}
          </EditorAccordion>
        </div>

        <section className="hidden lg:sticky lg:top-6 lg:block lg:h-[calc(100dvh-3rem)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold">
                <span className="relative flex size-2" aria-hidden="true">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500/70 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                </span>
                Live Preview
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

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-champagne-gold/10 bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-18px_50px_rgba(0,0,0,0.45)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[520px] items-center gap-2">
          <button
            type="button"
            onClick={() => goToMobileStep(mobileStepIndex - 1)}
            disabled={mobileStepIndex === 0}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-champagne-gold/20 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition active:scale-95 disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronLeft size={15} />
            Back
          </button>
          <button
            type="button"
            onClick={() => setShowMobilePreview(true)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-champagne-gold/20 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition active:scale-95"
            aria-label="Open live preview"
          >
            <Eye size={15} />
          </button>
          {isLastMobileStep ? (
            <button
              type="button"
              onClick={() => void publish()}
              disabled={isPublishing}
              className="inline-flex min-h-11 flex-[1.4] items-center justify-center gap-2 rounded-full gold-gradient px-4 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-black transition active:scale-95 disabled:pointer-events-none disabled:opacity-60"
            >
              {isPublishing ? <Loader2 size={15} className="animate-spin" /> : <Globe2 size={15} />}
              {draft.status === "published" ? "Republish" : "Publish"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goToMobileStep(mobileStepIndex + 1)}
              className="inline-flex min-h-11 flex-[1.4] items-center justify-center gap-2 rounded-full gold-gradient px-4 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-black transition active:scale-95"
            >
              Next
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showMobilePreview && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-preview-title">
            <motion.button
              type="button"
              aria-label="Close preview"
              className="absolute inset-0 bg-charcoal-black/75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={() => setShowMobilePreview(false)}
            />
            <motion.section
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-hidden rounded-t-[28px] border border-champagne-gold/15 bg-background shadow-[0_-30px_90px_rgba(0,0,0,0.55)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-champagne-gold/10 px-4 py-3">
                <div>
                  <h2
                    id="mobile-preview-title"
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold"
                  >
                    <span className="relative flex size-2" aria-hidden="true">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500/70 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                    </span>
                    Live Preview
                  </h2>
                  <p className="mt-1 text-xs text-on-surface-variant/60">
                    Updates from your current step appear here.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMobilePreview(false)}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-champagne-gold/20 text-champagne-gold transition active:scale-95"
                  aria-label="Close preview"
                >
                  <X size={16} />
                </button>
              </div>
              <div
                id="mobile-preview-scroll-container"
                className="mx-auto h-[calc(92dvh-73px)] max-w-[430px] overflow-y-auto bg-background no-scrollbar"
              >
                {previewData && (
                  <TemplateRenderer templateId={previewData.templateId} data={previewData} isPreview />
                )}
              </div>
            </motion.section>
          </div>
        )}
      </AnimatePresence>

      <WhatsAppShareDialog
        draft={draft}
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />

      <PublishShareDialog
        draft={draft}
        open={showPublishShareDialog}
        slugAdjusted={publishSlugAdjusted}
        requestedSlug={publishRequestedSlug}
        onClose={() => setShowPublishShareDialog(false)}
        onUpdateNames={updateCoupleNamesFromShare}
      />

      <ConfirmUnpublishDialog
        open={showUnpublishDialog}
        title={getInvitationTitle(draft)}
        slug={draft.slug}
        onClose={() => !isUnpublishing && setShowUnpublishDialog(false)}
        onConfirm={() => void unpublish()}
        isUnpublishing={isUnpublishing}
      />
    </main>
  );
}
