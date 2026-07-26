import { expect, test } from "@playwright/test";

test("homepage presents free beta and opens the Royal demo", async ({ page }) => {
  await page.goto("/");

  const liveDemo = page.getByRole("link", { name: /live demo/i });
  await expect(liveDemo).toBeVisible({ timeout: 15_000 });

  await expect(
    page.getByText(/open beta · free digital wedding invitations/i)
  ).toBeVisible();

  await liveDemo.click();
  await expect(page).toHaveURL(/\/preview\/royal$/);
  await expect(page.getByText(/Rahul/i).first()).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/Ananya/i).first()).toBeVisible();
});

test("dashboard is protected for anonymous users", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  await expect(
    page.getByRole("heading", { level: 2, name: /welcome back/i })
  ).toBeVisible({ timeout: 15_000 });
});

test("template picker can preview the registered Royal template", async ({ page }) => {
  await page.goto("/template");

  const royalPreview = page.locator('a[href="/preview/royal"]');
  await expect(royalPreview).toHaveCount(1);
  await royalPreview.click();
  await expect(page).toHaveURL(/\/preview\/royal$/);
  await expect(page.getByText(/wedding invitation/i).first()).toBeVisible({
    timeout: 15_000,
  });
});
