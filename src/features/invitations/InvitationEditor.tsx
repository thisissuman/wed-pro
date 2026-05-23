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
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { TemplateRenderer } from "@/templates/TemplateRenderer";
import { createClient } from "@/utils/supabase/client";
import {
  createDefaultWeddingEvent,
  getInvitationTitle,
  getPublicInvitationPath,
  getPublicInvitationUrl,
  slugify,
} from "@/lib/invitations";
import { useInvitationEditorStore } from "@/stores/invitation-editor-store";
import type { EventType, WeddingData, WeddingEvent } from "@/types/wedding.types";

interface InvitationEditorProps {
  initialData: WeddingData;
}

const eventTypes: EventType[] = ["mehendi", "haldi", "sangeet", "wedding", "reception", "other"];

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
  const didInitialize = useRef(false);
  const skipAutosave = useRef(true);

  useEffect(() => {
    initialize(initialData);
    didInitialize.current = true;
  }, [initialData, initialize]);

  const saveDraft = useCallback(
    async (nextDraft: WeddingData) => {
      const normalizedSlug = slugify(nextDraft.slug || getInvitationTitle(nextDraft));
      if (!normalizedSlug) {
        setSaveState("error", "Add a share URL slug before saving.");
        return;
      }

      setSaveState("saving", "Saving changes");
      const updatedAt = new Date().toISOString();
      const content: WeddingData = {
        ...nextDraft,
        slug: normalizedSlug,
        meta: {
          ...nextDraft.meta,
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

      if (error) {
        setSaveState("error", error.message);
        return;
      }

      setLastSavedAt(data?.updated_at ?? updatedAt);
      setSaveState("saved", "Saved");
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

  const update = (updater: (current: WeddingData) => WeddingData) => {
    updateDraft((current) => updater(current));
  };

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

  const sharePath = getPublicInvitationPath(draft.slug);
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
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <section className="space-y-4">
          <EditorPanel title="Wedding Details">
            <TextInput
              label="Bride Name"
              value={draft.couple.bride.name}
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  couple: {
                    ...current.couple,
                    bride: { ...current.couple.bride, name: value },
                  },
                  seo: {
                    ...current.seo,
                    pageTitle: `${current.couple.groom.name || "Groom"} & ${value || "Bride"} - Wedding Invitation`,
                  },
                }))
              }
            />
            <TextInput
              label="Groom Name"
              value={draft.couple.groom.name}
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  couple: {
                    ...current.couple,
                    groom: { ...current.couple.groom, name: value },
                  },
                  seo: {
                    ...current.seo,
                    pageTitle: `${value || "Groom"} & ${current.couple.bride.name || "Bride"} - Wedding Invitation`,
                  },
                }))
              }
            />
            <TextInput
              label="Wedding Date"
              type="date"
              value={draft.couple.weddingDate ?? ""}
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  couple: { ...current.couple, weddingDate: value },
                  countdown: { ...current.countdown, targetDate: `${value}T19:00:00+05:30` },
                }))
              }
            />
            <TextArea
              label="Invitation Message"
              value={draft.hero.subtitle ?? ""}
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  hero: { ...current.hero, subtitle: value },
                }))
              }
            />
          </EditorPanel>

          <EditorPanel title="Share URL">
            <TextInput
              label="Slug"
              value={draft.slug}
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  slug: slugify(value),
                }))
              }
            />
            <p className="text-xs leading-relaxed text-on-surface-variant/60">{sharePath}</p>
            {canShare && (
              <Link
                href={sharePath}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold"
              >
                Open public invitation
                <ExternalLink size={14} />
              </Link>
            )}
          </EditorPanel>

          <EditorPanel title="Events">
            <div className="space-y-4">
              {draft.events.map((event) => (
                <EventEditor
                  key={event.id}
                  event={event}
                  canRemove={draft.events.length > 1}
                  onChange={(patch) =>
                    update((current) => ({
                      ...current,
                      events: current.events.map((item) =>
                        item.id === event.id ? { ...item, ...patch } : item
                      ),
                    }))
                  }
                  onRemove={() =>
                    update((current) => ({
                      ...current,
                      events: current.events.filter((item) => item.id !== event.id),
                    }))
                  }
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                update((current) => ({
                  ...current,
                  events: [
                    ...current.events,
                    createDefaultWeddingEvent(current.couple.weddingDate ?? new Date().toISOString().slice(0, 10)),
                  ],
                }))
              }
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-champagne-gold/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10"
            >
              <Plus size={14} />
              Add Event
            </button>
          </EditorPanel>

          <EditorPanel title="Venue">
            <TextInput
              label="Venue Name"
              value={draft.venue.name}
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  venue: { ...current.venue, name: value },
                }))
              }
            />
            <TextArea
              label="Venue Address"
              value={draft.venue.address}
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  venue: { ...current.venue, address: value },
                }))
              }
            />
            <TextInput
              label="Google Map Link"
              value={draft.venue.googleMapLink ?? ""}
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  venue: { ...current.venue, googleMapLink: value },
                }))
              }
            />
          </EditorPanel>

          <EditorPanel title="RSVP">
            <TextInput
              label="WhatsApp Number"
              value={draft.rsvp.whatsappNumber ?? ""}
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  rsvp: { ...current.rsvp, whatsappNumber: value },
                }))
              }
            />
            <TextArea
              label="RSVP Message"
              value={draft.rsvp.message ?? ""}
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  rsvp: { ...current.rsvp, message: value },
                }))
              }
            />
          </EditorPanel>
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
    </main>
  );
}

function EditorPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-champagne-gold/10 bg-surface-container/70 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <h2 className="mb-4 font-heading text-lg text-champagne-gold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-champagne-gold/15 bg-charcoal-black/50 px-4 py-3 text-sm text-ivory outline-none transition focus:border-champagne-gold/60"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="w-full resize-none rounded-xl border border-champagne-gold/15 bg-charcoal-black/50 px-4 py-3 text-sm leading-relaxed text-ivory outline-none transition focus:border-champagne-gold/60"
      />
    </label>
  );
}

function EventEditor({
  event,
  canRemove,
  onChange,
  onRemove,
}: {
  event: WeddingEvent;
  canRemove: boolean;
  onChange: (patch: Partial<WeddingEvent>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-champagne-gold/10 bg-charcoal-black/30 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <select
          value={event.type}
          onChange={(changeEvent) => onChange({ type: changeEvent.target.value as EventType })}
          className="rounded-full border border-champagne-gold/15 bg-charcoal-black px-3 py-2 text-xs uppercase tracking-[0.12em] text-champagne-gold outline-none"
        >
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove event"
            className="rounded-full border border-[#ffb4a8]/20 p-2 text-[#ffb4a8] transition hover:bg-[#ffb4a8]/10"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="space-y-3">
        <TextInput label="Title" value={event.title} onChange={(value) => onChange({ title: value })} />
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="Date" type="date" value={event.date} onChange={(value) => onChange({ date: value })} />
          <TextInput label="Time" value={event.time} onChange={(value) => onChange({ time: value })} />
        </div>
        <TextInput label="Venue" value={event.venue} onChange={(value) => onChange({ venue: value })} />
        <TextArea label="Description" value={event.description ?? ""} onChange={(value) => onChange({ description: value })} />
      </div>
    </div>
  );
}
