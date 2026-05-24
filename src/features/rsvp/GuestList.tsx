"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2, Trash2 } from "lucide-react";
import type { RsvpRow } from "@/lib/rsvp/types";
import { deleteRsvpAction } from "@/features/rsvp/actions";
import { toast } from "@/lib/toast";

interface GuestListProps {
  guests: RsvpRow[];
  invitationId: string;
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

export function GuestList({ guests, invitationId }: GuestListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<RsvpRow | null>(null);

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

  const exportToCsv = () => {
    try {
      const headers = ["Name", "Attendance", "Total Headcount", "Message", "Submission Date"];
      const csvRows = [
        headers.join(","),
        ...guests.map((g) => {
          const escapedName = `"${g.name.replace(/"/g, '""')}"`;
          const escapedMessage = `"${(g.message || "").replace(/"/g, '""')}"`;
          const formattedDate = new Date(g.created_at).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          });

          return [
            escapedName,
            attendanceLabels[g.attendance],
            g.attendance === "no" ? 0 : g.guests_count,
            escapedMessage,
            `"${formattedDate}"`,
          ].join(",");
        }),
      ];

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `guest_rsvp_responses_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Guest list exported successfully");
    } catch {
      toast.error("Failed to export guest list to CSV");
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const result = await deleteRsvpAction(deleteTarget.id, invitationId);
      if (!result.ok) {
        toast.error("Failed to delete guest RSVP", result.error);
        return;
      }

      toast.success(`Deleted ${deleteTarget.name}'s RSVP response`);
      setDeleteTarget(null);
      router.refresh();
    });
  };

  if (guests.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-champagne-gold/20 bg-charcoal-black/30 px-6 py-12 text-center">
        <p className="font-heading text-xl text-ivory">No RSVPs yet.</p>
        <p className="mt-2 text-sm text-on-surface-variant/70">
          Once your guests respond via the public invitation, they will appear here.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 flex-1">
          <SummaryChip label="Attending" value={summary.yes} />
          <SummaryChip label="Maybe" value={summary.maybe} />
          <SummaryChip label="Not Attending" value={summary.no} />
          <SummaryChip label="Total Headcount" value={summary.headcount} highlight />
        </div>

        <button
          type="button"
          onClick={exportToCsv}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-champagne-gold/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10 active:scale-95 shrink-0"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <ul className="space-y-3">
        {guests.map((guest) => (
          <li
            key={guest.id}
            className="rounded-xl border border-champagne-gold/10 bg-surface-container/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                <button
                  type="button"
                  onClick={() => setDeleteTarget(guest)}
                  className="inline-flex size-8 items-center justify-center rounded-full border border-[#ffb4a8]/20 text-[#ffb4a8] transition hover:bg-[#8f0f07]/20 hover:border-[#ffb4a8]/40 active:scale-95"
                  aria-label={`Delete RSVP for ${guest.name}`}
                >
                  <Trash2 size={14} />
                </button>
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

      {/* Custom Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-black/70 px-4 py-6 backdrop-blur-sm sm:items-center animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-champagne-gold/20 bg-surface-container p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            <h2 className="font-heading text-xl text-ivory">Delete RSVP Response?</h2>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant/80">
              The RSVP response from <span className="font-semibold text-champagne-gold">{deleteTarget.name}</span> will be permanently deleted. This action will update the headcounts immediately and cannot be undone.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isPending}
                className="rounded-full border border-champagne-gold/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-champagne-gold transition hover:bg-champagne-gold/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ffb4a8]/30 bg-[#8f0f07]/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#ffb4a8] transition hover:bg-[#8f0f07]/35 disabled:opacity-50"
              >
                {isPending && <Loader2 size={14} className="animate-spin" />}
                Delete Response
              </button>
            </div>
          </div>
        </div>
      )}
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
