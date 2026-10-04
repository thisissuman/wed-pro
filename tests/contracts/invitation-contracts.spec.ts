import { expect, test } from "@playwright/test";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createStarterWeddingData, normalizeInvitationRow, type InvitationRow } from "../../src/lib/invitations";
import { getDemoDates } from "../../src/lib/demo-dates";
import { formatWeddingDate } from "../../src/lib/format-wedding-date";
import { isCalendarDate, isSafeInvitationUrl, safeInvitationForRendering, validatePublishReadiness } from "../../src/lib/publish-readiness";
import { resolveInvitationShareImage } from "../../src/lib/share-image";
import { isProtectedApplicationPath, isPublicStaticAsset } from "../../src/lib/auth/session-routing";
import { UPLOAD_POLICY, isAllowedUploadFile } from "../../src/lib/cloudinary-upload-policy";
import { publishInvitation, saveInvitationDraft, unpublishInvitation } from "../../src/lib/publish";
import { readUploadRequest } from "../../src/lib/upload-request";
import { useInvitationEditorStore } from "../../src/stores/invitation-editor-store";

const now = "2030-01-01T12:00:00Z";
function fixture() {
  const data = createStarterWeddingData({ id: "test-invitation", slug: "draft-reserved", templateId: "royal", userId: "owner-a", now });
  data.couple.bride.name = "Meera Rao";
  data.couple.groom.name = "Arjun Shah";
  data.venue.name = "Lotus Hall";
  data.venue.address = "123 Lake Road";
  data.events[0].title = "Wedding ceremony";
  data.events[0].venue = "Lotus Hall";
  data.sections.showRSVP = false;
  data.sections.showStory = false;
  data.gallery.images = [];
  data.story.timeline = [];
  return data;
}
function row(content = fixture(), revision = 1): InvitationRow {
  return { id: content.id, user_id: content.meta.userId!, slug: content.slug,
    template_id: content.templateId, status: content.status, content,
    created_at: now, updated_at: now, published_at: null, draft_revision: revision };
}
function rpcClient(reply: unknown, calls: { name: string; args: Record<string, unknown> }[]) {
  return { rpc(name: string, args: Record<string, unknown>) {
    calls.push({ name, args });
    return { abortSignal: async () => reply };
  } } as unknown as SupabaseClient;
}

