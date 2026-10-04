import { defineConfig, devices } from "@playwright/test";

// Never run provider-backed editor tests implicitly as part of anonymous CI.
export default defineConfig({
  testDir: "./tests/live", workers: 1, fullyParallel: false,
  timeout: 90_000, expect: { timeout: 15_000 }, reporter: "list",
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, trace: "off", screenshot: "off" },
  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"], viewport: { width: 320, height: 740 } } },
    { name: "desktop-safari", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 13"], viewport: { width: 360, height: 780 } } },
  ],
});
