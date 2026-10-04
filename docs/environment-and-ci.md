# Environment and CI instructions

Task 16 is explicitly underway. Local commands/results and remaining prerequisites are recorded in [verification evidence](task-16-verification.md). Shared-target migration history, signed Cloudinary configuration and generated provider fixtures are confirmed. Preview configuration is saved; its HTTPS runtime verification is pending the branch release. Never paste credentials into documentation/tool output.

## Environment ownership

Use Node 22/npm to match checked-in CI and package-lock.json. The updated lockfile passed a clean installation during task 16. Do not force upgrades or bypass dependency errors.

Copy `.env.example` to a gitignored `.env.local` during authorized setup and replace placeholders. Maintain separate disposable verification and production environments.

| Setting | Purpose / confirmation still needed |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY | Public project origin/key; actual verification project, RLS/migration state and Auth configuration |
| NEXT_PUBLIC_SITE_URL | Explicit browser/server canonical HTTP(S) origin; localhost for local work, actual deployed origin for public sharing |
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME | Public product environment name |
| CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET | Server-only credentials with upload signing and Admin resource-read permission |
| CLOUDINARY_IMAGE_UPLOAD_PRESET, CLOUDINARY_AUDIO_UPLOAD_PRESET | Separate signed presets, correct formats and compatible ID/folder/transforms |
| CLOUDINARY_FOLDER_MODE | Confirm actual fixed/dynamic mode; do not assume the example is configured |
| PLAYWRIGHT_BASE_URL | Optional already-running disposable server; otherwise Playwright manages production build/start locally |
| TEST_EMAIL/TEST_PASSWORD, TEST_EMAIL_2/TEST_PASSWORD_2 | Private dedicated accounts consumed by scripts/run-live-verification.mjs; never forwarded to Vercel or public CI |

No service-role key is required by the browser/app flow. Administrative credentials, if needed for authorized database fixtures, belong only in isolated test tooling/server environments and must not be NEXT_PUBLIC variables. Cloudinary preset signing does not give a per-preset product byte ceiling; confirm account limits/cost controls and unused-upload/rate operations separately. See [provider constraints](cloudinary-uploads.md).

getSiteUrl uses NEXT_PUBLIC_SITE_URL, then server-only VERCEL_URL, then localhost fallback. Production fallback is not a usable invitation domain; explicitly set NEXT_PUBLIC_SITE_URL for matching share links/metadata in both runtimes. Confirm Supabase site/redirect allowlists for login/OAuth/recovery on the actual local/staging/production origins, along with outbound media/CORS/CSP support. Signed presets/folder mode and provider metadata reads were inspected. Real-user OAuth/recovery redirect allowlists remain a human check.

## Commands for task 16

| Command | Meaning and limits |
| --- | --- |
| `npm ci` | Reinstall the exact checked-in dependency graph; diagnose lock/peer failures without force |
| `npm run dev` | Start the development app; not a readiness check |
| `npm run typecheck` | Check TypeScript without creating application output |
| `npm run lint` | Run configured source lint rules |
| `npm run validate:royal-3d-assets` | Run the existing complete immutable v1 archive validator |
| `npm run build` | Build the production app; requires appropriate configured build origins |
| `npm run start` | Serve a previously built app |
| `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install --with-deps chromium` | Install browser/runtime dependencies matching the script/CI browser location |
| `npm run test:e2e -- --project=mobile-chrome` | Run current mobile Chromium specs; it is not full device/database/provider coverage |
| `npm run test:e2e` | Run all configured projects; requires Chromium/Firefox/WebKit installed with the same browser location |
| `npm run db:status` | Read migration history of the CLI's **linked** project; confirm target before use |
| `npm run db:push` | Applies pending migrations to the CLI's **linked** project; a write operation requiring separately established authorization/target, never a routine check |

