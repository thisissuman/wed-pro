import { expect, test } from "@playwright/test";
import {
  validateHashtag,
  validateHttpsUrl,
  validateWeddingDate,
  validateWhatsAppNumber,
} from "../../src/lib/validate-editor";
import { sanitizePlainText } from "../../src/lib/sanitize-text";

test.describe("editor validation helpers", () => {
  test("sanitizePlainText strips HTML and scripts", () => {
    expect(sanitizePlainText('<script>alert("x")</script>Hello')).toBe("alert(\"x\")Hello");
    expect(sanitizePlainText("<b>Hi</b> there")).toBe("Hi there");
  });

  test("validateHashtag accepts valid tags and rejects junk", () => {
    expect(validateHashtag("#RahulWedsAnanya").ok).toBe(true);
    expect(validateHashtag("bad tag!").ok).toBe(false);
  });

  test("validateWhatsAppNumber enforces digit length", () => {
    expect(validateWhatsAppNumber("+919876543210").ok).toBe(true);
    expect(validateWhatsAppNumber("not-a-number").ok).toBe(false);
  });

  test("validateWeddingDate requires parseable date", () => {
    expect(validateWeddingDate("2026-12-01").ok).toBe(true);
    expect(validateWeddingDate("not-a-date").ok).toBe(false);
    expect(validateWeddingDate("").ok).toBe(false);
  });

  test("validateHttpsUrl accepts http(s) links", () => {
    expect(validateHttpsUrl("https://forms.gle/example").ok).toBe(true);
    expect(validateHttpsUrl("ftp://bad").ok).toBe(false);
  });
});

test("login page shows welcome heading for anonymous dashboard redirect", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  await expect(
    page.getByRole("heading", { level: 2, name: /welcome back/i })
  ).toBeVisible({ timeout: 15_000 });
});
