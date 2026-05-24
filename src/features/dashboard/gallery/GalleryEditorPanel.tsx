"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { CloudinaryUploadField } from "@/components/media/CloudinaryUploadField";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { TextInput } from "@/features/dashboard/shared/Inputs";
import { createGalleryImage } from "@/lib/invitations";
import type { PanelProps } from "@/features/dashboard/shared/types";
import type { GalleryImage } from "@/types/wedding.types";

export function GalleryEditorPanel({ draft, update, bare }: PanelProps) {
  const { gallery } = draft;

  const updateImage = (id: string, patch: Partial<GalleryImage>) =>
    update((current) => ({
      ...current,
      gallery: {
        ...current.gallery,
        images: current.gallery.images.map((item) =>
          item.id === id ? { ...item, ...patch } : item
        ),
      },
    }));

  const removeImage = (id: string) =>
    update((current) => ({
      ...current,
      gallery: {
        ...current.gallery,
        images: current.gallery.images
          .filter((item) => item.id !== id)
          .map((item, index) => ({ ...item, order: index + 1 })),
      },
    }));

  const moveImage = (id: string, direction: -1 | 1) =>
    update((current) => {
      const list = [...current.gallery.images].sort((a, b) => a.order - b.order);
      const index = list.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= list.length) {
        return current;
      }
      const [removed] = list.splice(index, 1);
      list.splice(target, 0, removed);
      return {
        ...current,
        gallery: {
          ...current.gallery,
          images: list.map((item, i) => ({ ...item, order: i + 1 })),
        },
      };
    });

  const addImage = () =>
    update((current) => ({
      ...current,
      gallery: {
        ...current.gallery,
        images: [
          ...current.gallery.images,
          createGalleryImage(current.gallery.images.length + 1),
        ],
      },
    }));

  const sortedImages = [...gallery.images].sort((a, b) => a.order - b.order);

  const content = (
    <>
      <TextInput
        label="Section Heading"
        value={gallery.heading ?? ""}
        placeholder="Our Gallery"
        onChange={(value) =>
          update((current) => ({
            ...current,
            gallery: { ...current.gallery, heading: value },
          }))
        }
      />

      <div className="space-y-3">
        {sortedImages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-champagne-gold/20 bg-charcoal-black/30 px-4 py-6 text-center text-xs text-on-surface-variant/60">
            No photos yet. Add your first image below.
          </div>
        ) : (
          sortedImages.map((image, index) => (
            <GalleryCard
              key={image.id}
              image={image}
              canMoveUp={index > 0}
              canMoveDown={index < sortedImages.length - 1}
              invitationId={draft.id}
              onChange={(patch) => updateImage(image.id, patch)}
              onRemove={() => removeImage(image.id)}
              onMoveUp={() => moveImage(image.id, -1)}
              onMoveDown={() => moveImage(image.id, 1)}
            />
          ))
        )}
      </div>

      <button
        type="button"
        onClick={addImage}
        className="mt-1 inline-flex items-center gap-2 rounded-full border border-champagne-gold/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10"
      >
        <Plus size={14} />
        Add Photo
      </button>
    </>
  );

  if (bare) return <div className="space-y-4">{content}</div>;

  return (
    <EditorPanel
      title="Photo Gallery"
      description="Showcase pre-wedding shoots and special moments. Add up to 12 photos."
    >
      {content}
    </EditorPanel>
  );
}

interface GalleryCardProps {
  image: GalleryImage;
  canMoveUp: boolean;
  canMoveDown: boolean;
  invitationId: string;
  onChange: (patch: Partial<GalleryImage>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function GalleryCard({
  image,
  canMoveUp,
  canMoveDown,
  invitationId,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: GalleryCardProps) {
  return (
    <div className="rounded-xl border border-champagne-gold/10 bg-charcoal-black/30 p-4">
      <div className="mb-3 flex justify-end gap-1">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          aria-label="Move up"
          className="rounded-full border border-champagne-gold/15 p-2 text-champagne-gold transition hover:bg-champagne-gold/10 disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          aria-label="Move down"
          className="rounded-full border border-champagne-gold/15 p-2 text-champagne-gold transition hover:bg-champagne-gold/10 disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove photo"
          className="rounded-full border border-[#ffb4a8]/20 p-2 text-[#ffb4a8] transition hover:bg-[#ffb4a8]/10"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="space-y-3">
        <CloudinaryUploadField
          label="Photo"
          value={image.url}
          folder={`wed-pro/${invitationId}/gallery`}
          onChange={(value) => onChange({ url: value })}
        />
        <TextInput
          label="Caption"
          value={image.caption ?? ""}
          placeholder="Pre-wedding shoot"
          onChange={(value) => onChange({ caption: value })}
        />
        <TextInput
          label="Alt Text"
          value={image.alt ?? ""}
          placeholder="Couple at sunset"
          helperText="For accessibility and SEO."
          onChange={(value) => onChange({ alt: value })}
        />
      </div>
    </div>
  );
}
