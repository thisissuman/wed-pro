import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildInvitationSlug,
  normalizeInvitationRow,
  withEssentialSections,
  type InvitationRow,
} from "@/lib/invitations";
import { validatePublishReadiness, type PublishIssue } from "@/lib/publish-readiness";
import type { WeddingData } from "@/types/wedding.types";

export interface PublishFailure {
  ok: false;
  message: string;
  issues?: PublishIssue[];
}

export interface DraftWriteSuccess {
  ok: true;
  content: WeddingData;
  updatedAt: string;
  revision: number;
}

export interface PublishSuccess extends DraftWriteSuccess {
  publishedAt: string;
  slugAdjusted: boolean;
  requestedSlug: string;
  resolvedSlug: string;
}

export type PublishOutcome = PublishSuccess | PublishFailure;
export type UnpublishSuccess = DraftWriteSuccess;
export type UnpublishOutcome = UnpublishSuccess | PublishFailure;
export type DraftWriteOutcome = DraftWriteSuccess | PublishFailure;

function writeError(error: { code?: string; message?: string } | null): string {
  if (error?.code === "PT409" || error?.code === "40001") {
    return "This invitation changed in another session. Reload before continuing; your unsaved edits are still here.";
  }
  return error?.message ?? "Could not update the invitation. Please try again.";
}

function thrownError(error: unknown): PublishFailure {
  return { ok: false, message: error instanceof Error ? error.message : "Connection interrupted. Please try again." };
}

/** Abort an uncertain network request; never leave publication controls busy indefinitely.
 * Aborting transport cannot undo a committed transaction. Revision conflicts on a
 * retry therefore require a reload rather than silently replaying old content.
 */
async function callInvitationRpc(supabase: SupabaseClient, name: string, args: Record<string, unknown>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await supabase.rpc(name, args).abortSignal(controller.signal);
    if (controller.signal.aborted) throw new Error("The request timed out. Reload to confirm its result before continuing; your unsaved edits are still here.");
    return response;
  } catch (error) {
    if (controller.signal.aborted) throw new Error("The request timed out. Reload to confirm its result before continuing; your unsaved edits are still here.");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function writeResult(row: InvitationRow): DraftWriteSuccess {
  const content = normalizeInvitationRow(row);
  return { ok: true, content, updatedAt: row.updated_at, revision: row.draft_revision ?? 0 };
}

/** Autosave writes private content only; the RPC preserves public lifecycle/link. */
export async function saveInvitationDraft(
  supabase: SupabaseClient,
  draft: WeddingData,
  revision = draft.meta.draftRevision ?? 0,
): Promise<DraftWriteOutcome> {
  try {
    const { data, error } = await callInvitationRpc(supabase, "save_invitation_draft", {
      p_id: draft.id,
      p_content: { ...draft, sections: withEssentialSections(draft.sections) },
      p_template_id: draft.templateId,
      p_expected_revision: revision,
    });
    if (error || !data) return { ok: false, message: writeError(error) };
    return writeResult(data as InvitationRow);
  } catch (error) {
    return thrownError(error);
  }
}

/** Promote saved working content atomically. Callers must flush local edits first. */
export async function publishInvitation(
  supabase: SupabaseClient,
  draft: WeddingData,
  revision = draft.meta.draftRevision ?? 0,
): Promise<PublishOutcome> {
  const issues = validatePublishReadiness(draft);
  if (issues.length) return { ok: false, message: "Complete the publish checklist before sharing.", issues };
  const requestedSlug = draft.meta.firstPublishedAt
    ? draft.slug
    : buildInvitationSlug(draft.couple.groom.name, draft.couple.bride.name);
  if (!requestedSlug) return { ok: false, message: "Add couple names before publishing." };
  try {
    const { data, error } = await callInvitationRpc(supabase, "publish_invitation_snapshot", {
      p_id: draft.id,
      p_expected_revision: revision,
      p_requested_slug: requestedSlug,
    });
    if (error || !data) {
      let serverIssues: PublishIssue[] | undefined;
      if (error?.code === "22023" && error.details) {
        try {
          const parsed: unknown = JSON.parse(error.details);
          if (Array.isArray(parsed)) serverIssues = parsed.filter((issue): issue is PublishIssue =>
            Boolean(issue && typeof issue.path === "string" && typeof issue.step === "string" && typeof issue.message === "string"));
        } catch { /* Ordinary database errors have no structured checklist. */ }
      }
      return { ok: false, message: writeError(error), issues: serverIssues };
    }
    const row = data as InvitationRow;
    return {
      ...writeResult(row),
      publishedAt: row.published_at ?? row.updated_at,
      slugAdjusted: row.slug !== requestedSlug,
      requestedSlug,
      resolvedSlug: row.slug,
    };
  } catch (error) {
    return thrownError(error);
  }
}

/** Removes the public copy without deleting private edits or the reserved link. */
export async function unpublishInvitation(
  supabase: SupabaseClient,
  draft: WeddingData,
  revision = draft.meta.draftRevision ?? 0,
): Promise<UnpublishOutcome> {
  try {
    const { data, error } = await callInvitationRpc(supabase, "unpublish_invitation_snapshot", {
      p_id: draft.id,
      p_expected_revision: revision,
    });
    if (error || !data) return { ok: false, message: writeError(error) };
    return writeResult(data as InvitationRow);
  } catch (error) {
    return thrownError(error);
  }
}

export function describeSlugAdjustment(requestedSlug: string, resolvedSlug: string): string {
  return `The link /w/${requestedSlug} was already taken. Your invitation is live at /w/${resolvedSlug} instead.`;
}
