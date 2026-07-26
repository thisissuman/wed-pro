import { expect, test } from "@playwright/test";

async function openInvitation(page: import("@playwright/test").Page) {
  const opener = page.getByRole("dialog");
  await expect(opener).toBeVisible();
  const seal = page.getByRole("button", {
    name: /open the wedding invitation/i,
  });
  await seal.focus();
  await expect(seal).toBeFocused();
  await seal.click();
  await expect(opener).toBeHidden();
}

test("registers the cinematic template and serves immutable versioned media", async ({
  page,
  request,
}) => {
  await page.goto("/template");
  await expect(
    page.getByRole("heading", { name: "Royal 3D Wedding Cinema" }),
  ).toBeVisible();

  const assetResponse = await request.get(
    "/media/royal-3d-cinema/v1/frames/low/f_001.webp",
  );
  expect(assetResponse.ok()).toBe(true);
  expect(assetResponse.headers()["content-type"]).toContain("image/webp");
  expect(assetResponse.headers()["cache-control"]).toContain("immutable");
});

test("renders both frame sequences, keeps the countdown visible, and avoids repeated ritual copy", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/media/royal-3d-cinema/")) {
      requests.push(request.url());
    }
  });

  await page.goto("/preview/royal-3d-cinema");
  await openInvitation(page);

  await expect(page.locator('[data-frame-sequence="181"]')).toHaveCount(1);
  await expect(page.locator('[data-frame-sequence="121"]')).toHaveCount(1);
  await expect(page.locator(".cinema-countdown__unit")).toHaveCount(4);
  await expect(page.locator(".cinema-film-band")).toHaveCount(2);
  await expect(page.getByText("Rahul Mehta").first()).toBeVisible();
  await expect(page.getByText("Ananya Sharma").first()).toBeVisible();
  await expect(
    page.getByRole("button", { name: /wedding music/i }),
  ).toHaveCount(1);

  await page.waitForTimeout(1_000);
  const initialLowFrames = new Set(
    requests.filter((url) => url.includes("/frames/low/f_")),
  );
  expect(initialLowFrames.size).toBeGreaterThanOrEqual(10);
  expect(initialLowFrames.size).toBeLessThanOrEqual(16);
  expect(requests.some((url) => url.includes("/frames/high/"))).toBe(false);
  expect(requests.some((url) => url.includes("/sacred/"))).toBe(false);
  expect(requests.some((url) => url.endsWith(".mp4"))).toBe(false);
  expect(requests.some((url) => url.toLowerCase().includes("world"))).toBe(
    false,
  );

  const sacredSequence = page.getByRole("region", {
    name: "Sacred wedding rituals in motion",
    exact: true,
  });
  await sacredSequence.scrollIntoViewIfNeeded();
  await expect(sacredSequence.locator("[data-sacred-stage]")).toBeVisible();
  await expect(
    sacredSequence.locator('img[src$="/decor/arch.webp"]'),
  ).toBeVisible();
  await expect(sacredSequence.getByText("Rahul Mehta")).toHaveCount(0);
  await expect(sacredSequence.getByText("Ananya Sharma")).toHaveCount(0);
  await expect(
    sacredSequence.getByText(/blessings of lord ganesha/i),
  ).toHaveCount(0);

  const framedMedia = sacredSequence.locator(".cinema-sacred__media");
  const framedMediaSize = await framedMedia.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
  expect(framedMediaSize.width).toBeLessThan(page.viewportSize()!.width * 0.6);
  expect(framedMediaSize.width / framedMediaSize.height).toBeCloseTo(0.75, 1);

  const finale = page.getByTestId("royal-cinema-finale");
  await finale.scrollIntoViewIfNeeded();
  await expect(finale).toBeVisible();
  await expect(finale).toContainText("Rahul Mehta");
  await expect(finale).toContainText("Ananya Sharma");
  await expect(page.locator('a[href*="/world"]')).toHaveCount(0);
});

