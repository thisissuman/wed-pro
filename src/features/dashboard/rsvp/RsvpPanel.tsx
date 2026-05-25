"use client";

import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { SelectInput, TextArea, TextInput } from "@/features/dashboard/shared/Inputs";
import type { PanelProps } from "@/features/dashboard/shared/types";
import type { RSVPType } from "@/types/wedding.types";

const rsvpTypeOptions: { value: RSVPType; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "link", label: "External Link" },
];

export function RsvpPanel({ draft, update, bare }: PanelProps) {
  const { rsvp } = draft;

  const content = (
    <>
      <SelectInput
        label="RSVP Type"
        value={rsvp.type}
        onChange={(value) =>
          update((current) => ({
            ...current,
            rsvp: { ...current.rsvp, type: value },
          }))
        }
        options={rsvpTypeOptions}
      />

      <TextInput
        label="Button Label"
        value={rsvp.buttonText ?? ""}
        placeholder={
          rsvp.type === "whatsapp" ? "Confirm via WhatsApp" : "Confirm Attendance"
        }
        onChange={(value) =>
          update((current) => ({
            ...current,
            rsvp: { ...current.rsvp, buttonText: value },
          }))
        }
      />

      {rsvp.type === "whatsapp" && (
        <>
          <TextInput
            label="WhatsApp Number"
            value={rsvp.whatsappNumber ?? ""}
            inputMode="tel"
            placeholder="+919876543210"
            helperText="Include country code, no spaces."
            onChange={(value) =>
              update((current) => ({
                ...current,
                rsvp: { ...current.rsvp, whatsappNumber: value },
              }))
            }
          />
          <TextArea
            label="WhatsApp Message"
            value={rsvp.message ?? ""}
            placeholder="We are delighted to confirm our attendance at your wedding celebration!"
            onChange={(value) =>
              update((current) => ({
                ...current,
                rsvp: { ...current.rsvp, message: value },
              }))
            }
          />
        </>
      )}

      {rsvp.type === "link" && (
        <TextInput
          label="External Link"
          value={rsvp.formUrl ?? ""}
          inputMode="url"
          placeholder="https://"
          helperText="Optional — Google Form, Typeform, or any HTTPS RSVP page."
          onChange={(value) =>
            update((current) => ({
              ...current,
              rsvp: { ...current.rsvp, formUrl: value },
            }))
          }
        />
      )}
    </>
  );

  if (bare) return <div className="space-y-4">{content}</div>;

  return (
    <EditorPanel
      title="RSVP"
      description="Guests confirm via WhatsApp (recommended in India) or an optional external link."
    >
      {content}
    </EditorPanel>
  );
}
