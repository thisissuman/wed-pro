"use client";

import { CloudinaryUploadField } from "@/components/media/CloudinaryUploadField";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { scrollPreviewToSection } from "@/features/dashboard/shared/preview-section-map";
import { TextArea, TextInput } from "@/features/dashboard/shared/Inputs";
import { buildInvitationSlug } from "@/lib/invitations";
import type { PanelProps } from "@/features/dashboard/shared/types";

function SectionDivider({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-t border-champagne-gold/10 pt-5 first:border-t-0 first:pt-0">
      <h3 className="font-heading text-base text-champagne-gold">{title}</h3>
      {description && (
        <p className="mt-1 text-xs leading-relaxed text-on-surface-variant/60">{description}</p>
      )}
    </div>
  );
}

export function WeddingDetailsPanel({ draft, update, bare }: PanelProps) {
  const patchNames = (groomName?: string, brideName?: string) =>
    update((current) => {
      const groom = groomName ?? current.couple.groom.name;
      const bride = brideName ?? current.couple.bride.name;
      const slug = buildInvitationSlug(groom, bride) || current.slug;

      return {
        ...current,
        slug,
        couple: {
          ...current.couple,
          groom: { ...current.couple.groom, name: groom },
          bride: { ...current.couple.bride, name: bride },
        },
        seo: {
          ...current.seo,
          pageTitle: `${groom || "Groom"} & ${bride || "Bride"} - Wedding Invitation`,
        },
      };
    });

  const content = (
    <>
      <div onFocusCapture={() => scrollPreviewToSection("wedding-details")}>
        <SectionDivider
          title="Couple names"
          description="These names appear on your invitation and in your share link."
        />
        <div className="mt-4 space-y-4">
          <TextInput
            label="Bride Name"
            value={draft.couple.bride.name}
            onChange={(value) => patchNames(undefined, value)}
          />
          <TextInput
            label="Groom Name"
            value={draft.couple.groom.name}
            onChange={(value) => patchNames(value, undefined)}
          />
        </div>
      </div>

      <div onFocusCapture={() => scrollPreviewToSection("wedding-details")}>
        <SectionDivider
          title="Invitation"
          description="Hero message and wedding date shown at the top of your invite."
        />
        <div className="mt-4 space-y-4">
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
        </div>
      </div>

      <div onFocusCapture={() => scrollPreviewToSection("couple")}>
        <SectionDivider
          title="Meet the couple"
          description="Names come from above. Add portraits, family lines, and a short note for each."
        />
        <div className="mt-4 space-y-6">
          <div className="rounded-xl border border-champagne-gold/10 bg-charcoal-black/25 p-4 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-champagne-gold/70">
              Groom · {draft.couple.groom.name || "Groom"}
            </p>
            <CloudinaryUploadField
              label="Groom Photo"
              value={draft.couple.groom.photo ?? ""}
              folder={`wed-pro/${draft.id}/couple/groom`}
              cropping
              croppingAspectRatio={1}
              helperText="Square crop fits the circular portrait frame."
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  couple: {
                    ...current.couple,
                    groom: { ...current.couple.groom, photo: value },
                  },
                }))
              }
            />
            <TextInput
              label="Son of (family line)"
              value={draft.couple.groom.parentNames ?? ""}
              placeholder="Son of Mr. & Mrs. Sharma"
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  couple: {
                    ...current.couple,
                    groom: { ...current.couple.groom, parentNames: value },
                  },
                }))
              }
            />
            <TextArea
              label="Short message"
              value={draft.couple.groom.bio ?? ""}
              rows={2}
              placeholder="A few words about the groom."
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  couple: {
                    ...current.couple,
                    groom: { ...current.couple.groom, bio: value },
                  },
                }))
              }
            />
          </div>

          <div className="rounded-xl border border-champagne-gold/10 bg-charcoal-black/25 p-4 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-champagne-gold/70">
              Bride · {draft.couple.bride.name || "Bride"}
            </p>
            <CloudinaryUploadField
              label="Bride Photo"
              value={draft.couple.bride.photo ?? ""}
              folder={`wed-pro/${draft.id}/couple/bride`}
              cropping
              croppingAspectRatio={1}
              helperText="Square crop fits the circular portrait frame."
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  couple: {
                    ...current.couple,
                    bride: { ...current.couple.bride, photo: value },
                  },
                }))
              }
            />
            <TextInput
              label="Daughter of (family line)"
              value={draft.couple.bride.parentNames ?? ""}
              placeholder="Daughter of Mr. & Mrs. Patel"
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  couple: {
                    ...current.couple,
                    bride: { ...current.couple.bride, parentNames: value },
                  },
                }))
              }
            />
            <TextArea
              label="Short message"
              value={draft.couple.bride.bio ?? ""}
              rows={2}
              placeholder="A few words about the bride."
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  couple: {
                    ...current.couple,
                    bride: { ...current.couple.bride, bio: value },
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      <div onFocusCapture={() => scrollPreviewToSection("countdown")}>
        <SectionDivider
          title="Countdown"
          description="Uses your wedding date above. Customize the label guests see."
        />
        <div className="mt-4">
          <TextInput
            label="Countdown Label"
            value={draft.countdown.label ?? ""}
            placeholder="Counting Down to Forever"
            onChange={(value) =>
              update((current) => ({
                ...current,
                countdown: { ...current.countdown, label: value },
              }))
            }
          />
          <p className="mt-2 text-[11px] text-on-surface-variant/55">
            Target date:{" "}
            {draft.couple.weddingDate
              ? new Date(draft.countdown.targetDate).toLocaleDateString("en-IN", {
                  dateStyle: "long",
                  timeZone: draft.countdown.timezone ?? "Asia/Kolkata",
                })
              : "Set wedding date in Invitation section"}
          </p>
        </div>
      </div>
    </>
  );

  if (bare) return <div className="space-y-6">{content}</div>;

  return (
    <EditorPanel
      title="Wedding Details"
      description="Names, invitation message, couple portraits, and countdown."
    >
      {content}
    </EditorPanel>
  );
}
