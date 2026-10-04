import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID, createHash } from "node:crypto";
import { createStarterWeddingData, type InvitationRow as StoredInvitationRow } from "../../src/lib/invitations";
import { seedSupabaseSession } from "../e2e/helpers/seed-supabase-session";
import type { TemplateId } from "../../src/templates/registry";
import type { WeddingData } from "../../src/types/wedding.types";

type InvitationRow = Omit<StoredInvitationRow, "content"> & { content: WeddingData };

// One worker serializes dedicated-owner fixtures; individual failures do not skip later cases.
let owner: SupabaseClient, ownerId: string;
const created: string[] = [];
const assets = new Map<string, "image" | "video">();
const credentials = { email: process.env.WED_TEST_OWNER_A_EMAIL!, password: process.env.WED_TEST_OWNER_A_PASSWORD! };
const must = <T,>(result: { data: T; error: { code?: string } | null }): T => {
  expect(result.error, `Provider operation failed (${result.error?.code ?? "unknown"})`).toBeNull(); return result.data;
};

test.beforeAll(async () => {
  const url = process.env.WED_TEST_SUPABASE_URL!;
  expect(process.env.WED_TEST_DISPOSABLE_TARGET).toBe(url);
  if (new URL(url).hostname === "kbwkvbwdxstwsfgkpwbp.supabase.co") expect(process.env.WED_TEST_ALLOW_SHARED_TARGET).toBe(url);
  owner = createClient(url, process.env.WED_TEST_SUPABASE_ANON_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  const login = await owner.auth.signInWithPassword(credentials); expect(login.error).toBeNull(); ownerId = login.data.user!.id;
  expect(must(await owner.from("invitations").select("id")), "Dedicated owner must be empty; preserve personal rows").toEqual([]);
});
test.afterEach(async () => {
  for (const id of created.splice(0)) must(await owner.from("invitations").delete().eq("id", id));
  for (const [publicId, resourceType] of assets) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = createHash("sha256").update(`public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`).digest("hex");
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/destroy`, {
      method: "POST", body: new URLSearchParams({ public_id: publicId, timestamp, signature, api_key: process.env.CLOUDINARY_API_KEY! }), signal: AbortSignal.timeout(15_000),
    });
    expect(response.ok).toBe(true); expect(["ok", "not found"]).toContain((await response.json()).result);
    assets.delete(publicId);
  }
});
async function fixture(templateId: TemplateId = "royal") {
  const id = randomUUID(), slug = `browser-${id.slice(0, 8)}`; created.push(id);
  const data = createStarterWeddingData({ id, userId: ownerId, slug, templateId, now: "2030-01-01T12:00:00Z" });
  data.couple.bride.name = `Meera ${id.slice(0, 8)}`; data.couple.groom.name = `Arjun ${id.slice(0, 8)}`;
  data.venue.name = "Verification Hall"; data.venue.address = "123 Fixture Road";
  data.events[0].venue = "Verification Hall"; data.events[0].title = "Wedding ceremony";
  data.sections.showRSVP = false; data.demoContentAcknowledged = true;
  return must(await owner.rpc("create_invitation_draft", { p_id: id, p_slug: slug, p_template_id: templateId, p_content: data })) as InvitationRow;
}
async function read(id: string) { return must(await owner.from("invitations").select("*").eq("id", id).single()) as InvitationRow; }
async function enter(page: Page, context: BrowserContext, row: InvitationRow) {
  await seedSupabaseSession(context, credentials);
  await page.goto(`/dashboard/invitations/${row.id}/edit`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && (!visualViewport || innerWidth <= visualViewport.width + 1))).toBe(true);
}
async function panel(page: Page, title = "Wedding Details") {
  if (page.viewportSize()!.width < 1024) await page.getByRole("button", { name: `Go to ${title}`, exact: true }).click();
  else {
    const button = page.getByRole("button", { name: new RegExp(`^${title.replace(/&/g, "&")}`) });
    if (await button.getAttribute("aria-expanded") !== "true") await button.click();
  }
}
async function saved(page: Page) { await expect(page.getByRole("status").filter({ hasText: /Saved privately/ })).toBeVisible(); }
async function publish(page: Page, label = "Publish") {
  if (page.viewportSize()!.width < 1024) await panel(page, "Optional Sections");
  await page.getByRole("button", { name: label, exact: true }).filter({ visible: true }).click();
  await expect(page.getByRole("dialog", { name: "Share your link" })).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Close", exact: true }).click();
}

for (const templateId of ["royal", "floral-elegance", "royal-3d-cinema"] as const) {
  test(`${templateId}: real editor save/reload/private preview/publish/public metadata/unpublish`, async ({ page, context, request }) => {
    let row = await fixture(templateId); await enter(page, context, row); await panel(page);
    const name = `Private ${randomUUID().slice(0, 8)} long wedding name`;
    await page.getByLabel("Bride Name", { exact: true }).filter({ visible: true }).fill(name); await saved(page);
    expect((await read(row.id)).content.couple.bride.name).toBe(name);
    await page.reload(); await panel(page); await expect(page.getByLabel("Bride Name", { exact: true }).filter({ visible: true })).toHaveValue(name);
    await publish(page); row = await read(row.id); const stable = row.slug;
    let html = await (await request.get(`/w/${stable}`)).text(); expect(html).toContain(name);
    expect(html).toContain('property="og:title"');
    await panel(page); await page.getByLabel("Bride Name", { exact: true }).filter({ visible: true }).fill("Later private bride"); await saved(page);
    html = await (await request.get(`/w/${stable}`)).text(); expect(html).not.toContain("Later private bride");
    const preview = await page.request.get(`/dashboard/invitations/${row.id}/preview`); expect(await preview.text()).toContain("Later private bride");
    await publish(page, "Republish"); expect((await read(row.id)).slug).toBe(stable);
    html = await (await request.get(`/w/${stable}`)).text(); expect(html).toContain("Later private bride");
    await page.getByRole("button", { name: "Unpublish", exact: true }).filter({ visible: true }).click();
    await expect(page.getByRole("dialog", { name: "Unpublish this invitation?" }).getByRole("button", { name: "Cancel" })).toBeFocused();
    await page.getByRole("dialog").getByRole("button", { name: "Unpublish", exact: true }).click();
    await expect.poll(async () => (await read(row.id)).status).toBe("draft");
    expect((await request.get(`/w/${stable}`)).status()).toBe(404);
    await publish(page); expect((await read(row.id)).slug).toBe(stable);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("failed autosave protects internal navigation, retries, and recovers after reload", async ({ page, context }) => {
  const row = await fixture(); await enter(page, context, row); await panel(page);
  await page.route("**/rest/v1/rpc/save_invitation_draft", route => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "Fixture offline save" }) }));
  await page.getByLabel("Bride Name", { exact: true }).filter({ visible: true }).fill("Recover this private name");
  await expect(page.getByRole("button", { name: "Retry private save" })).toBeVisible();
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Save before leaving?" }); await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
  await dialog.getByRole("button", { name: "Save and leave" }).click(); await expect(dialog.getByRole("alert")).toContainText("Fixture offline");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect.poll(() => page.evaluate(() => Object.keys(localStorage).some(k => k.startsWith("wed-pro:recovery:v1:")))).toBe(true);
  page.once("dialog", d => d.accept()); await page.reload();
  await expect(page.getByRole("dialog", { name: "Recover private edits?" })).toBeVisible();
  await page.unroute("**/rest/v1/rpc/save_invitation_draft");
  await page.getByRole("button", { name: "Restore private edits" }).click(); await panel(page); await saved(page);
  await expect(page.getByLabel("Bride Name", { exact: true }).filter({ visible: true })).toHaveValue("Recover this private name");
  expect((await read(row.id)).content.couple.bride.name).toBe("Recover this private name");
  // Immediate internal navigation must offer save/discard/cancel before debounce.
  await page.getByLabel("Bride Name", { exact: true }).filter({ visible: true }).fill("Save before dashboard");
  await page.getByRole("link", { name: "Dashboard", exact: true }).click(); await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Save and leave" }).click(); await expect(page).toHaveURL(/\/dashboard$/);
  expect((await read(row.id)).content.couple.bride.name).toBe("Save before dashboard");
});

test("edits during a delayed publish response remain private and newer local input survives", async ({ page, context }) => {
  const row = await fixture(); await enter(page, context, row);
  let release!: () => void; const gate = new Promise<void>(r => { release = r; }); let dispatched!: () => void;
  const pending = new Promise<void>(r => { dispatched = r; });
  await page.route("**/rest/v1/rpc/publish_invitation_snapshot", async route => {
    const response = await route.fetch(); dispatched(); await gate; await route.fulfill({ response });
  });
  if (page.viewportSize()!.width < 1024) await panel(page, "Optional Sections");
  await page.getByRole("button", { name: "Publish", exact: true }).filter({ visible: true }).click(); await pending;
  await panel(page); await page.getByLabel("Bride Name", { exact: true }).filter({ visible: true }).fill("Typed while publish pending"); release();
  await expect(page.getByRole("dialog", { name: "Share your link" })).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Close", exact: true }).click(); await saved(page);
  await expect(page.getByLabel("Bride Name", { exact: true }).filter({ visible: true })).toHaveValue("Typed while publish pending");
  const pub = must(await owner.from("published_invitations").select("content").eq("id", row.id).single());
  expect(pub!.content.couple.bride.name).not.toBe("Typed while publish pending");
  expect((await read(row.id)).content.couple.bride.name).toBe("Typed while publish pending");
});

test("crop cancellation and failed completion preserve prior media; retry uploads successfully", async ({ page, context }) => {
  const row = await fixture(); const prior = row.content.hero.backgroundMedia; await enter(page, context, row); await panel(page, "Media & Music");
  // Generated solid PNG; no personal files or existing remote assets used.
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64");
  const pick = async () => {
    const chooser = page.waitForEvent("filechooser"); await page.getByRole("button", { name: /photo: Hero Background Image/ }).click();
    await (await chooser).setFiles({ name: "fixture.png", mimeType: "image/png", buffer: png });
    await expect(page.getByRole("dialog", { name: "Crop photo" }).getByRole("slider")).toBeFocused();
    await expect(page.getByRole("button", { name: "Save crop", exact: true })).toBeEnabled();
  };
  let release!: () => void; const gate = new Promise<void>(r => { release = r; }); let attempted!: () => void;
  const pending = new Promise<void>(r => { attempted = r; });
  await page.route("https://api.cloudinary.com/**/image/upload", async route => { attempted(); await gate; await route.abort(); });
  await pick(); await page.getByRole("button", { name: "Save crop", exact: true }).click(); await pending;
  await page.getByRole("button", { name: "Cancel upload" }).click(); release();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("cancelled");
  expect((await read(row.id)).content.hero.backgroundMedia).toBe(prior);
  await page.keyboard.press("Escape"); await page.unroute("https://api.cloudinary.com/**/image/upload");
  page.on("response", async response => {
    if (response.url().endsWith("/api/cloudinary/upload") && response.ok()) {
      const auth = await response.json(); const ticket = JSON.parse(Buffer.from(auth.ticket.split(".")[0], "base64url").toString());
      assets.set(ticket.publicId, ticket.resourceType);
    }
  });
  await page.route("**/api/cloudinary/complete", route => route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ error: "Fixture confirmation failed. Existing media is unchanged." }) }));
  await pick(); await page.getByRole("button", { name: "Save crop", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Fixture confirmation failed");
  expect((await read(row.id)).content.hero.backgroundMedia).toBe(prior);
  await page.unroute("**/api/cloudinary/complete"); await page.getByRole("button", { name: "Save crop", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Crop photo" })).toBeHidden(); await saved(page);
  expect((await read(row.id)).content.hero.backgroundMedia).toMatch(/^https:\/\/res\.cloudinary\.com\//);
});


test("audio cancellation and failed confirmation retain prior music; replacement recovers", async ({ page, context }) => {
  const row = await fixture(); const prior = row.content.music.url; await enter(page, context, row); await panel(page, "Media & Music");
  // Generated silent PCM WAV, not a personal recording.
  const wav = Buffer.alloc(44 + 1600); wav.write("RIFF"); wav.writeUInt32LE(wav.length - 8, 4); wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(8000, 24);
  wav.writeUInt32LE(16000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write("data", 36); wav.writeUInt32LE(1600, 40);
  const pick = async () => {
    const chooser = page.waitForEvent("filechooser"); await page.getByRole("button", { name: /^(Upload|Replace) music$/ }).filter({ visible: true }).click();
    await (await chooser).setFiles({ name: "fixture.wav", mimeType: "audio/wav", buffer: wav });
  };
  let release!: () => void; const gate = new Promise<void>(r => { release = r; }); let attempted!: () => void;
  const pending = new Promise<void>(r => { attempted = r; });
  await page.route("https://api.cloudinary.com/**/video/upload", async route => { attempted(); await gate; await route.abort(); });
  await pick(); await pending; await page.getByRole("button", { name: "Cancel upload" }).click(); release();
  await expect(page.getByRole("main").getByRole("alert").filter({ visible: true })).toContainText("cancelled");
  expect((await read(row.id)).content.music.url).toBe(prior);
  await page.unroute("https://api.cloudinary.com/**/video/upload");
  page.on("response", async response => {
    if (response.url().endsWith("/api/cloudinary/upload") && response.ok()) {
      const auth = await response.json(); const ticket = JSON.parse(Buffer.from(auth.ticket.split(".")[0], "base64url").toString());
      assets.set(ticket.publicId, ticket.resourceType);
    }
  });
  await page.route("**/api/cloudinary/complete", route => route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ error: "Fixture audio confirmation failed" }) }));
  await pick(); await expect(page.getByRole("main").getByRole("alert").filter({ visible: true })).toContainText("Fixture audio confirmation failed");
  expect((await read(row.id)).content.music.url).toBe(prior);
  await page.unroute("**/api/cloudinary/complete"); await pick();
  await expect.poll(async () => (await read(row.id)).content.music.url).toMatch(/^https:\/\/res\.cloudinary\.com\//); await saved(page);
  await expect(page.getByRole("main").getByRole("alert").filter({ visible: true })).toHaveCount(0);
});

test("template selection creates a private invitation and starter publishing opens actionable errors", async ({ page, context }) => {
  await seedSupabaseSession(context, credentials);
  page.on("request", request => {
    if (request.url().endsWith("/rest/v1/rpc/create_invitation_draft")) {
      const id = request.postDataJSON()?.p_id;
      if (typeof id === "string" && !created.includes(id)) created.push(id);
    }
  });
  await page.goto("/template");
  const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Floral Elegance", exact: true }) });
  await card.getByRole("button", { name: "Select", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/invitations\/[^/]+\/edit$/);
  const id = page.url().split("/").at(-2)!; expect(created).toContain(id);
  expect((await read(id)).status).toBe("draft");
  if (page.viewportSize()!.width < 1024) await panel(page, "Optional Sections");
  await page.getByRole("button", { name: "Publish", exact: true }).filter({ visible: true }).click();
  await expect(page.getByRole("region", { name: "Publish checklist" })).toBeVisible();
  await page.getByRole("region", { name: "Publish checklist" }).getByRole("button", { name: /bride's real name/i }).click();
  await expect(page.getByLabel("Bride Name", { exact: true }).filter({ visible: true })).toBeVisible();
  expect((await read(id)).status).toBe("draft");
});

test("a second signed-in owner cannot open another owner's private editor or preview", async ({ page, context }) => {
  const row = await fixture();
  await seedSupabaseSession(context, { email: process.env.WED_TEST_OWNER_B_EMAIL!, password: process.env.WED_TEST_OWNER_B_PASSWORD! });
  const deniedUpload = await context.request.post("/api/cloudinary/upload", {
    headers: { Origin: process.env.PLAYWRIGHT_BASE_URL! },
    data: { folder: `wed-pro/${row.id}/hero`, resourceType: "image", size: 100, mimeType: "image/png", fileName: "fixture.png" },
  });
  expect(deniedUpload.status()).toBe(403);
  expect((await deniedUpload.json()).error).toContain("not available for uploads");
  for (const suffix of ["edit", "preview"]) {
    const response = await page.goto(`/dashboard/invitations/${row.id}/${suffix}`);
    // Next may have begun streaming before notFound() determines ownership.
    expect([200, 404]).toContain(response!.status());
    await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible();
    await expect(page.getByText(row.content.couple.bride.name, { exact: true })).toHaveCount(0);
    expect(await page.content()).not.toContain(row.content.couple.bride.name);
  }
});

test("browser Back keeps failed edits until cancel or explicit discard, then clears recovery", async ({ page, context }) => {
  const row = await fixture(); const prior = row.content.couple.bride.name;
  await seedSupabaseSession(context, credentials); await page.goto("/dashboard");
  await page.locator(`a[href='/dashboard/invitations/${row.id}/edit']`).click(); await panel(page);
  await page.route("**/rest/v1/rpc/save_invitation_draft", route => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "Fixture offline before Back" }) }));
  await page.getByLabel("Bride Name", { exact: true }).filter({ visible: true }).fill("Discard this failed edit");
  await expect(page.getByRole("button", { name: "Retry private save" })).toBeVisible();
  await page.goBack(); const dialog = page.getByRole("dialog", { name: "Save before leaving?" }); await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${row.id}/edit$`));
  await expect(page.getByLabel("Bride Name", { exact: true }).filter({ visible: true })).toHaveValue("Discard this failed edit");
  await page.goBack(); await expect(dialog).toBeVisible(); await dialog.getByRole("button", { name: "Discard and leave" }).click();
  await expect(page).toHaveURL(/\/dashboard$/); expect((await read(row.id)).content.couple.bride.name).toBe(prior);
  expect(await page.evaluate(id => Object.keys(localStorage).some(k => k.startsWith("wed-pro:recovery:v1:") && k.endsWith(`:${id}`)), row.id)).toBe(false);
  await page.unroute("**/rest/v1/rpc/save_invitation_draft"); await page.locator(`a[href='/dashboard/invitations/${row.id}/edit']`).click();
  await expect(page.getByRole("dialog", { name: "Recover private edits?" })).toHaveCount(0);
  await panel(page); await expect(page.getByLabel("Bride Name", { exact: true }).filter({ visible: true })).toHaveValue(prior);
});
