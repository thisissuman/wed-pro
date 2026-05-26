"use client";

import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { ReorderControls } from "@/features/dashboard/shared/ReorderControls";
import { SelectInput, TextArea, TextInput } from "@/features/dashboard/shared/Inputs";
import {
  createDefaultWeddingEvent,
  DEFAULT_EVENT_TITLES,
  getDefaultEventTitle,
} from "@/lib/invitations";
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
  const moveEvent = (id: string, direction: -1 | 1) => {
    update((current) => {
      const list = [...current.events];
      const index = list.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= list.length) return current;
      const [removed] = list.splice(index, 1);
      list.splice(target, 0, removed);
      return { ...current, events: list };
    });
  };

  const content = (
    <>
      <div className="space-y-4">
        {draft.events.map((event, index) => (
          <motion.div
            key={event.id}
            layout
            transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.8 }}
          >
            <EventEditor
              event={event}
              canRemove={draft.events.length > 1}
              canMoveUp={index > 0}
              canMoveDown={index < draft.events.length - 1}
              onMoveUp={() => moveEvent(event.id, -1)}
              onMoveDown={() => moveEvent(event.id, 1)}
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
          </motion.div>
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
                current.couple.weddingDate ?? new Date().toISOString().slice(0, 10),
                current.events.length === 0 ? "wedding" : "reception"
              ),
            ],
          }))
        }
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-champagne-gold/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10"
      >
        <Plus size={14} />
        Add Event
      </button>
    </>
  );

  if (bare) return <div className="space-y-4">{content}</div>;

  return (
    <EditorPanel title="Events" description="Use the arrows to reorder how events appear on your invite.">
      {content}
    </EditorPanel>
  );
}

interface EventEditorProps {
  event: WeddingEvent;
  canRemove: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onChange: (patch: Partial<WeddingEvent>) => void;
  onRemove: () => void;
}

function EventEditor({
  event,
  canRemove,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onChange,
  onRemove,
}: EventEditorProps) {
  const handleTypeChange = (value: EventType) => {
    const patch: Partial<WeddingEvent> = { type: value };
    if (!event.title.trim() || DEFAULT_EVENT_TITLES.has(event.title)) {
      patch.title = getDefaultEventTitle(value);
    }
    onChange(patch);
  };

  return (
    <div className="rounded-xl border border-champagne-gold/10 bg-[var(--editor-card-bg)] p-4">
      <div className="mb-4 flex items-start justify-between gap-2">
        <ReorderControls
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
        <div className="min-w-0 flex-1">
          <SelectInput
            label="Type"
            value={event.type}
            onChange={handleTypeChange}
            options={eventTypes}
          />
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove event"
            className="mt-6 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#ffb4a8]/20 text-[#ffb4a8] transition hover:bg-[#ffb4a8]/10"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="space-y-3">
        <TextInput label="Title" value={event.title} onChange={(value) => onChange({ title: value })} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        <TextInput label="Venue" value={event.venue} onChange={(value) => onChange({ venue: value })} />
        <TextArea
          label="Address"
          value={event.address ?? ""}
          onChange={(value) => onChange({ address: value })}
          rows={2}
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
          inputMode="url"
        />
      </div>
    </div>
  );
}
