"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { CloudinaryUploadField } from "@/components/media/CloudinaryUploadField";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { TextArea, TextInput } from "@/features/dashboard/shared/Inputs";
import { createStoryMilestone } from "@/lib/invitations";
import type { PanelProps } from "@/features/dashboard/shared/types";
import type { StoryMilestone } from "@/types/wedding.types";

export function StoryEditorPanel({ draft, update }: PanelProps) {
  const { story } = draft;

  const updateStory = (patch: Partial<typeof story>) =>
    update((current) => ({
      ...current,
      story: { ...current.story, ...patch },
    }));

  const updateMilestone = (id: string, patch: Partial<StoryMilestone>) =>
    update((current) => ({
      ...current,
      story: {
        ...current.story,
        timeline: current.story.timeline.map((item) =>
          item.id === id ? { ...item, ...patch } : item
        ),
      },
    }));

  const removeMilestone = (id: string) =>
    update((current) => ({
      ...current,
      story: {
        ...current.story,
        timeline: current.story.timeline.filter((item) => item.id !== id),
      },
    }));

  const moveMilestone = (id: string, direction: -1 | 1) =>
    update((current) => {
      const list = [...current.story.timeline];
      const index = list.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= list.length) {
        return current;
      }
      const [removed] = list.splice(index, 1);
      list.splice(target, 0, removed);
      return {
        ...current,
        story: { ...current.story, timeline: list },
      };
    });

  const addMilestone = () =>
    update((current) => ({
      ...current,
      story: {
        ...current.story,
        timeline: [...current.story.timeline, createStoryMilestone()],
      },
    }));

  return (
    <EditorPanel
      title="Love Story"
      description="Add milestones from your journey — first meeting, first date, proposal, and beyond."
    >
      <TextInput
        label="Section Heading"
        value={story.heading ?? ""}
        placeholder="Our Love Story"
        onChange={(value) => updateStory({ heading: value })}
      />
      <TextArea
        label="Romantic Quote"
        value={story.quote ?? ""}
        rows={2}
        placeholder="Every love story is beautiful, but ours is our favourite."
        onChange={(value) => updateStory({ quote: value })}
      />

      <div className="space-y-3">
        {story.timeline.length === 0 ? (
          <div className="rounded-xl border border-dashed border-champagne-gold/20 bg-charcoal-black/30 px-4 py-6 text-center text-xs text-on-surface-variant/60">
            No milestones yet. Add your first chapter below.
          </div>
        ) : (
          story.timeline.map((milestone, index) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              canMoveUp={index > 0}
              canMoveDown={index < story.timeline.length - 1}
              invitationId={draft.id}
              onChange={(patch) => updateMilestone(milestone.id, patch)}
              onRemove={() => removeMilestone(milestone.id)}
              onMoveUp={() => moveMilestone(milestone.id, -1)}
              onMoveDown={() => moveMilestone(milestone.id, 1)}
            />
          ))
        )}
      </div>

      <button
        type="button"
        onClick={addMilestone}
        className="mt-1 inline-flex items-center gap-2 rounded-full border border-champagne-gold/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10"
      >
        <Plus size={14} />
        Add Milestone
      </button>
    </EditorPanel>
  );
}

interface MilestoneCardProps {
  milestone: StoryMilestone;
  canMoveUp: boolean;
  canMoveDown: boolean;
  invitationId: string;
  onChange: (patch: Partial<StoryMilestone>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function MilestoneCard({
  milestone,
  canMoveUp,
  canMoveDown,
  invitationId,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: MilestoneCardProps) {
  return (
    <div className="rounded-xl border border-champagne-gold/10 bg-charcoal-black/30 p-4">
      <div className="mb-3 flex items-center justify-end gap-1">
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
          aria-label="Remove milestone"
          className="rounded-full border border-[#ffb4a8]/20 p-2 text-[#ffb4a8] transition hover:bg-[#ffb4a8]/10"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="space-y-3">
        <TextInput
          label="Title"
          value={milestone.title}
          onChange={(value) => onChange({ title: value })}
        />
        <TextInput
          label="Date"
          value={milestone.date ?? ""}
          placeholder="March 2021"
          onChange={(value) => onChange({ date: value })}
        />
        <TextArea
          label="Description"
          value={milestone.description}
          onChange={(value) => onChange({ description: value })}
        />
        <CloudinaryUploadField
          label="Photo"
          value={milestone.photo ?? ""}
          folder={`wed-pro/${invitationId}/story`}
          helperText="Optional milestone photo."
          compact
          onChange={(value) => onChange({ photo: value })}
        />
      </div>
    </div>
  );
}
