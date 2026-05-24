"use client";

import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { SelectInput, TextArea, TextInput } from "@/features/dashboard/shared/Inputs";
import type { PanelProps } from "@/features/dashboard/shared/types";
import type { RSVPType } from "@/types/wedding.types";

const rsvpTypeOptions: { value: RSVPType; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "form", label: "In-App Form" },
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
          rsvp.type === "whatsapp"
            ? "Confirm via WhatsApp"
            : rsvp.type === "form"
            ? "Fill RSVP Form"
            : "Confirm Attendance"
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

      {(rsvp.type === "form" || rsvp.type === "link") && (
        <TextInput
          label={rsvp.type === "form" ? "Form URL" : "External Link"}
          value={rsvp.formUrl ?? ""}
          inputMode="url"
          placeholder="https://"
          helperText={
            rsvp.type === "form"
              ? "Until the built-in form ships, link to your Google Form or Typeform."
              : "Any HTTPS URL works — Notion page, RSVP service, etc."
          }
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
      description="Pick how guests will confirm — WhatsApp, an in-app form, or an external link."
    >
      {content}
    </EditorPanel>
  );
}
