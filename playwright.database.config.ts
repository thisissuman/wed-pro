import { defineConfig } from "@playwright/test";
// Explicit disposable provider target required by the suite; never app env fallback.
export default defineConfig({ testDir: "./tests/database", workers: 1, fullyParallel: false,
  reporter: "list", timeout: 30_000 });
