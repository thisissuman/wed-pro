"use server";

import { createClient } from "@/utils/supabase/server";

export interface DeleteRsvpResult {
  ok: boolean;
  error?: string;
}

/**
 * Server action to securely delete an RSVP entry.
 * Validates that the active user owns the invitation containing the RSVP.
 */
export async function deleteRsvpAction(
  rsvpId: string,
  invitationId: string
): Promise<DeleteRsvpResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be logged in to delete an RSVP." };
  }

  // 1. Verify that this invitation belongs to the authenticated user
  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("id")
    .eq("id", invitationId)
    .eq("user_id", user.id)
    .single();

  if (invitationError || !invitation) {
    return { ok: false, error: "You are not authorized to manage this invitation's RSVPs." };
  }

  // 2. Safely delete the RSVP record
  const { error: deleteError } = await supabase
    .from("rsvps")
    .delete()
    .eq("id", rsvpId)
    .eq("invitation_id", invitationId);

  if (deleteError) {
    return { ok: false, error: deleteError.message };
  }

  return { ok: true };
}
