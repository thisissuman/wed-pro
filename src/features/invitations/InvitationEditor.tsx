"use client";

import { getPreferredScrollBehavior } from "@/lib/motion-preferences";
import { ModalSurface } from "@/components/ui/ModalSurface";

import { useEditorKeyboardInset } from "@/hooks/useEditorKeyboardInset";
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
  Loader2,
  MessageCircle,
  Monitor,
  PartyPopper,
  Save,
  Smartphone,
  Undo2,
  X,
} from "lucide-react";
import { AppThemeToggler } from "@/components/magic-ui/app-theme-toggler";
import { cn } from "@/lib/utils";
import { EditorAccordion } from "@/features/dashboard/shared/EditorAccordion";
import { scrollPreviewToSection } from "@/features/dashboard/shared/preview-section-map";
import { WhatsAppShareDialog } from "@/features/invitations/WhatsAppShareDialog";
import { TemplateRenderer } from "@/templates/TemplateRenderer";
import { createClient } from "@/utils/supabase/client";
import {
  getInvitationTitle,
  getPublicInvitationUrl,
} from "@/lib/invitations";
import { PublishShareDialog } from "@/features/invitations/PublishShareDialog";
import { ConfirmUnpublishDialog } from "@/features/invitations/ConfirmUnpublishDialog";
import {
  describeSlugAdjustment,
} from "@/lib/publish";
import { PublishValidationContext } from "./PublishValidationContext";
import { hasDemoContent, safeInvitationForRendering, validatePublishReadiness, type PublishIssue } from "@/lib/publish-readiness";
import { EditorNavigationGuard } from "./EditorNavigationGuard";
import { useInvitationPersistence } from "./useInvitationPersistence";
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
import { TypographyScaleMenu } from "@/features/invitations/TypographyScaleMenu";
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
  const keyboardInset = useEditorKeyboardInset();
  const supabase = useMemo(() => {
    if (typeof window === "undefined") return null;
    return createClient();
  }, []);
  const draft = useInvitationEditorStore((state) => state.draft);
  const saveState = useInvitationEditorStore((state) => state.saveState);
  const saveMessage = useInvitationEditorStore((state) => state.saveMessage);
  const lastSavedAt = useInvitationEditorStore((state) => state.lastSavedAt);
  const updateDraft = useInvitationEditorStore((state) => state.updateDraft);
  const safePreview = useMemo(() => draft ? safeInvitationForRendering(draft) : null, [draft]);
  const previewData = useDeferredValue(safePreview);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [serverValidation, setServerValidation] = useState<{ draft: WeddingData | null; issues: PublishIssue[] } | null>(null);
  const serverIssues = serverValidation?.draft === draft ? serverValidation.issues : [];
  const readiness = useMemo(() => draft ? validatePublishReadiness(draft) : [], [draft]);
  const validationIssues = validationAttempted ? readiness.length ? readiness : serverIssues : [];
  const [desktopStep, setDesktopStep] = useState<string | null>("wedding-details");
  const [copied, setCopied] = useState(false);
  const persistence = useInvitationPersistence(initialData, supabase);
  const { isPublishing, isUnpublishing, isRetryingSave } = persistence;
  const publicationBusy = isPublishing || isUnpublishing || isRetryingSave;
  const editorActive = useRef(false);
  useEffect(() => { editorActive.current = true; return () => { editorActive.current = false; }; }, []);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showPublishShareDialog, setShowPublishShareDialog] = useState(false);
  const [publishSlugAdjusted, setPublishSlugAdjusted] = useState(false);
  const [publishRequestedSlug, setPublishRequestedSlug] = useState<string | undefined>();
  const [showUnpublishDialog, setShowUnpublishDialog] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [mobileStepIndex, setMobileStepIndex] = useState(0);
  const mobileEditorTopRef = useRef<HTMLDivElement | null>(null);

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
        top: window.scrollY + top - parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--editor-sticky-offset") || "80"),
        behavior: getPreferredScrollBehavior(),
      });
    }
    scrollPreviewToSection(editorSteps[clamped].id);
  }, []);

  const publish = async () => {
    if (publicationBusy) return;
    setValidationAttempted(true);
    if (readiness.length) { toast.error("Review the publish checklist", "Open an item below to finish your invitation."); return; }
    const invitationId = draft?.id;
    const wasPublished = draft?.status === "published";
    const result = await persistence.publish();
    if (!editorActive.current || useInvitationEditorStore.getState().draft?.id !== invitationId) return;
    if (!result.ok) { if (result.issues) setServerValidation({ draft: useInvitationEditorStore.getState().draft, issues: result.issues }); toast.error("Publish failed", result.message); return; }
    toast.success(result.slugAdjusted ? "Published with adjusted link" : wasPublished ? "Invitation republished" : "Invitation published");
    if (result.slugAdjusted) toast.info("Link updated", describeSlugAdjustment(result.requestedSlug, result.resolvedSlug));
    setPublishSlugAdjusted(result.slugAdjusted);
    setPublishRequestedSlug(result.requestedSlug);
    setShowPublishShareDialog(true);
  };

  const unpublish = async () => {
    if (publicationBusy) return;
    const invitationId = draft?.id;
    const result = await persistence.unpublish();
    if (!editorActive.current || useInvitationEditorStore.getState().draft?.id !== invitationId) return;
    if (!result.ok) { toast.error("Unpublish failed", result.message); return; }
    setShowUnpublishDialog(false);
    toast.success("Invitation unpublished");
  };

  const updateCoupleNamesFromShare = (groomName: string, brideName: string) => {
    updateDraft((current) => {
      return {
        ...current,
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
        getPublicInvitationUrl(draft.slug)
      );
      setCopied(true);
      toast.success("Share link copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy link");
    }
  };

  if (!draft || draft.id !== initialData.id) {
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
    <PublishValidationContext.Provider value={validationIssues}>
    <main style={{ paddingBottom: keyboardInset ? keyboardInset + 112 : undefined }} className="editor-workspace min-w-0 mx-auto max-w-[1440px] px-[var(--spacing-container-margin)] pt-4 pb-[calc(var(--editor-bottom-bar-h)+env(safe-area-inset-bottom)+2rem)] md:pt-8 md:pb-28 lg:pb-28">
      <EditorNavigationGuard initialData={initialData} flush={persistence.flushForNavigation} discard={persistence.discardPending} busy={publicationBusy} />
      {validationIssues.length > 0 && <section className="mb-4 rounded-2xl border border-error/30 bg-surface-container p-4" aria-label="Publish checklist">
        <h2 className="font-heading text-lg text-on-surface">Finish before publishing</h2>
        <ul className="mt-2 space-y-2">
          {validationIssues.map((issue, index) => <li key={`${issue.path}-${index}`}>
            <button type="button" className="min-h-11 text-left text-sm text-error underline" onClick={() => {
              const stepIndex = editorSteps.findIndex(step => step.id === issue.step);
              if (stepIndex < 0) return;
              setDesktopStep(issue.step);
              goToMobileStep(stepIndex);
              if (window.matchMedia("(min-width: 1024px)").matches) setTimeout(() => document.getElementById(`editor-desktop-${issue.step}`)?.scrollIntoView({ block: "start", behavior: getPreferredScrollBehavior() }), 300);
            }}>{issue.message}</button>
            {issue.message.startsWith("Use a hosted") && <button type="button" className="ml-3 min-h-11 text-sm text-on-surface underline" onClick={() => update(current => {
              const next = structuredClone(current);
              const segments = issue.path.split(".");
              let parent: Record<string, unknown> = next as unknown as Record<string, unknown>;
              for (const segment of segments.slice(0, -1)) {
                if (["__proto__", "constructor", "prototype"].includes(segment) || !Object.prototype.hasOwnProperty.call(parent, segment)) return current;
                const child = parent[segment];
                if (!child || typeof child !== "object") return current;
                parent = child as Record<string, unknown>;
              }
              const last = segments[segments.length - 1];
              if (["__proto__", "constructor", "prototype"].includes(last) || !Object.prototype.hasOwnProperty.call(parent, last)) return current;
              parent[last] = "";
              return next;
            })}>Clear unsupported URL</button>}
          </li>)}
        </ul>
      </section>}
      {hasDemoContent(draft) && <label className="mb-4 flex gap-3 rounded-xl border border-champagne-gold/20 p-4 text-sm text-on-surface">
        <input type="checkbox" checked={draft.demoContentAcknowledged === true} onChange={event => update(current => ({ ...current, demoContentAcknowledged: event.target.checked }))} />
        <span>I reviewed the sample story and stock gallery photos and choose to include them. You can replace them, remove gallery photos, or hide the optional story instead.</span>
      </label>}
      <header className="mb-6 flex flex-col gap-4 border-b border-champagne-gold/10 pb-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 min-w-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold/80 transition hover:text-champagne-gold"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <div>
            <h1 className="font-heading break-words text-2xl text-on-surface md:text-3xl">{getInvitationTitle(draft)}</h1>
            <p className="mt-1 font-body text-sm text-on-surface-variant/70">
              Private working draft · {lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Not saved yet"}
            </p>
            <p className="mt-1 text-xs text-on-surface-variant/60">Guests see your last published version. Publish to share these edits.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <TypographyScaleMenu
            value={draft.typography?.scale}
            onChange={(scale) =>
              update((current) => ({
                ...current,
                typography: { scale },
              }))
            }
          />
          <AppThemeToggler />
          <span role="status" aria-live="polite" className="inline-flex max-w-full min-w-0 break-words items-center gap-2 rounded-full border border-champagne-gold/15 px-4 py-2 text-xs text-on-surface-variant">
            {saveState === "saving" && <Loader2 size={14} className="animate-spin text-champagne-gold" />}
            {saveState === "saved" && <Check size={14} className="text-champagne-gold" />}
            {saveState === "idle" && <Save size={14} className="text-champagne-gold" />}
            {saveState === "error" ? saveMessage : saveMessage || "Ready"}
          </span>

          {saveState === "error" && (
            <button type="button" disabled={publicationBusy}
              onClick={() => void persistence.retrySave()}
              className="min-h-11 rounded-full border border-champagne-gold/30 px-4 py-2 text-xs text-ivory disabled:opacity-50">
              Retry private save
            </button>
          )}

          <button
            type="button"
            onClick={() => void publish()}
            disabled={publicationBusy}
            className="hidden items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgba(16,185,129,0.35)] transition hover:bg-emerald-500 active:scale-95 disabled:pointer-events-none disabled:opacity-60 lg:inline-flex"
          >
            {isPublishing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <PartyPopper size={15} />
            )}
            {draft.status === "published" ? "Republish" : "Publish"}
          </button>

          {canShare && (
            <button
              type="button"
              onClick={() => void copyShareLink()}
              className="hidden items-center justify-center gap-2 rounded-full border border-champagne-gold/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10 lg:inline-flex"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy Link"}
            </button>
          )}

          {canShare && (
            <button
              type="button"
              onClick={() => setShowShareDialog(true)}
              className="hidden items-center justify-center gap-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#25D366] transition hover:bg-[#25D366]/25 lg:inline-flex"
            >
              <MessageCircle size={15} />
              WhatsApp
            </button>
          )}

          {canShare && (
            <button
              type="button"
              onClick={() => setShowUnpublishDialog(true)}
              disabled={publicationBusy}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#ffb4a8]/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#ffb4a8] transition hover:bg-[#8f0f07]/15 disabled:opacity-60"
            >
              <Undo2 size={15} />
              Unpublish
            </button>
          )}

        </div>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[var(--editor-sidebar-width)_minmax(0,1fr)]">
        <section ref={mobileEditorTopRef} className="min-w-0 lg:hidden">
          <div className="mb-4 rounded-2xl border border-champagne-gold/10 bg-surface-container/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold/70">
                  Step {mobileStepIndex + 1} of {editorSteps.length}
                </p>
                <h2 className="mt-1 font-heading text-xl text-on-surface">
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

            <div className="mt-2 flex gap-1 overflow-x-auto" aria-label="Editor progress">
              {editorSteps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToMobileStep(index)}
                  aria-label={`Go to ${step.title}`}
                  aria-current={index === mobileStepIndex ? "step" : undefined}
                  data-complete={index <= mobileStepIndex ? "true" : undefined}
                  className={cn(
                    "editor-progress-hitbox relative min-h-11 min-w-11 shrink-0 rounded-full transition",
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
              className="rounded-2xl border border-champagne-gold/10 bg-surface-container/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.2)]"
            >
              {renderStepPanel(currentMobileStep.id)}
            </motion.div>
          </AnimatePresence>
        </section>

        <div className="hidden lg:block">
          <EditorAccordion
            defaultOpenId="wedding-details"
            openId={desktopStep}
            onOpenChange={setDesktopStep}
            onActivate={scrollPreviewToSection}
          >
            {editorSteps.map((step) => (
              <EditorAccordion.Item
                key={step.id}
                id={step.id}
                title={step.title}
                description={step.id === "page-setup" ? "Show or hide extra sections. Events, gallery, and venue always stay on." : step.description}
              >
                <div id={`editor-desktop-${step.id}`} className="scroll-mt-24">{renderStepPanel(step.id)}</div>
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
                    "inline-flex size-11 items-center justify-center rounded-full transition",
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
                    "inline-flex size-11 items-center justify-center rounded-full transition",
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
              "mx-auto overflow-y-auto bg-background no-scrollbar lg:h-full",
              previewMode === "mobile"
                ? "h-[720px] max-w-[430px] rounded-[var(--editor-preview-radius)] border border-champagne-gold/20 shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
                : "max-w-full rounded-none border-0 shadow-none"
            )}
          >
            {previewData && (
              <TemplateRenderer
                templateId={previewData.templateId}
                data={previewData}
                isPreview
                bypassOpener
                suppressMusicPlayer={isPublishing || showPublishShareDialog}
              />
            )}
          </div>
        </section>
      </div>

      <div style={{ bottom: keyboardInset }} className="fixed inset-x-0 bottom-0 z-40 border-t border-champagne-gold/10 bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-18px_50px_rgba(0,0,0,0.45)] backdrop-blur lg:hidden">
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
              disabled={publicationBusy}
              className="inline-flex min-h-11 flex-[1.4] items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] transition hover:bg-emerald-500 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
            >
              {isPublishing ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <PartyPopper size={15} />
              )}
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
          <ModalSurface open={true} title="Live invitation preview" onOpenChange={(next) => { if (!next) setShowMobilePreview(false); }}>
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              type="button"
              tabIndex={-1}
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
              className="absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-hidden rounded-t-[var(--editor-preview-radius)] border border-champagne-gold/15 bg-background shadow-[0_-30px_90px_rgba(0,0,0,0.55)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-champagne-gold/10 px-4 py-3">
                <div>
                  <h2
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
                  className="inline-flex size-11 items-center justify-center rounded-full border border-champagne-gold/20 text-champagne-gold transition active:scale-95"
                  aria-label="Close preview"
                >
                  <X size={16} />
                </button>
              </div>
              <div
                id="mobile-preview-scroll-container"
                className="mx-auto max-w-[430px] overflow-y-auto bg-background no-scrollbar"
                style={{ height: "calc(92dvh - var(--editor-preview-chrome-h))" }}
              >
                {previewData && (
                  <TemplateRenderer
                    templateId={previewData.templateId}
                    data={previewData}
                    isPreview
                    bypassOpener
                    suppressMusicPlayer={isPublishing || showPublishShareDialog}
                  />
                )}
              </div>
            </motion.section>
          </div>
          </ModalSurface>
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
        onClose={() => !publicationBusy && setShowUnpublishDialog(false)}
        onConfirm={() => void unpublish()}
        isUnpublishing={publicationBusy}
      />
    </main>
    </PublishValidationContext.Provider>
  );
}
