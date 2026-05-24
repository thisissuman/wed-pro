"use client";

import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { TextArea, TextInput } from "@/features/dashboard/shared/Inputs";
import type { PanelProps } from "@/features/dashboard/shared/types";

export function WeddingDetailsPanel({ draft, update }: PanelProps) {
  return (
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
  );
}