Run `npm run test:contracts` for pure contracts and the actual React write pipeline using disposable JSDOM fixtures. Run `npm run test:database` only after the dedicated target/account requirements below are satisfied. Existing Playwright configuration has mobile/desktop Chromium, desktop Firefox, desktop Safari and mobile Safari projects. Local default webServer builds/starts; CI expects its preceding production build. PLAYWRIGHT_BASE_URL bypasses managed server startup, so an existing server can mask stale code: explicitly confirm the server under test then. Install Firefox/WebKit too before running those projects; real devices are still required for device-specific cases.

## Checked-in CI versus unimplemented coverage

`.github/workflows/ci.yml` triggers on pull requests and pushes to main. The checked-in job uses Node 22, npm ci, Chromium installation, lint, an explicit typecheck, Royal asset validation, contract tests, production build and mobile-chrome Playwright. The authorized branch push will trigger these gates; record their results in the evidence. Database/RLS/quota, Cloudinary, all browser projects and real devices remain separate gates.

The workflow reads GitHub Actions Supabase/site secrets; obsolete unused test-user variables were removed. Missing Supabase secrets use harmless placeholders for the existing build/anonymous smoke paths; missing site URL defaults to http://127.0.0.1:3000. These defaults do not exercise authenticated access or confirm backend/provider configuration. Public browser tests are free-beta.spec.ts, editor-validation.spec.ts, royal-3d-cinema.spec.ts and ui-contracts.spec.ts. tests/live/editor-provider.spec.ts uses real dedicated-user session cookies for editor lifecycle, failure/recovery, delayed publication and cropped-image/audio cancellation/retry. It is an explicit live gate, separate from anonymous CI. Never delete personal invitations to make room.

The user accepted the Preview and authorized Production Cloudinary/site settings, merging PR #20 and the matching main release on 4 October 2026. Do not expose private test credentials in CI/provider settings.


## Disposable database suite

`npm run test:database` uses playwright.database.config.ts and WED_TEST_* inputs. The known shared project is refused unless both WED_TEST_DISPOSABLE_TARGET and WED_TEST_ALLOW_SHARED_TARGET exactly match its URL. Two distinct empty dedicated owners are required; the suite deletes only generated UUIDs, never creates users/changes passwords/applies migrations. The five-case suite has passed on the explicitly authorized shared target.

The private runner maps TEST_EMAIL/TEST_PASSWORD and TEST_EMAIL_2/TEST_PASSWORD_2 from gitignored .env.local without displaying them:

- `node scripts/run-live-verification.mjs --allow-shared-target`: database boundary suite. The flag acknowledges the specific shared project, not authorization for arbitrary production writes.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3102 node scripts/run-live-verification.mjs --allow-shared-target --browser`: explicit production-server authenticated browser suite. Never run against a stale/development build by accident.
- Add `--project=mobile-chrome` or another project when rerunning affected cases. Live profiles use 320px mobile Chrome, 360px mobile WebKit, desktop Chrome and desktop WebKit, one worker. Traces/screenshots are off to avoid recording authentication material.

The runner loads app credentials privately but never infers permission from them; use only the user-designated test accounts/environment. Generated PNG/WAV fixtures and generated public IDs are cleaned up after each live browser case. A failed/aborted run must reconcile generated IDs before any restart; no broad owner cleanup. Real devices and broader format/legacy/provider operational cases remain separate.

## Browser runtime location

Playwright scripts now respect PLAYWRIGHT_BROWSERS_PATH rather than overwriting it. A local `npx playwright install chromium firefox webkit` uses the normal user cache; `npm run test:e2e` uses that same cache unless the variable is set. CI explicitly sets PLAYWRIGHT_BROWSERS_PATH=0 for its package-local Chromium installation. Do not install into one location and run from another. Tests can use PLAYWRIGHT_BASE_URL for an already-running production build; task 16 used port 3100 with harmless Supabase placeholders, leaving the user's port 3000 untouched.
