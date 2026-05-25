import { expect, test, type Page } from "@playwright/test";

const email = process.env.PLAYWRIGHT_TEST_EMAIL;
const password = process.env.PLAYWRIGHT_TEST_PASSWORD;

test.skip(
  !email || !password,
  "Set PLAYWRIGHT_TEST_EMAIL and PLAYWRIGHT_TEST_PASSWORD to run authenticated publish smoke tests."
);

async function login(page: Page) {
  await page.goto("/login?next=/template");
  await page.getByLabel(/email address/i).fill(email!);
  await page.getByLabel(/^password$/i).fill(password!);
  await page.getByRole("button", { name: /login to your studio/i }).click();
  await expect(page).toHaveURL(/\/template$/, { timeout: 20_000 });
}

/** Product allows max 3 drafts per user — free a slot before creating another in CI. */
async function ensureDraftSlot(page: Page) {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });

  const deleteButtons = page.getByRole("button", { name: /^delete /i });
  if ((await deleteButtons.count()) < 3) {
    return;
  }

  await deleteButtons.first().click();
  await page.getByRole("button", { name: /delete permanently/i }).click();
  await expect(
    page.getByRole("dialog").filter({ hasText: /delete this invitation/i })
  ).toBeHidden({ timeout: 20_000 });
}

test("authenticated user can create a draft from the Royal template", async ({
  page,
}) => {
  await login(page);
  await ensureDraftSlot(page);

  await page.goto("/template");
  await expect(page).toHaveURL(/\/template$/);

  const selectButton = page.getByRole("button", { name: /select/i }).first();
  await expect(selectButton).toBeVisible({ timeout: 15_000 });
  await selectButton.click();

  await expect(page).toHaveURL(/\/dashboard\/invitations\/.+\/edit/, {
    timeout: 30_000,
  });
  await expect(page.getByText(/wedding details/i).first()).toBeVisible({
    timeout: 15_000,
  });
});
