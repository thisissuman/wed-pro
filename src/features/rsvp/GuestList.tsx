"use client";

import { useMemo } from "react";
import type { RsvpRow } from "@/lib/rsvp/types";

interface GuestListProps {
  guests: RsvpRow[];
}

const attendanceLabels: Record<RsvpRow["attendance"], string> = {
  yes: "Attending",
  maybe: "Maybe",
  no: "Not attending",
};

const attendanceStyles: Record<RsvpRow["attendance"], string> = {
  yes: "border-champagne-gold/40 bg-champagne-gold/10 text-champagne-gold",
  maybe: "border-ivory/20 bg-ivory/5 text-ivory/80",
  no: "border-[#ffb4a8]/30 bg-[#8f0f07]/15 text-[#ffb4a8]",
};

export function GuestList({ guests }: GuestListProps) {
  const summary = useMemo(() => {
    const totals = { yes: 0, no: 0, maybe: 0, headcount: 0 };
    for (const guest of guests) {
      totals[guest.attendance] += 1;
      if (guest.attendance !== "no") {
        totals.headcount += guest.guests_count;
      }
    }
    return totals;
  }, [guests]);

  if (guests.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-champagne-gold/20 bg-charcoal-black/30 px-6 py-12 text-center">
        <p className="font-heading text-xl text-ivory">No RSVPs yet.</p>
        <p className="mt-2 text-sm text-on-surface-variant/70">
          Once your guests respond via the public invitation, they will appear here in real time.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryChip label="Attending" value={summary.yes} />
        <SummaryChip label="Maybe" value={summary.maybe} />
        <SummaryChip label="Not Attending" value={summary.no} />
        <SummaryChip label="Total Headcount" value={summary.headcount} highlight />
      </div>

      <ul className="space-y-3">
        {guests.map((guest) => (
          <li
            key={guest.id}
            className="rounded-xl border border-champagne-gold/10 bg-surface-container/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 space-y-1">
                <p className="truncate font-heading text-lg text-ivory">{guest.name}</p>
                <p className="text-xs text-on-surface-variant/60">
                  {new Date(guest.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${attendanceStyles[guest.attendance]}`}
                >
                  {attendanceLabels[guest.attendance]}
                </span>
                {guest.attendance !== "no" && (
                  <span className="rounded-full border border-ivory/15 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-on-surface-variant/70">
                    {guest.guests_count} {guest.guests_count === 1 ? "guest" : "guests"}
                  </span>
                )}
              </div>
            </div>
            {guest.message && (
              <p className="mt-3 rounded-lg border border-champagne-gold/10 bg-charcoal-black/30 px-3 py-2 text-sm leading-relaxed text-on-surface-variant/80">
                {guest.message}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SummaryChip({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        highlight
          ? "border-champagne-gold/40 bg-champagne-gold/10"
          : "border-champagne-gold/10 bg-surface-container/70"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant/60">
        {label}
      </p>
      <p
        className={`mt-1 font-heading text-2xl ${
          highlight ? "text-champagne-gold" : "text-ivory"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
