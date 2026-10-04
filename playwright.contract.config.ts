import { defineConfig } from "@playwright/test";

// Pure contract tests: no browser, app server, provider or personal data.
export default defineConfig({
  testDir: "./tests/contracts", fullyParallel: false, workers: 1,
  reporter: "list", timeout: 10_000,
});