test("starter content is not publishable, optional photos/story are not required", () => {
  const valid = fixture();
  expect(validatePublishReadiness(valid)).toEqual([]);
  valid.couple.bride.name = "Bride";
  expect(validatePublishReadiness(valid)).toEqual(expect.arrayContaining([expect.objectContaining({ path: "couple.bride.name" })]));
});
test("readiness requires events, real venue and enabled RSVP destination", () => {
  const data = fixture(); data.events = []; data.venue.name = "Venue name";
  data.sections.showRSVP = true; data.rsvp = { type: "link", formUrl: "javascript:alert(1)" };
  const paths = validatePublishReadiness(data).map(issue => issue.path);
  expect(paths).toEqual(expect.arrayContaining(["events", "venue.name", "rsvp.formUrl"]));
});
test("calendar dates reject rollover and accept past weddings/leap days", () => {
  expect(isCalendarDate("2024-02-29")).toBe(true);
  expect(isCalendarDate("2025-02-29")).toBe(false);
  expect(isCalendarDate("2030-04-31")).toBe(false);
  expect(isCalendarDate("2020-01-01")).toBe(true);
});
test("unsafe hidden links fail readiness; safe rendering does not mutate stored JSON", () => {
  const data = fixture(); data.sections.showStory = false;
  data.story.timeline = [{ id: "s", date: "2020", title: "Story", description: "Ours", photo: "data:image/svg+xml,unsafe" }];
  expect(validatePublishReadiness(data).some(issue => issue.path === "story.timeline.0.photo")).toBe(true);
  expect(safeInvitationForRendering(data).story.timeline[0].photo).toBeUndefined();
  expect(data.story.timeline[0].photo).toBe("data:image/svg+xml,unsafe");
});
test("URL boundary rejects credentials, protocols and escaped network paths", () => {
  for (const value of ["javascript:alert(1)", "https://user:pass@example.com/a", "//evil.example/a", "/%2f/evil.example", "https://example.com/ bad"]) {
    expect(isSafeInvitationUrl(value, true), value).toBe(false);
  }
  expect(isSafeInvitationUrl("/media/photo.webp", true)).toBe(true);
  expect(isSafeInvitationUrl("/media/photo.webp")).toBe(false);
});
test("fixed reference produces a deterministic future demo, saved dates remain real", () => {
  expect(getDemoDates("2023-12-01T23:59:59Z").weddingDate).toBe("2024-02-29");
  expect(getDemoDates(now).eventDates[3]).toBe(getDemoDates(now).weddingDate);
  const data = fixture(); data.couple.weddingDate = "2020-07-04";
  expect(normalizeInvitationRow(row(data)).couple.weddingDate).toBe("2020-07-04");
  expect(formatWeddingDate("2030-01-01T00:00:00Z", "invalid-zone")).toBe(formatWeddingDate("2030-01-01T00:00:00Z", "Asia/Kolkata"));
});
test("sharing preserves explicit choices and falls back past unusable images", () => {
  const data = fixture(); data.seo.ogImage = "https://images.example/explicit.jpg";
  data.seo.whatsappPreviewImage = "https://images.example/wa.jpg";
  data.hero.backgroundMedia = "https://images.example/hero.jpg";
  expect(resolveInvitationShareImage(data, "https://test.example")).toBe(data.seo.ogImage);
  data.seo.ogImage = "https://images.example/audio.mp3";
  expect(resolveInvitationShareImage(data, "https://test.example")).toBe(data.seo.whatsappPreviewImage);
  data.seo.whatsappPreviewImage = "javascript:bad";
  expect(resolveInvitationShareImage(data, "https://test.example")).toBe(data.hero.backgroundMedia);
});
test("static namespace boundaries never exempt protected file-like routes", () => {
  for (const path of ["/dashboard/media/photo.mp4", "/dashboard/film.mp3", "/media-tools", "/tap-to-opening"]) expect(isPublicStaticAsset(path)).toBe(false);
  expect(isProtectedApplicationPath("/dashboard/file.mp4")).toBe(true);
  expect(isProtectedApplicationPath("/dashboard-other")).toBe(false);
  expect(isPublicStaticAsset("/media/royal-3d-cinema/v1/films/film1.mp4")).toBe(true);
});
test("upload size/type boundaries reject video and over-limit attachments", () => {
  expect(isAllowedUploadFile(UPLOAD_POLICY.image.maxBytes, "image/jpeg", "photo.jpg", "image")).toBe(true);
  expect(isAllowedUploadFile(UPLOAD_POLICY.image.maxBytes + 1, "image/jpeg", "photo.jpg", "image")).toBe(false);
  expect(isAllowedUploadFile(100, "video/mp4", "clip.mp4", "video")).toBe(false);
  expect(isAllowedUploadFile(100, "audio/mp4", "song.m4a", "video")).toBe(true);
});
test("a delayed acknowledgement preserves newer edits and authoritative stable link", () => {
  const store = useInvitationEditorStore; const original = fixture(); store.getState().initialize(original);
  store.getState().updateDraft(data => ({ ...data, couple: { ...data.couple, bride: { ...data.couple.bride, name: "Newer name" } } }));
  const published = { ...original, status: "published" as const, slug: "arjun-weds-meera-2", meta: { ...original.meta, draftRevision: 2, firstPublishedAt: now } };
  store.getState().acknowledgeWrite(published, 0);
  expect(store.getState().draft?.couple.bride.name).toBe("Newer name");
  expect(store.getState().draft?.slug).toBe("arjun-weds-meera-2");
  expect(store.getState().saveState).toBe("idle");
  store.getState().initialize({ ...original, id: "other" });
  store.getState().acknowledgeWrite(published, 0);
  expect(store.getState().draft?.id).toBe("other");
});
test("local edits cannot silently rename or alter publication bookkeeping", () => {
  const store = useInvitationEditorStore; store.getState().initialize(fixture());
  store.getState().updateDraft(data => ({ ...data, slug: "renamed", status: "published", meta: { ...data.meta, draftRevision: 99 } }));
  expect(store.getState().draft?.slug).toBe("draft-reserved");
  expect(store.getState().draft?.status).toBe("draft");
});
test("publish promotes the saved revision without sending a second content snapshot", async () => {
  const calls: { name: string; args: Record<string, unknown> }[] = [];
  const data = fixture(); const published = { ...row(data, 8), status: "published" as const, slug: "arjun-shah-weds-meera-rao-2", published_at: now };
  const result = await publishInvitation(rpcClient({ data: published, error: null }, calls), data, 7);
  expect(result.ok).toBe(true);
  expect(calls[0].name).toBe("publish_invitation_snapshot");
  expect(calls[0].args.p_expected_revision).toBe(7);
  expect(calls[0].args).not.toHaveProperty("p_content");
});
test("invalid publish never dispatches; stale RPC writes give reconciliation guidance", async () => {
  const calls: { name: string; args: Record<string, unknown> }[] = [];
  const data = fixture(); data.couple.bride.name = "Bride";
  expect((await publishInvitation(rpcClient({}, calls), data)).ok).toBe(false);
  expect(calls).toHaveLength(0);
  for (const code of ["PT409", "40001"]) {
    const failure = await saveInvitationDraft(rpcClient({ data: null, error: { code } }, calls), fixture());
    expect(failure).toMatchObject({ ok: false, message: expect.stringMatching(/another session.*Reload/) });
  }
});
test("thrown network errors return retryable results for every write helper", async () => {
  const client = { rpc() { throw new Error("Offline fixture"); } } as unknown as SupabaseClient;
  for (const action of [saveInvitationDraft, publishInvitation, unpublishInvitation]) {
    expect(await action(client, fixture())).toMatchObject({ ok: false, message: "Offline fixture" });
  }
});


test("upload metadata uses the actual Host authority and rejects cross-origin/oversized bodies", async () => {
  const request = (origin: string, body = "{}") => new Request("http://localhost:3100/api/cloudinary/upload", {
    method: "POST", headers: { "Content-Type": "application/json", Host: "127.0.0.1:3100", Origin: origin }, body,
  });
  expect(await readUploadRequest(request("http://127.0.0.1:3100"))).toEqual({});
  await expect(readUploadRequest(request("http://evil.example"))).rejects.toThrow("this site");
  await expect(readUploadRequest(request("http://localhost:3100"))).rejects.toThrow("this site");
  await expect(readUploadRequest(request("http://127.0.0.1:3100", JSON.stringify({ bytes: "x".repeat(8192) })))).rejects.toThrow("too large");
  await expect(readUploadRequest(request("http://127.0.0.1:3100", "[]"))).rejects.toThrow("Invalid upload metadata");
});
