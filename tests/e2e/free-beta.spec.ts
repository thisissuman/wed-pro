import { expect, test } from "@playwright/test";

test("homepage presents free beta and opens the Royal demo", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText(/open beta · free digital wedding invitations/i)
  ).toBeVisible();

  await page.getByRole("link", { name: /live demo/i }).click();
  await expect(page).toHaveURL(/\/preview\/royal$/);
  await expect(page.getByText(/Rahul/i).first()).toBeVisible();
  await expect(page.getByText(/Ananya/i).first()).toBeVisible();
});

test("dashboard is protected for anonymous users", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
});

test("template picker can preview the registered Royal template", async ({ page }) => {
  await page.goto("/template");

  await page.getByRole("button", { name: /preview/i }).first().click();
  await expect(page).toHaveURL(/\/preview\/royal$/);
  await expect(page.getByText(/wedding invitation/i).first()).toBeVisible();
});
