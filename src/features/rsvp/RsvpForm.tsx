"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { submitRsvp } from "@/app/w/[slug]/actions";
import type { RsvpAttendance } from "@/lib/rsvp/types";

interface RsvpFormProps {
  slug: string;
  defaultMessage?: string;
}

const attendanceOptions: { value: RsvpAttendance; label: string }[] = [
  { value: "yes", label: "Yes, I'll be there" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "Cannot make it" },
];

export function RsvpForm({ slug, defaultMessage }: RsvpFormProps) {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<RsvpAttendance>("yes");
  const [guestsCount, setGuestsCount] = useState(1);
  const [message, setMessage] = useState(defaultMessage ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await submitRsvp({
        slug,
        name,
        attendance,
        guestsCount: attendance === "no" ? 0 : guestsCount,
        message,
      });

      if (!result.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    });
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-champagne-gold/25 bg-charcoal-black/50 px-6 py-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-champagne-gold/30 bg-champagne-gold/10">
          <Check className="text-champagne-gold" size={20} />
        </div>
        <p className="font-[family-name:var(--font-heading)] text-lg text-ivory">
          Thank you, {name.trim().split(" ")[0] || "friend"}.
        </p>
        <p className="mt-2 text-sm text-on-surface-variant/80">
          Your response has been received with love.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-4 rounded-2xl border border-champagne-gold/15 bg-charcoal-black/40 px-5 py-6 text-left"
    >
      <label className="block space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne-gold/70">
          Your Name
        </span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
          placeholder="Add a name"
          className="w-full rounded-xl border border-champagne-gold/15 bg-charcoal-black/60 px-4 py-3 text-sm text-ivory outline-none transition focus:border-champagne-gold/60"
        />
      </label>

      <fieldset className="space-y-2">
        <legend className="text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne-gold/70">
          Attendance
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {attendanceOptions.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center justify-center rounded-full border px-3 py-2 text-xs font-medium transition ${
                attendance === option.value
                  ? "border-champagne-gold/60 bg-champagne-gold/10 text-champagne-gold"
                  : "border-champagne-gold/15 text-on-surface-variant/70 hover:border-champagne-gold/30"
              }`}
            >
              <input
                type="radio"
                name="attendance"
                value={option.value}
                checked={attendance === option.value}
                onChange={() => setAttendance(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {attendance !== "no" && (
        <label className="block space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne-gold/70">
            How Many Guests (Including You)
          </span>
          <input
            type="number"
            min={1}
            max={20}
            inputMode="numeric"
            value={guestsCount}
            onChange={(event) => setGuestsCount(Number(event.target.value) || 1)}
            className="w-full rounded-xl border border-champagne-gold/15 bg-charcoal-black/60 px-4 py-3 text-sm text-ivory outline-none transition focus:border-champagne-gold/60"
          />
        </label>
      )}

      <label className="block space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne-gold/70">
          Message for the Couple <span className="text-on-surface-variant/40">(optional)</span>
        </span>
        <textarea
          value={message}
          rows={3}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Send your love and wishes…"
          className="w-full resize-none rounded-xl border border-champagne-gold/15 bg-charcoal-black/60 px-4 py-3 text-sm leading-relaxed text-ivory outline-none transition focus:border-champagne-gold/60"
        />
      </label>

      {error && (
        <p className="rounded-lg border border-[#ffb4a8]/25 bg-[#8f0f07]/15 px-3 py-2 text-xs text-[#ffb4a8]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full gold-gradient px-6 py-3 font-[family-name:var(--font-body)] text-sm font-semibold uppercase tracking-[0.14em] text-deep-maroon transition disabled:pointer-events-none disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send size={16} />
            Send RSVP
          </>
        )}
      </button>
    </form>
  );
}
