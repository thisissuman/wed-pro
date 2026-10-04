import { test, expect } from "@playwright/test";

// Public demos only. Provider-backed editor/lifecycle checks are a separate gate.
for (const template of ["royal", "floral-elegance", "royal-3d-cinema"]) {
  for (const width of [320, 360, 1280]) {
    for (const theme of ["light", "dark"]) {
      test(`${template}: ${width}px, ${theme} studio, reduced motion and gallery keyboard`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: width < 400 ? 800 : 900 });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.addInitScript(value => localStorage.setItem("theme", value), theme);
        const errors: string[] = [];
        page.on("pageerror", error => errors.push(error.message));
        await page.goto(`/preview/${template}`);
        const opener = page.getByRole("dialog");
        await expect(opener).toBeVisible();
        const seal = page.getByRole("button", { name: /open (the wedding )?invitation/i });
        await expect(seal).toBeEnabled();
        await seal.focus(); await expect(seal).toBeFocused(); await page.keyboard.press("Enter");
        await expect(opener).toHaveCount(0);
        await expect(page.getByText("Rahul Mehta").first()).toBeVisible();
        await expect(page.getByText("Ananya Sharma").first()).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
        const music = page.getByRole("button", { name: /^(play|pause)( wedding)? music$/i });
        await expect(music).toHaveCount(1);
        const musicSize = await music.boundingBox();
        expect(musicSize!.width).toBeGreaterThanOrEqual(43.5);
        expect(musicSize!.height).toBeGreaterThanOrEqual(43.5);
        for (const heading of await page.locator("h1").all()) await expect(heading).toHaveCSS("opacity", "1");
        // Synthetic long-copy stress on the actual heading styles, not a saved edit.
        await page.locator("h1").first().evaluate(element => {
          element.textContent = "Ananya Lakshmi Priyadarshini Sharma & Rahul Aditya Chandrashekhar Mehta";
        });
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
        if (template !== "royal-3d-cinema") {
        const photo = page.locator("#preview-section-gallery button").first();
        await photo.scrollIntoViewIfNeeded(); await photo.focus(); await page.keyboard.press("Enter");
        const gallery = page.getByRole("dialog");
        await expect(gallery).toBeVisible();
        await expect(gallery).toHaveAccessibleName(/gallery/i);
        for (let i = 0; i < 8; i++) {
          await page.keyboard.press("Tab");
          expect(await gallery.evaluate(element => element.contains(document.activeElement))).toBe(true);
        }
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("Escape");
        await expect(gallery).toBeHidden(); await expect(photo).toBeFocused();
        }
        expect(errors).toEqual([]);
        if ((width === 360 && theme === "dark") || (width === 1280 && theme === "light")) {
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.screenshot({ path: testInfo.outputPath("template-layout.png"), fullPage: false });
        }
      });
    }
  }
}

test("marketing hierarchy, static media boundaries and unauthorized upload", async ({ page, request }) => {
  for (const route of ["/", "/template"]) {
    await page.goto(route); await expect(page.locator("h1")).toHaveCount(1);
  }
  for (const route of ["/dashboard/media/photo.mp4", "/dashboard/invitations/preview.png/edit"]) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(307); expect(response.headers().location).toContain("/login");
  }
  const frame = await request.get("/media/royal-3d-cinema/v1/frames/low/f_001.webp");
  expect(frame.status()).toBe(200); expect(frame.headers()["set-cookie"]).toBeUndefined();
  expect(frame.headers()["cache-control"]).toContain("immutable");
  const ranged = await request.get("/media/royal-3d-cinema/v1/films/film1.mp4", { headers: { Range: "bytes=0-99" } });
  expect(ranged.status()).toBe(206); expect(ranged.headers()["content-range"]).toMatch(/^bytes 0-99\//);
  expect(ranged.headers()["set-cookie"]).toBeUndefined();
  for (const endpoint of ["upload", "complete"]) {
    const response = await request.post(`/api/cloudinary/${endpoint}`, { data: {}, headers: { Origin: new URL(process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000").origin } });
    expect(response.status()).toBe(401);
  }
});
