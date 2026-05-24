"use client";

import { CloudinaryUploadField } from "@/components/media/CloudinaryUploadField";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { TextInput } from "@/features/dashboard/shared/Inputs";
import { ToggleRow } from "@/features/dashboard/shared/ToggleRow";
import type { PanelProps } from "@/features/dashboard/shared/types";

export function MediaMusicPanel({ draft, update }: PanelProps) {
  return (
    <EditorPanel
      title="Media & Music"
      description="Set a hero background image and optional ambient music."
    >
      <CloudinaryUploadField
        label="Hero Background Image"
        value={draft.hero.backgroundMedia ?? ""}
        folder={`wed-pro/${draft.id}/hero`}
        helperText="A high-resolution landscape photo works best for the opening section."
        onChange={(value) =>
          update((current) => ({
            ...current,
            hero: { ...current.hero, backgroundMedia: value },
          }))
        }
      />

      <TextInput
        label="Music URL"
        value={draft.music.url ?? ""}
        inputMode="url"
        placeholder="https://res.cloudinary.com/.../song.mp3"
        helperText="Direct MP3 or M4A link. Browsers block autoplay — guests will see a play button."
        onChange={(value) =>
          update((current) => ({
            ...current,
            music: { ...current.music, url: value },
          }))
        }
      />

      <TextInput
        label="Song Title"
        value={draft.music.title ?? ""}
        placeholder="Tum Hi Ho — Arijit Singh"
        onChange={(value) =>
          update((current) => ({
            ...current,
            music: { ...current.music, title: value },
          }))
        }
      />

      <ToggleRow
        label="Try to autoplay"
        description="Most mobile browsers block autoplay until the user taps the screen — guests will still see the play button."
        checked={draft.music.autoplay ?? false}
        onChange={(value) =>
          update((current) => ({
            ...current,
            music: { ...current.music, autoplay: value },
          }))
        }
      />
    </EditorPanel>
  );
}
