"use client";

import { Plus, Trash2 } from "lucide-react";
import { CoordinatesInput } from "@/features/dashboard/shared/CoordinatesInput";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { SelectInput, TextArea, TextInput } from "@/features/dashboard/shared/Inputs";
import { createDefaultWeddingEvent } from "@/lib/invitations";
import type { PanelProps } from "@/features/dashboard/shared/types";
import type { EventType, WeddingEvent } from "@/types/wedding.types";

const eventTypes: { value: EventType; label: string }[] = [
  { value: "mehendi", label: "Mehendi" },
  { value: "haldi", label: "Haldi" },
  { value: "sangeet", label: "Sangeet" },
  { value: "wedding", label: "Wedding" },
  { value: "reception", label: "Reception" },
  { value: "other", label: "Other" },
];

export function EventsPanel({ draft, update, bare }: PanelProps) {
  const content = (
    <>
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
              createDefaultWeddingEvent(
                current.couple.weddingDate ?? new Date().toISOString().slice(0, 10)
              ),
            ],
          }))
        }
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-champagne-gold/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10"
      >
        <Plus size={14} />
        Add Event
      </button>
    </>
  );

  if (bare) return <div className="space-y-4">{content}</div>;

  return <EditorPanel title="Events">{content}</EditorPanel>;
}

interface EventEditorProps {
  event: WeddingEvent;
  canRemove: boolean;
  onChange: (patch: Partial<WeddingEvent>) => void;
  onRemove: () => void;
}

function EventEditor({ event, canRemove, onChange, onRemove }: EventEditorProps) {
  return (
    <div className="rounded-xl border border-champagne-gold/10 bg-charcoal-black/30 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex-1">
          <SelectInput
            label="Type"
            value={event.type}
            onChange={(value) => onChange({ type: value })}
            options={eventTypes}
          />
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove event"
            className="mt-6 rounded-full border border-[#ffb4a8]/20 p-2 text-[#ffb4a8] transition hover:bg-[#ffb4a8]/10"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="space-y-3">
        <TextInput label="Title" value={event.title} onChange={(value) => onChange({ title: value })} />
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="Date"
            type="date"
            value={event.date}
            onChange={(value) => onChange({ date: value })}
          />
          <TextInput
            label="Time"
            value={event.time}
            onChange={(value) => onChange({ time: value })}
          />
        </div>
        <TextInput
          label="Venue"
          value={event.venue}
          onChange={(value) => onChange({ venue: value })}
        />
        <TextArea
          label="Description"
          value={event.description ?? ""}
          onChange={(value) => onChange({ description: value })}
        />
        <TextInput
          label="Google Map Link"
          value={event.googleMapLink ?? ""}
          onChange={(value) => onChange({ googleMapLink: value })}
        />
        <CoordinatesInput
          value={event.coordinates}
          helperText="Optional lat/lng for one-tap navigation."
          onChange={(value) => onChange({ coordinates: value })}
        />
      </div>
    </div>
  );
}
