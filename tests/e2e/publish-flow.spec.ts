import { expect, test, type Page } from "@playwright/test";
import { seedSupabaseSession } from "./helpers/seed-supabase-session";

const email = process.env.PLAYWRIGHT_TEST_EMAIL;
const password = process.env.PLAYWRIGHT_TEST_PASSWORD;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Skip only when credentials or Supabase env are missing (not when real secrets are configured). */
const hasAuthE2E =
  Boolean(email && password) &&
  supabaseUrl.length > 0 &&
  !supabaseUrl.includes("ci-placeholder") &&
  supabaseAnonKey.length > 0 &&
  !supabaseAnonKey.startsWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1v");

test.skip(
  !hasAuthE2E,
  "Set PLAYWRIGHT_TEST_EMAIL, PLAYWRIGHT_TEST_PASSWORD, NEXT_PUBLIC_SUPABASE_URL, and NEXT_PUBLIC_SUPABASE_ANON_KEY (repo secrets in CI)."
);

/** Establish session cookies, then open the protected dashboard. */
async function loginToDashboard(page: Page) {
  await seedSupabaseSession(page.context(), {
    email: email!,
    password: password!,
  });

  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

  if (page.url().includes("/login")) {
    throw new Error(
      "Auth cookies were set but /dashboard redirected to login. Verify NEXT_PUBLIC_SUPABASE_* in CI matches the project used by PLAYWRIGHT_TEST_* credentials."
    );
  }

  await expect(page.getByText(/creator workspace/i)).toBeVisible({
    timeout: 20_000,
  });
}

/** Product allows max 3 drafts per user — free a slot before creating another in CI. */
async function ensureDraftSlot(page: Page) {
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
  test.setTimeout(90_000);

  await loginToDashboard(page);
  await ensureDraftSlot(page);

  await page.getByRole("link", { name: /new invitation/i }).click();
  await expect(page).toHaveURL(/\/template$/);

  const selectButton = page.getByRole("button", { name: /select/i }).first();
  await expect(selectButton).toBeVisible({ timeout: 15_000 });
  await selectButton.click();

  const draftLimitDialog = page.getByRole("alertdialog");
  if (await draftLimitDialog.isVisible().catch(() => false)) {
    await page.getByRole("link", { name: /go to dashboard/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await ensureDraftSlot(page);
    await page.getByRole("link", { name: /new invitation/i }).click();
    await expect(selectButton).toBeVisible({ timeout: 15_000 });
    await selectButton.click();
  }

  await expect(page).toHaveURL(/\/dashboard\/invitations\/.+\/edit/, {
    timeout: 30_000,
  });
  await expect(page.getByText(/wedding details/i).first()).toBeVisible({
    timeout: 15_000,
  });
});
