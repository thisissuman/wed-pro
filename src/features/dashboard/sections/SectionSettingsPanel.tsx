"use client";

import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { ToggleRow } from "@/features/dashboard/shared/ToggleRow";
import type { PanelProps } from "@/features/dashboard/shared/types";
import type { SectionVisibility } from "@/types/wedding.types";

type OptionalSectionKey = Extract<
  keyof SectionVisibility,
  | "showHero"
  | "showCouple"
  | "showCountdown"
  | "showBlessing"
  | "showStory"
  | "showRSVP"
  | "showThankYou"
>;

interface SectionToggleConfig {
  key: OptionalSectionKey;
  label: string;
  description: string;
}

/** Events, gallery, and venue are always shown — no toggle in the editor. */
const optionalSectionToggles: SectionToggleConfig[] = [
  { key: "showHero", label: "Hero", description: "Cinematic opening with names and date." },
  { key: "showCouple", label: "Meet the Couple", description: "Bride and groom introduction with photos." },
  { key: "showCountdown", label: "Countdown", description: "Live countdown to the wedding date." },
  { key: "showBlessing", label: "Blessing", description: "Family message and blessings." },
  { key: "showStory", label: "Love Story", description: "Your journey as a couple." },
  { key: "showRSVP", label: "RSVP", description: "Confirm attendance call-to-action." },
  { key: "showThankYou", label: "Thank You", description: "Closing emotional note." },
];

export function SectionSettingsPanel({ draft, update, bare }: PanelProps) {
  const content = (
    <div className="space-y-2">
      <p className="mb-3 text-xs leading-relaxed text-on-surface-variant/60">
        Events, gallery, and venue are always included. Toggle optional sections below.
      </p>
      {optionalSectionToggles.map((toggle) => (
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
  );

  if (bare) return content;

  return (
    <EditorPanel
      title="Optional Sections"
      description="Show or hide extra sections on your invitation."
    >
      {content}
    </EditorPanel>
  );
}
