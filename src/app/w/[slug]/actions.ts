"use server";

import { createClient } from "@/utils/supabase/server";
import type { RsvpAttendance } from "@/lib/rsvp/types";

export interface SubmitRsvpInput {
  slug: string;
  name: string;
  attendance: RsvpAttendance;
  guestsCount: number;
  message?: string;
}

export interface SubmitRsvpResult {
  ok: boolean;
  error?: string;
}

const ATTENDANCE_VALUES: readonly RsvpAttendance[] = ["yes", "no", "maybe"];

function clampGuestsCount(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(20, Math.max(0, Math.floor(value)));
}

export async function submitRsvp(input: SubmitRsvpInput): Promise<SubmitRsvpResult> {
  const name = input.name.trim();
  const message = input.message?.trim() || undefined;
  const guestsCount = clampGuestsCount(input.guestsCount);

  if (!name) {
    return { ok: false, error: "Please share your name." };
  }
  if (!ATTENDANCE_VALUES.includes(input.attendance)) {
    return { ok: false, error: "Please pick an attendance option." };
  }
  if (name.length > 120) {
    return { ok: false, error: "Name is too long." };
  }
  if (message && message.length > 1000) {
    return { ok: false, error: "Message is too long." };
  }

  const supabase = await createClient();

  const { data: invitation, error: lookupError } = await supabase
    .from("invitations")
    .select("id,status")
    .eq("slug", input.slug)
    .single();

  if (lookupError || !invitation) {
    return { ok: false, error: "We couldn't find that invitation." };
  }

  if (invitation.status !== "published") {
    return { ok: false, error: "This invitation isn't accepting RSVPs yet." };
  }

  const { data: existingRsvp } = await supabase
    .from("rsvps")
    .select("id")
    .eq("invitation_id", invitation.id)
    .ilike("name", name)
    .maybeSingle();

  if (existingRsvp) {
    return {
      ok: false,
      error: "We already have a response under this name. Please contact the couple directly if you need to update it.",
    };
  }

  const { error: insertError } = await supabase.from("rsvps").insert({
    invitation_id: invitation.id,
    name,
    attendance: input.attendance,
    guests_count: guestsCount,
    message: message ?? null,
  });

  if (insertError) {
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
