"use client";

import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { TextArea, TextInput } from "@/features/dashboard/shared/Inputs";
import type { PanelProps } from "@/features/dashboard/shared/types";
import type { WeddingEvent } from "@/types/wedding.types";

function copyEventToVenue(event: WeddingEvent) {
  return {
    name: event.venue?.trim() || event.title,
    address: event.address?.trim() ?? "",
    googleMapLink: event.googleMapLink?.trim() ?? "",
  };
}

export function VenuePanel({ draft, update, bare }: PanelProps) {
  const copyableEvents = draft.events.filter(
    (e) =>
      e.type !== "sangeet" &&
      (e.venue?.trim() || e.address?.trim() || e.googleMapLink?.trim())
  );

  const content = (
    <>
      {copyableEvents.length > 0 && (
        <div className="rounded-xl border border-champagne-gold/10 bg-champagne-gold/5 p-4 space-y-3">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
            Copy from event
          </span>
          <div className="flex flex-wrap gap-2">
            {copyableEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => {
                  const copied = copyEventToVenue(event);
                  update((current) => ({
                    ...current,
                    venue: { ...current.venue, ...copied },
                  }));
                }}
                className="inline-flex min-h-11 items-center rounded-full border border-champagne-gold/25 px-4 py-2 text-xs font-semibold text-champagne-gold transition hover:bg-champagne-gold/10"
              >
                {event.title}
              </button>
            ))}
          </div>
          <p className="text-[11px] leading-relaxed text-on-surface-variant/55">
            Pulls venue name, address, and map link from that event.
          </p>
        </div>
      )}
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
        inputMode="url"
        helperText="Guests open this in Google Maps from the venue section."
      />
    </>
  );

  if (bare) return <div className="space-y-4">{content}</div>;

  return <EditorPanel title="Venue">{content}</EditorPanel>;
}
