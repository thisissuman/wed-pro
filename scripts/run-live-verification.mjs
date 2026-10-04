import nextEnv from "@next/env";
import { spawnSync } from "node:child_process";

// Explicit opt-in is required for the user's shared production/test project.
nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const args = process.argv.slice(2);
const shared = args.includes("--allow-shared-target");
const suite = args.includes("--browser") ? "browser" : "database";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url || !process.env.TEST_EMAIL_2 || !process.env.TEST_PASSWORD_2) {
  throw new Error("Configure the Supabase target and both dedicated test accounts privately.");
}
if (new URL(url).hostname === "kbwkvbwdxstwsfgkpwbp.supabase.co" && !shared) {
  throw new Error("Shared target requires explicit --allow-shared-target authorization.");
}
const env = {
  ...process.env,
  WED_TEST_SUPABASE_URL: url,
  WED_TEST_DISPOSABLE_TARGET: url,
  WED_TEST_ALLOW_SHARED_TARGET: shared ? url : "",
  WED_TEST_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  WED_TEST_OWNER_A_EMAIL: process.env.TEST_EMAIL,
  WED_TEST_OWNER_A_PASSWORD: process.env.TEST_PASSWORD,
  WED_TEST_OWNER_B_EMAIL: process.env.TEST_EMAIL_2,
  WED_TEST_OWNER_B_PASSWORD: process.env.TEST_PASSWORD_2,
};
const forwarded = args.filter(arg => !["--allow-shared-target", "--browser"].includes(arg));
const result = spawnSync(process.execPath, ["node_modules/@playwright/test/cli.js", "test",
  `--config=playwright.${suite === "browser" ? "live" : "database"}.config.ts`, ...forwarded], {
  env, stdio: "inherit",
});
process.exit(result.status ?? 1);
