"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { HTMLAttributes } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    update((current) => {
      const oldIndex = current.events.findIndex((e) => e.id === active.id);
      const newIndex = current.events.findIndex((e) => e.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return current;
      return {
        ...current,
        events: arrayMove(current.events, oldIndex, newIndex),
      };
    });
  };

  const content = (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={draft.events.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {draft.events.map((event) => (
              <SortableEventEditor
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
        </SortableContext>
      </DndContext>
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

  return <EditorPanel title="Events" description="Drag to reorder how events appear on your invite.">{content}</EditorPanel>;
}

interface EventEditorProps {
  event: WeddingEvent;
  canRemove: boolean;
  onChange: (patch: Partial<WeddingEvent>) => void;
  onRemove: () => void;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
}

function EventEditor({ event, canRemove, onChange, onRemove, dragHandleProps }: EventEditorProps) {
  const handleTypeChange = (value: EventType) => {
    const patch: Partial<WeddingEvent> = { type: value };
    if (!event.title.trim() || DEFAULT_EVENT_TITLES.has(event.title)) {
      patch.title = getDefaultEventTitle(value);
    }
    onChange(patch);
  };

  return (
    <div className="rounded-xl border border-champagne-gold/10 bg-charcoal-black/30 p-4">
      <div className="mb-4 flex items-start justify-between gap-2">
        <button
          type="button"
          className="mt-1 flex min-h-11 min-w-11 shrink-0 cursor-grab items-center justify-center rounded-full border border-champagne-gold/15 text-champagne-gold/70 active:cursor-grabbing"
          aria-label="Drag to reorder event"
          {...dragHandleProps}
        >
          <GripVertical size={16} />
        </button>
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
            className="mt-6 flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#ffb4a8]/20 p-2 text-[#ffb4a8] transition hover:bg-[#ffb4a8]/10"
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
        <TextInput
          label="Venue"
          value={event.venue}
          onChange={(value) => onChange({ venue: value })}
        />
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

function SortableEventEditor(props: Omit<EventEditorProps, "dragHandleProps">) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.event.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <EventEditor
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
