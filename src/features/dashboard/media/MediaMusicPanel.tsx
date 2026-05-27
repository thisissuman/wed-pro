"use client";

import { AudioUploadField } from "@/components/media/AudioUploadField";
import { CroppedImageUploadField } from "@/components/media/CroppedImageUploadField";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { TextInput } from "@/features/dashboard/shared/Inputs";
import { isCloudinaryConfigured } from "@/lib/media-url";
import type { PanelProps } from "@/features/dashboard/shared/types";

export function MediaMusicPanel({ draft, update, bare }: PanelProps) {
  const configured = isCloudinaryConfigured();

  const content = (
    <>
      <CroppedImageUploadField
        label="Hero Background Image"
        value={draft.hero.backgroundMedia ?? ""}
        folder={`wed-pro/${draft.id}/hero`}
        aspect={9 / 16}
        helperText="Crop for full-screen mobile (9:16). JPG or WebP under 8 MB."
        onChange={(value) =>
          update((current) => ({
            ...current,
            hero: { ...current.hero, backgroundMedia: value },
            seo: {
              ...current.seo,
              ogImage: value || current.seo.ogImage,
            },
          }))
        }
      />

      {configured ? (
        <AudioUploadField
          label="Background Music"
          value={draft.music.url ?? ""}
          folder={`wed-pro/${draft.id}/music`}
          helperText="MP3 or M4A under 12 MB. If upload fails, export as MP3 from your music app."
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
          helperText="Direct MP3 or M4A link. Guests tap play on their phone."
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

      <p className="text-[11px] leading-relaxed text-on-surface-variant/60">
        If you skip upload, guests hear our default piano track (Pehla Nasha). After you upload your own, open Live Preview — it plays once quietly so you can check. Guests tap the button to play on their phone.
      </p>
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
