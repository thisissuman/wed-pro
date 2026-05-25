import { expect, test } from "@playwright/test";

const email = process.env.PLAYWRIGHT_TEST_EMAIL;
const password = process.env.PLAYWRIGHT_TEST_PASSWORD;

test.skip(
  !email || !password,
  "Set PLAYWRIGHT_TEST_EMAIL and PLAYWRIGHT_TEST_PASSWORD to run authenticated publish smoke tests."
);

test("authenticated user can create a draft from the Royal template", async ({ page }) => {
  await page.goto("/login?next=/template");
  await page.getByLabel(/email address/i).fill(email!);
  await page.getByLabel(/^password$/i).fill(password!);
  await page.getByRole("button", { name: /login to your studio/i }).click();

  await expect(page).toHaveURL(/\/template$/);
  await page.getByRole("button", { name: /select/i }).first().click();

  await expect(page).toHaveURL(/\/dashboard\/invitations\/.+\/edit/);
  await expect(page.getByText(/wedding details/i).first()).toBeVisible();
});
