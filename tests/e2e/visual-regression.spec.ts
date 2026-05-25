import { expect, test, type Page } from "@playwright/test";

/** Wait until document height stops changing (lazy media, fonts, hydration). */
async function waitForStableDocumentHeight(page: Page, timeoutMs = 5_000) {
  const start = Date.now();
  let lastHeight = 0;
  let stablePasses = 0;

  while (Date.now() - start < timeoutMs) {
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight
    );

    if (height === lastHeight) {
      stablePasses += 1;
      if (stablePasses >= 3) {
        return;
      }
    } else {
      stablePasses = 0;
      lastHeight = height;
    }

    await page.waitForTimeout(150);
  }
}

async function settlePage(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });
  await waitForStableDocumentHeight(page);
}

async function settleInvitationPreview(page: Page) {
  await settlePage(page);
  await expect(page.getByText(/Rahul/i).first()).toBeVisible({ timeout: 15_000 });
  await waitForStableDocumentHeight(page);
}

test.describe("visual regression", () => {
  test.describe.configure({ timeout: 60_000 });

  test("homepage matches baseline", async ({ page }) => {
    await page.goto("/");
    await settlePage(page);
    await expect(page.getByRole("link", { name: /live demo/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page).toHaveScreenshot("homepage.png", { fullPage: true });
  });

  test("template gallery matches baseline", async ({ page }) => {
    await page.goto("/template");
    await settlePage(page);
    await expect(page.getByRole("link", { name: /preview/i }).first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page).toHaveScreenshot("template-gallery.png", { fullPage: true });
  });

  test("royal preview matches baseline", async ({ page }) => {
    await page.goto("/preview/royal");
    await settleInvitationPreview(page);
    // Viewport capture (not fullPage) — full-page height varies across CI OS/fonts.
    await expect(page).toHaveScreenshot("preview-royal.png");
  });
});
