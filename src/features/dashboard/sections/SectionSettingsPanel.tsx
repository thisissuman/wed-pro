"use client";

import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { ToggleRow } from "@/features/dashboard/shared/ToggleRow";
import { TextArea } from "@/features/dashboard/shared/Inputs";
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
    <div className="space-y-4">
      <p className="mb-1 text-xs leading-relaxed text-on-surface-variant/60">
        Events, gallery, and venue are always included. Toggle optional sections below.
      </p>
      {optionalSectionToggles.map((toggle) => {
        const isChecked = draft.sections[toggle.key] !== false;

        return (
          <div key={toggle.key} className="space-y-3">
            <ToggleRow
              label={toggle.label}
              description={toggle.description}
              checked={isChecked}
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  sections: { ...current.sections, [toggle.key]: value },
                }))
              }
            />

            {/* Expand Thank You message input field inline if toggled on */}
            {toggle.key === "showThankYou" && isChecked && (
              <div className="ml-6 pl-4 border-l border-champagne-gold/15 space-y-4 py-1">
                <TextArea
                  label="Thank You Message"
                  value={draft.thankYou?.message ?? ""}
                  placeholder="Your presence is the greatest gift. Thank you for being part of our story..."
                  onChange={(value) =>
                    update((current) => ({
                      ...current,
                      thankYou: { ...current.thankYou, message: value },
                    }))
                  }
                />
              </div>
            )}
          </div>
        );
      })}
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

