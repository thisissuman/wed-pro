import { expect, test } from "@playwright/test";

async function settlePage(page: import("@playwright/test").Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForLoadState("networkidle");
}

test.describe("visual regression", () => {
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
    await expect(page.getByRole("button", { name: /preview/i }).first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page).toHaveScreenshot("template-gallery.png", { fullPage: true });
  });

  test("royal preview matches baseline", async ({ page }) => {
    await page.goto("/preview/royal");
    await settlePage(page);
    await expect(page.getByText(/Rahul/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveScreenshot("preview-royal.png", { fullPage: true });
  });
});