test("keeps invitation controls usable at 320px without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/preview/royal-3d-cinema");
  await openInvitation(page);

  const hero = page.locator('[data-frame-sequence="181"]');
  await expect(hero).toBeVisible();
  await expect(
    page.getByRole("button", { name: /skip cinematic wedding introduction/i }),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("uses the preview panel width instead of the desktop browser width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/preview/royal-3d-cinema");
  await openInvitation(page);

  const renderer = page.locator(".template-renderer-shell");
  await renderer.evaluate((element) => {
    element.style.width = "390px";
  });

  const responsiveStyles = await page.evaluate(() => {
    const heroHeading = document.querySelector<HTMLElement>(".cinema-hero h1");
    const coupleGrid = document.querySelector<HTMLElement>(".cinema-couple__grid");
    const eventBody = document.querySelector<HTMLElement>(".cinema-event-card__body");
    const paperSection = document.querySelector<HTMLElement>(".cinema-countdown");

    return {
      heroFontSize: heroHeading
        ? Number.parseFloat(getComputedStyle(heroHeading).fontSize)
        : 0,
      coupleColumns: coupleGrid
        ? getComputedStyle(coupleGrid).gridTemplateColumns.split(" ").length
        : 0,
      eventColumns: eventBody
        ? getComputedStyle(eventBody).gridTemplateColumns.split(" ").length
        : 0,
      sectionPaddingTop: paperSection
        ? Number.parseFloat(getComputedStyle(paperSection).paddingTop)
        : 0,
    };
  });

  expect(responsiveStyles.heroFontSize).toBeLessThan(50);
  expect(responsiveStyles.coupleColumns).toBe(1);
  expect(responsiveStyles.eventColumns).toBe(1);
  expect(responsiveStyles.sectionPaddingTop).toBeLessThanOrEqual(80);
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("uses posters, exposes the blessing, and does not create autoplay video", async ({
    page,
  }) => {
    await page.goto("/preview/royal-3d-cinema");
    await openInvitation(page);

    await expect(page.locator(".cinema-sequence canvas")).toHaveCount(0);
    await expect(page.locator(".cinema-film-band video")).toHaveCount(0);

    const blessing = page.locator("#preview-section-blessing");
    await blessing.scrollIntoViewIfNeeded();
    await expect(blessing.getByText(/blessings of lord ganesha/i)).toBeVisible();
    await expect(
      blessing.getByRole("button", { name: /reveal without scratching/i }),
    ).toHaveCount(0);
  });
});

test("uses a gold scratch layer and lets guests reveal it without a gesture", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/preview/royal-3d-cinema");
  await openInvitation(page);

  const blessing = page.locator("#preview-section-blessing");
  await blessing.scrollIntoViewIfNeeded();
  const scratch = blessing.locator(".cinema-scratch");
  const canvas = scratch.locator("canvas");
  await expect(canvas).toBeVisible();

  const centerPixel = await canvas.evaluate((element: HTMLCanvasElement) => {
    const context = element.getContext("2d");
    if (!context) return null;
    const pixel = context.getImageData(
      Math.floor(element.width / 2),
      Math.floor(element.height / 2),
      1,
      1,
    ).data;
    return { red: pixel[0], green: pixel[1], blue: pixel[2], alpha: pixel[3] };
  });
  expect(centerPixel).not.toBeNull();
  expect(centerPixel!.red).toBeGreaterThan(centerPixel!.blue);
  expect(centerPixel!.green).toBeGreaterThan(centerPixel!.blue);
  expect(centerPixel!.alpha).toBe(255);

  await blessing
    .getByRole("button", { name: /reveal without scratching/i })
    .click();
  await expect(scratch).toHaveAttribute("data-revealed", "true");
  await expect(canvas).toHaveCSS("opacity", "0");
  await expect(blessing.getByText(/blessings of lord ganesha/i)).toBeVisible();
});

test("shows the opener only once per preview session", async ({ page }) => {
  await page.goto("/preview/royal-3d-cinema");
  await openInvitation(page);
  await page.reload();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
