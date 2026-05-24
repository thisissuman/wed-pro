import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveInvitationSlug, withEssentialSections } from "@/lib/invitations";
import type { WeddingData } from "@/types/wedding.types";

export interface PublishSuccess {
  ok: true;
  content: WeddingData;
  updatedAt: string;
  publishedAt: string;
  slugAdjusted: boolean;
  requestedSlug: string;
  resolvedSlug: string;
}

export interface PublishFailure {
  ok: false;
  message: string;
}

export type PublishOutcome = PublishSuccess | PublishFailure;

export interface UnpublishSuccess {
  ok: true;
  content: WeddingData;
  updatedAt: string;
}

export type UnpublishOutcome = UnpublishSuccess | PublishFailure;

export function isUniqueViolation(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === "23505" || /duplicate key|unique constraint/i.test(error.message ?? "");
}

export function formatPublishError(error: { code?: string; message?: string } | null): string {
  if (isUniqueViolation(error)) {
    return "This link slug is already taken. Edit the slug in Share Preview or try a different couple name.";
  }
  return error?.message ?? "Publish failed. Please try again.";
}

/** Build slug variants: `rahul-weds-ananya`, `rahul-weds-ananya-2`, … */
export function buildSlugCandidate(baseSlug: string, attempt: number): string {
  const normalized = baseSlug.trim();
  if (attempt <= 0) return normalized.slice(0, 64);
  const suffix = `-${attempt + 1}`;
  return `${normalized.slice(0, Math.max(1, 64 - suffix.length))}${suffix}`;
}

export async function isSlugAvailable(
  supabase: SupabaseClient,
  slug: string,
  invitationId: string
): Promise<boolean> {
  const normalized = slug.trim();
  if (!normalized) return false;

  const { data, error } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", normalized)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return !data || data.id === invitationId;
}

export async function findAvailableSlug(
  supabase: SupabaseClient,
  desiredSlug: string,
  invitationId: string
): Promise<string> {
  const normalized = desiredSlug.trim();
  if (!normalized) {
    throw new Error("Add couple names or a slug before publishing.");
  }

  for (let attempt = 0; attempt < 25; attempt++) {
    const candidate = buildSlugCandidate(normalized, attempt);
    if (await isSlugAvailable(supabase, candidate, invitationId)) {
      return candidate;
    }
  }

  throw new Error("Could not find an available link slug. Edit the slug in Share Preview.");
}

export async function publishInvitation(
  supabase: SupabaseClient,
  draft: WeddingData
): Promise<PublishOutcome> {
  const publishedAt = new Date().toISOString();
  const requestedSlug = resolveInvitationSlug(draft);

  let resolvedSlug: string;
  try {
    resolvedSlug = await findAvailableSlug(supabase, requestedSlug, draft.id);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not verify slug availability.",
    };
  }

  const slugAdjusted = resolvedSlug !== requestedSlug;

  const buildContent = (slug: string): WeddingData => ({
    ...draft,
    status: "published",
    slug,
    sections: withEssentialSections(draft.sections),
    meta: {
      ...draft.meta,
      publishedAt,
      updatedAt: publishedAt,
    },
  });

  const writePublish = (slug: string) =>
    supabase
      .from("invitations")
      .update({
        slug,
        status: "published",
        published_at: publishedAt,
        content: buildContent(slug),
      })
      .eq("id", draft.id)
      .select("updated_at,published_at")
      .single();

  let { data, error } = await writePublish(resolvedSlug);

  if (error && isUniqueViolation(error)) {
    try {
      resolvedSlug = await findAvailableSlug(supabase, requestedSlug, draft.id);
      const retry = await writePublish(resolvedSlug);
      data = retry.data;
      error = retry.error;
    } catch (retryError) {
      return {
        ok: false,
        message:
          retryError instanceof Error ? retryError.message : formatPublishError(error),
      };
    }
  }

  if (error || !data) {
    return { ok: false, message: formatPublishError(error) };
  }

  return {
    ok: true,
    content: buildContent(resolvedSlug),
    updatedAt: data.updated_at,
    publishedAt: data.published_at ?? publishedAt,
    slugAdjusted: slugAdjusted || resolvedSlug !== requestedSlug,
    requestedSlug,
    resolvedSlug,
  };
}

export async function unpublishInvitation(
  supabase: SupabaseClient,
  draft: WeddingData
): Promise<UnpublishOutcome> {
  const updatedAt = new Date().toISOString();
  const content: WeddingData = {
    ...draft,
    status: "draft",
    meta: {
      ...draft.meta,
      updatedAt,
    },
  };

  const { data, error } = await supabase
    .from("invitations")
    .update({
      status: "draft",
      published_at: null,
      content,
    })
    .eq("id", draft.id)
    .select("updated_at")
    .single();

  if (error || !data) {
    return { ok: false, message: error?.message ?? "Unpublish failed. Please try again." };
  }

  return {
    ok: true,
    content: {
      ...content,
      meta: {
        ...content.meta,
        updatedAt: data.updated_at ?? updatedAt,
      },
    },
    updatedAt: data.updated_at ?? updatedAt,
  };
}

export function describeSlugAdjustment(requestedSlug: string, resolvedSlug: string): string {
  return `The link /w/${requestedSlug} was already taken. Your invitation is live at /w/${resolvedSlug} instead.`;
}
