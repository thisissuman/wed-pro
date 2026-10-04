import { test, expect } from "@playwright/test";
import { JSDOM } from "jsdom";
import { act, createElement, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useInvitationPersistence } from "../../src/features/invitations/useInvitationPersistence";
import { useInvitationEditorStore as store } from "../../src/stores/invitation-editor-store";
import { createStarterWeddingData } from "../../src/lib/invitations";
import type { WeddingData } from "../../src/types/wedding.types";
import { clearRecoveryCopies, readRecovery, setRecoveryOwner, writeRecovery } from "../../src/lib/invitation-recovery";

type Pipeline = ReturnType<typeof useInvitationPersistence>;
type Reply = { data: unknown; error: unknown };
let dom: JSDOM, root: Root, pipeline: Pipeline;
let requests: { name: string; args: Record<string, unknown>; resolve: (reply: Reply) => void }[];
let client: SupabaseClient;
const now = "2030-01-01T12:00:00Z";
function fixture(id = "disposable-fixture") {
  const data = createStarterWeddingData({ id, userId: "fixture-owner", slug: "reserved", templateId: "royal", now });
  data.couple.bride.name = "Meera Rao"; data.couple.groom.name = "Arjun Shah";
  data.venue.name = "Lotus Hall"; data.venue.address = "123 Lake Road";
  data.events[0].title = "Wedding"; data.events[0].venue = "Lotus Hall";
  data.sections.showRSVP = false; data.demoContentAcknowledged = true;
  return data;
}
function Harness({ data }: { data: WeddingData }) {
  const value = useInvitationPersistence(data, client);
  useEffect(() => { pipeline = value; }, [value]);
  return null;
}
async function mount(data = fixture()) { await act(async () => root.render(createElement(Harness, { data }))); }
async function edit(name: string) {
  await act(async () => store.getState().updateDraft(d => ({ ...d, couple: { ...d.couple, bride: { ...d.couple.bride, name } } })));
}
async function respond(index: number, revision: number, status: "draft" | "published" = "draft") {
  const request = requests[index];
  const data = (request.args.p_content as WeddingData | undefined) ?? store.getState().draft!;
  await act(async () => request.resolve({ error: null, data: {
    id: data.id, user_id: data.meta.userId, slug: status === "published" ? "stable-2" : data.slug,
    status, template_id: data.templateId, content: data, draft_revision: revision,
    created_at: now, updated_at: now, published_at: status === "published" ? now : null,
    first_published_at: status === "published" ? now : null,
  } }));
}
test.beforeEach(() => {
  dom = new JSDOM("<div id='root'></div>", { url: "http://localhost" });
  Object.assign(globalThis, { window: dom.window, document: dom.window.document,
    localStorage: dom.window.localStorage, IS_REACT_ACT_ENVIRONMENT: true });
  root = createRoot(document.getElementById("root")!);
  requests = [];
  client = { rpc(name: string, args: Record<string, unknown>) {
    return { abortSignal: () => new Promise<Reply>(resolve => requests.push({ name, args, resolve })) };
  } } as unknown as SupabaseClient;
});
test.afterEach(async () => { await act(async () => root.unmount()); dom.window.close(); setRecoveryOwner(null); });

test("publish drains the latest edit, prevents duplicate actions and preserves edits made during publication", async () => {
  await mount(); await edit("Meera edited");
  let publishing!: Promise<unknown>;
  await act(async () => { publishing = pipeline.publish(); });
  expect(requests.map(r => r.name)).toEqual(["save_invitation_draft"]);
  expect(pipeline.isPublishing).toBe(true);
  expect(await pipeline.publish()).toMatchObject({ ok: false });
  await edit("Meera latest"); await respond(0, 1);
  expect(requests[1].name).toBe("save_invitation_draft");
  expect((requests[1].args.p_content as WeddingData).couple.bride.name).toBe("Meera latest");
  await respond(1, 2);
  expect(requests[2].name).toBe("publish_invitation_snapshot");
  expect(requests[2].args.p_expected_revision).toBe(2);
  await edit("Meera private after publish");
  await respond(2, 3, "published"); await publishing;
  expect(store.getState().draft?.couple.bride.name).toBe("Meera private after publish");
  expect(store.getState().draft?.slug).toBe("stable-2");
  expect(requests[3].name).toBe("save_invitation_draft");
  expect(requests[3].args.p_expected_revision).toBe(3);
  await respond(3, 4, "published");
  expect(pipeline.isPublishing).toBe(false);
  expect(store.getState().saveState).toBe("saved");
});
test("a failed save keeps edits and unlocks controls; explicit retry saves them", async () => {
  await mount(); await edit("Meera unsaved");
  let saving!: Promise<boolean>;
  await act(async () => { saving = pipeline.retrySave(); });
  await act(async () => requests[0].resolve({ data: null, error: { message: "Network fixture failed" } }));
  expect(await saving).toBe(false); expect(pipeline.isRetryingSave).toBe(false);
  expect(store.getState().saveState).toBe("error");
  expect(store.getState().draft?.couple.bride.name).toBe("Meera unsaved");
  await act(async () => { saving = pipeline.retrySave(); });
  await respond(1, 1); expect(await saving).toBe(true);
  expect(store.getState().saveState).toBe("saved");
});
test("changing invitation invalidates a delayed response and clears action availability", async () => {
  await mount(); await edit("Old private edit");
  let publishing!: Promise<unknown>;
  await act(async () => { publishing = pipeline.publish(); });
  await mount(fixture("different-invitation"));
  expect(pipeline.isPublishing).toBe(false);
  await respond(0, 1); expect(await publishing).toMatchObject({ ok: false });
  expect(store.getState().draft?.id).toBe("different-invitation");
  expect(store.getState().draft?.couple.bride.name).toBe("Meera Rao");
});
test("navigation drains a pending debounce; discard cancels unsent work", async () => {
  await mount(); await edit("Before navigation");
  let leaving!: Promise<boolean>;
  await act(async () => { leaving = pipeline.flushForNavigation(); });
  expect(requests).toHaveLength(1); await respond(0, 1); expect(await leaving).toBe(true);
  await edit("Discard this edit");
  await act(async () => { expect(await pipeline.discardPending()).toBe(true); });
  await new Promise(resolve => setTimeout(resolve, 1000));
  expect(requests).toHaveLength(1);
});
test("recovery is owner/invitation scoped, rejects stale copies and clears on sign-out", () => {
  const data = fixture();
  expect(writeRecovery(data)).toBe(false);
  setRecoveryOwner("fixture-owner"); expect(writeRecovery(data)).toBe(true);
  expect(readRecovery("other-owner", data.id)).toBeNull();
  expect(readRecovery("fixture-owner", data.id)?.content).toEqual(data);
  const key = `wed-pro:recovery:v1:fixture-owner:${data.id}`;
  const copy = JSON.parse(localStorage.getItem(key)!); copy.savedAt = Date.now() - 8 * 86400000;
  localStorage.setItem(key, JSON.stringify(copy)); expect(readRecovery("fixture-owner", data.id)).toBeNull();
  expect(localStorage.getItem(key)).toBeNull();
  writeRecovery(data); clearRecoveryCopies(); expect(localStorage.getItem(key)).toBeNull();
});
