import { expect, test, type Page } from "@playwright/test";

const email = process.env.PLAYWRIGHT_TEST_EMAIL;
const password = process.env.PLAYWRIGHT_TEST_PASSWORD;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/** Skip only when credentials or Supabase URL are missing (not when real secrets are configured). */
const hasAuthE2E =
  Boolean(email && password) &&
  supabaseUrl.length > 0 &&
  !supabaseUrl.includes("ci-placeholder");

test.skip(
  !hasAuthE2E,
  "Set PLAYWRIGHT_TEST_EMAIL, PLAYWRIGHT_TEST_PASSWORD, and NEXT_PUBLIC_SUPABASE_URL (repo secrets in CI)."
);

/** Log in and land on a protected route so session cookies are verified (not /template, which is public). */
async function loginToDashboard(page: Page) {
  await page.goto("/login?next=/dashboard");

  await page.getByLabel(/email address/i).fill(email!);
  await page.getByLabel(/^password$/i).fill(password!);

  const loginButton = page.getByRole("button", { name: /login to your studio/i });

  const authResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/auth/v1/token") &&
      response.request().method() === "POST" &&
      response.status() === 200,
    { timeout: 30_000 }
  );

  // Login page calls router.push(next) after sign-in — do not page.goto (races → ERR_ABORTED in CI).
  const dashboardNavigation = page.waitForURL(/\/dashboard/, {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  });

  await loginButton.click();

  const response = await authResponse;
  const payload = (await response.json().catch(() => null)) as {
    access_token?: string;
  } | null;
  if (!payload?.access_token) {
    throw new Error("Login failed: Supabase did not return an access token.");
  }

  try {
    await dashboardNavigation;
  } catch {
    if (!page.url().includes("/dashboard")) {
      await page.goto("/dashboard", { waitUntil: "load", timeout: 30_000 }).catch(
        (err) => {
          if (!page.url().includes("/dashboard")) throw err;
        }
      );
    }
  }

  if (page.url().includes("/login")) {
    throw new Error(
      "Login succeeded at Supabase but the app session was not established. Check PLAYWRIGHT_TEST_EMAIL / PLAYWRIGHT_TEST_PASSWORD match your Supabase user."
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
