"use client";

import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { ToggleRow } from "@/features/dashboard/shared/ToggleRow";
import type { PanelProps } from "@/features/dashboard/shared/types";
import type { SectionVisibility } from "@/types/wedding.types";

type SectionKey = keyof SectionVisibility;

interface SectionToggleConfig {
  key: SectionKey;
  label: string;
  description: string;
}

const sectionToggles: SectionToggleConfig[] = [
  { key: "showHero", label: "Hero", description: "Cinematic opening with names and date." },
  { key: "showCouple", label: "Couple", description: "Bride and groom introduction." },
  { key: "showCountdown", label: "Countdown", description: "Live countdown to the wedding date." },
  { key: "showBlessing", label: "Blessing", description: "Family message and blessings." },
  { key: "showEvents", label: "Events", description: "Mehendi, Sangeet, Haldi, Wedding, Reception." },
  { key: "showStory", label: "Love Story", description: "Your journey as a couple. Hide if you have no milestones yet." },
  { key: "showGallery", label: "Gallery", description: "Photo grid. Hide if you have no pre-wedding photos." },
  { key: "showVenue", label: "Venue", description: "Main venue with map link." },
  { key: "showRSVP", label: "RSVP", description: "Confirm attendance call-to-action." },
  { key: "showThankYou", label: "Thank You", description: "Closing emotional note." },
];

export function SectionSettingsPanel({ draft, update }: PanelProps) {
  return (
    <EditorPanel
      title="Section Visibility"
      description="Hide sections you don't need. Changes appear instantly in the preview."
    >
      <div className="space-y-2">
        {sectionToggles.map((toggle) => (
          <ToggleRow
            key={toggle.key}
            label={toggle.label}
            description={toggle.description}
            checked={draft.sections[toggle.key] !== false}
            onChange={(value) =>
              update((current) => ({
                ...current,
                sections: { ...current.sections, [toggle.key]: value },
              }))
            }
          />
        ))}
      </div>
    </EditorPanel>
  );
}
