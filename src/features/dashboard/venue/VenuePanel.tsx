"use client";

import { CoordinatesInput } from "@/features/dashboard/shared/CoordinatesInput";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { TextArea, TextInput } from "@/features/dashboard/shared/Inputs";
import type { PanelProps } from "@/features/dashboard/shared/types";

export function VenuePanel({ draft, update, bare }: PanelProps) {
  const content = (
    <>
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
      <CoordinatesInput
        value={draft.venue.coordinates}
        helperText="Optional. Adding lat/lng enables one-tap navigation in Google and Apple Maps."
        onChange={(value) =>
          update((current) => ({
            ...current,
            venue: { ...current.venue, coordinates: value },
          }))
        }
      />
    </>
  );

  if (bare) return <div className="space-y-4">{content}</div>;

  return <EditorPanel title="Venue">{content}</EditorPanel>;
}
