"use client";

import { useMemo } from "react";
import { CroppedImageUploadField } from "@/components/media/CroppedImageUploadField";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { scrollPreviewToSection } from "@/features/dashboard/shared/preview-section-map";
import { SelectInput, TextArea, TextInput } from "@/features/dashboard/shared/Inputs";
import { ToggleRow } from "@/features/dashboard/shared/ToggleRow";
import { buildInvitationSlug } from "@/lib/invitations";
import { validateHashtag, validateWeddingDate } from "@/lib/validate-editor";
import type { PanelProps } from "@/features/dashboard/shared/types";
import type { ParentDisplayOrder, PersonData } from "@/types/wedding.types";

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

const parentDisplayOptions: { value: ParentDisplayOrder; label: string }[] = [
  { value: "groom-first", label: "Groom's name first everywhere" },
  { value: "bride-first", label: "Bride's name first everywhere" },
];

function getParentLine(
  side: "bride" | "groom",
  fatherName?: string,
  motherName?: string
) {
  const parents = [fatherName, motherName].filter((value) => value?.trim()).join(" & ");
  if (!parents) return "";
  return `${side === "bride" ? "Daughter" : "Son"} of ${parents}`;
}

export function WeddingDetailsPanel({ draft, update, bare }: PanelProps) {
  const dateError = useMemo(() => {
    const result = validateWeddingDate(draft.couple.weddingDate ?? "");
    return result.ok ? undefined : result.message;
  }, [draft.couple.weddingDate]);

  const hashtagError = useMemo(() => {
    const result = validateHashtag(draft.weddingHashtag ?? "");
    return result.ok ? undefined : result.message;
  }, [draft.weddingHashtag]);

  const family = draft.couple.family ?? {
    bride: {},
    groom: {},
    displayOrder: "groom-first" as ParentDisplayOrder,
    includeGrandparents: false,
  };

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

  const patchFamilyMember = (
    side: "bride" | "groom",
    key: "fatherName" | "motherName" | "grandparentsNames",
    value: string
  ) =>
    update((current) => {
      const currentFamily = current.couple.family ?? {
        bride: {},
        groom: {},
        displayOrder: "groom-first" as ParentDisplayOrder,
        includeGrandparents: false,
      };
      const nextSide = {
        ...currentFamily[side],
        [key]: value,
      };
      const nextPerson: PersonData = {
        ...current.couple[side],
        parentNames: getParentLine(side, nextSide.fatherName, nextSide.motherName),
      };

      return {
        ...current,
        couple: {
          ...current.couple,
          [side]: nextPerson,
          family: {
            ...currentFamily,
            [side]: nextSide,
          },
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
            error={dateError}
            onChange={(value) =>
              update((current) => ({
                ...current,
                couple: { ...current.couple, weddingDate: value },
                countdown: { ...current.countdown, targetDate: `${value}T19:00:00+05:30` },
              }))
            }
          />
          <TextInput
            label="Wedding Hashtag"
            value={draft.weddingHashtag ?? ""}
            placeholder="#RahulWedsAnanya"
            helperText="Shown softly on the invitation for photo sharing."
            error={hashtagError}
            onChange={(value) =>
              update((current) => ({
                ...current,
                weddingHashtag: value,
              }))
            }
          />
        </div>
      </div>

      <div onFocusCapture={() => scrollPreviewToSection("couple")}>
        <SectionDivider
          title="Meet the couple"
          description="Add portraits, family details, and a short note for each."
        />
        <div className="mt-4 space-y-6">
          <div className="rounded-xl border border-champagne-gold/10 bg-[var(--editor-card-bg)] p-4 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-champagne-gold/70">
              Groom · {draft.couple.groom.name || "Groom"}
            </p>
            <CroppedImageUploadField
              label="Groom Photo"
              value={draft.couple.groom.photo ?? ""}
              folder={`wed-pro/${draft.id}/couple/groom`}
              aspect={1}
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
              label="Groom's Father"
              value={family.groom.fatherName ?? ""}
              placeholder="Mr. Ramesh Kapoor"
              onChange={(value) => patchFamilyMember("groom", "fatherName", value)}
            />
            <TextInput
              label="Groom's Mother"
              value={family.groom.motherName ?? ""}
              placeholder="Mrs. Sunita Kapoor"
              onChange={(value) => patchFamilyMember("groom", "motherName", value)}
            />
            {(family.includeGrandparents ?? false) && (
              <TextInput
                label="Groom's Grandparents"
                value={family.groom.grandparentsNames ?? ""}
                placeholder="Shri Mohan & Smt. Leela Kapoor"
                onChange={(value) =>
                  patchFamilyMember("groom", "grandparentsNames", value)
                }
              />
            )}
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

          <div className="rounded-xl border border-champagne-gold/10 bg-[var(--editor-card-bg)] p-4 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-champagne-gold/70">
              Bride · {draft.couple.bride.name || "Bride"}
            </p>
            <CroppedImageUploadField
              label="Bride Photo"
              value={draft.couple.bride.photo ?? ""}
              folder={`wed-pro/${draft.id}/couple/bride`}
              aspect={1}
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
              label="Bride's Father"
              value={family.bride.fatherName ?? ""}
              placeholder="Mr. Suresh Sharma"
              onChange={(value) => patchFamilyMember("bride", "fatherName", value)}
            />
            <TextInput
              label="Bride's Mother"
              value={family.bride.motherName ?? ""}
              placeholder="Mrs. Anita Sharma"
              onChange={(value) => patchFamilyMember("bride", "motherName", value)}
            />
            {(family.includeGrandparents ?? false) && (
              <TextInput
                label="Bride's Grandparents"
                value={family.bride.grandparentsNames ?? ""}
                placeholder="Shri Harish & Smt. Kamla Sharma"
                onChange={(value) =>
                  patchFamilyMember("bride", "grandparentsNames", value)
                }
              />
            )}
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

      <div onFocusCapture={() => scrollPreviewToSection("couple")}>
        <SectionDivider
          title="Family display"
          description="Choose how parents appear on the invitation card."
        />
        <div className="mt-4 space-y-4">
          <SelectInput
            label="Parents Display Order"
            value={family.displayOrder}
            options={parentDisplayOptions}
            onChange={(value) =>
              update((current) => ({
                ...current,
                couple: {
                  ...current.couple,
                  family: {
                    ...(current.couple.family ?? family),
                    displayOrder: value,
                  },
                },
              }))
            }
          />
          <ToggleRow
            label="Include grandparents' names"
            description="Shows grandparents below the parents when provided."
            checked={family.includeGrandparents ?? false}
            onChange={(value) =>
              update((current) => ({
                ...current,
                couple: {
                  ...current.couple,
                  family: {
                    ...(current.couple.family ?? family),
                    includeGrandparents: value,
                  },
                },
              }))
            }
          />
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

      <div onFocusCapture={() => scrollPreviewToSection("blessing")}>
        <SectionDivider
          title="Blessing"
          description="Family message shown after the countdown on your invite."
        />
        <div className="mt-4 space-y-4">
          <TextArea
            label="Blessing Message"
            value={draft.blessing?.message ?? ""}
            placeholder="With the blessings of our beloved families..."
            onChange={(value) =>
              update((current) => ({
                ...current,
                blessing: { ...current.blessing, message: value },
              }))
            }
          />
          <TextInput
            label="Blessing From"
            value={draft.blessing?.from ?? ""}
            placeholder="The Sharma & Mehta Families"
            onChange={(value) =>
              update((current) => ({
                ...current,
                blessing: { ...current.blessing, from: value },
              }))
            }
          />
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
