"use client";

import { CloudinaryUploadField } from "@/components/media/CloudinaryUploadField";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { TextInput } from "@/features/dashboard/shared/Inputs";
import { ToggleRow } from "@/features/dashboard/shared/ToggleRow";
import { isCloudinaryConfigured } from "@/lib/media-url";
import type { PanelProps } from "@/features/dashboard/shared/types";

export function MediaMusicPanel({ draft, update, bare }: PanelProps) {
  const configured = isCloudinaryConfigured();

  const content = (
    <>
      <CloudinaryUploadField
        label="Hero Background Image"
        value={draft.hero.backgroundMedia ?? ""}
        folder={`wed-pro/${draft.id}/hero`}
        cropping
        croppingAspectRatio={9 / 16}
        helperText="Crop for full-screen mobile (9:16). JPG or WebP under 8 MB. On mobile, tap Upload → Photos or Files."
        onChange={(value) =>
          update((current) => ({
            ...current,
            hero: { ...current.hero, backgroundMedia: value },
          }))
        }
      />

      {configured ? (
        <CloudinaryUploadField
          label="Background Music"
          value={draft.music.url ?? ""}
          folder={`wed-pro/${draft.id}/music`}
          resourceType="video"
          uploadLabel={draft.music.url ? "Replace music" : "Upload music"}
          clientAllowedFormats={["mp3", "m4a", "wav", "aac", "ogg", "mpeg"]}
          helperText="MP3 or M4A under 12 MB. If upload fails, export as MP3 from your music app. Guests tap play on mobile."
          onChange={(value) =>
            update((current) => ({
              ...current,
              music: { ...current.music, url: value },
            }))
          }
        />
      ) : (
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
      )}

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
    </>
  );

  if (bare) return <div className="space-y-4">{content}</div>;

  return (
    <EditorPanel
      title="Media & Music"
      description="Set a hero background image and optional ambient music."
    >
      {content}
    </EditorPanel>
  );
}
