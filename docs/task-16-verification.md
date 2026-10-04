# Task 16 verification evidence

4 October 2026. **Automated verification passed; configured Preview is available for device testing and public-beta release remains pending.** Tasks 01–15 are implemented. The user authorized shared-target migrations/dedicated test fixtures, commit/push to the existing codex branch, and Vercel Preview configuration. PR #20 must remain open: no merge/main/production release. Real Android/iPhone, real-user Auth and WhatsApp are the user's manual checks.

## Verified environment and data boundaries

Working checkout `/Users/kira/wed-pro`, branch `codex/royal-3d-loading-optimization`; Node 22.15.0/npm 10.9.2 on macOS. The final authenticated/public browser runs use a copied production build at `http://127.0.0.1:3102` with private provider configuration and an explicit matching site origin. The user's port 3000 is untouched. The isolated workspace uses `next build --webpack` because Turbopack refuses its external node_modules symlink; normal repository Turbopack production builds pass.

Supabase project `kbwkvbwdxstwsfgkpwbp` is the explicitly authorized **shared production/test** target. Two dedicated accounts are loaded privately from `.env.local`; neither test creates users, changes passwords nor deletes personal invitations. Guards require exact target confirmation and empty dedicated owners. The database suite serializes fixtures; browser tests clean up only UUIDs/public IDs they generated. All test-created PNG/WAV assets are disposable, with no personal uploads. Browser traces/authentication screenshots are disabled.

Five migrations were applied through Supabase MCP after inspecting history/schema/grants and preparing a preservation export:

1. `20261004060250_private_drafts_and_published_snapshots.sql`
2. `20261004060252_publish_readiness.sql`
3. `20261004060253_atomic_invitation_quota.sql`
4. `20261004060822_harden_timestamp_and_snapshot_index.sql`
5. `20261004061209_nonretryable_revision_conflicts.sql`

Repository versions match MCP-assigned history; applied SQL contents were not rewritten. Seven earlier migrations are also reconciled. Private pre-migration export `/private/tmp/wed-supabase-preservation-oVWAiP/pre-migration.json` has file mode 0600/directory 0700; it preserves invitation documents and prior schema metadata, **not a full Auth/disaster-recovery backup**. Original five invitations/three published snapshots retained their content/link digest `59a2b59969fbb8154da827b36603f5bf`; all three backfilled snapshots matched original content/slug/template. A later read after browser fixture cleanup again found five invitations, three public copies and zero dedicated-test invitations. Preserve private/public boundaries in additive fixes or compatible code rollback.

Cloudinary Admin authentication, both **signed** presets and actual **fixed-folder** owner/invitation paths are confirmed. Generated PNG/WAV uploads passed real app signing, direct upload and metadata completion. Existing media and provider presets were unchanged. Server credentials/presets/folder mode plus explicit canonical origin are now saved to **Vercel Preview only**. The public cloud/Supabase variables existed already. The new site variable briefly included Production during UI entry and was immediately corrected to Preview before any deployment; no production build/redeploy was triggered.

## Verification fixes

- Stale custom SQLSTATE 40001 caused a real PostgREST retry loop instead of a prompt conflict (18,180 repeated entries in the investigated window). The additive migration now uses PT409/HTTP 409, preserving function bodies/ownership/grants. Client reconciliation accepts PT409 and legacy 40001. Supabase documents this in its [retry-loop troubleshooting guide](https://supabase.com/docs/guides/troubleshooting/high-cpu-and-infinite-transaction-retries-when-using-custom-error-codes-in-rpc-functions-77326b).
- Hardened timestamp search_path, added the public-snapshot owner FK index and corrected profile-policy initplan findings. Intentional owner-authorized SECURITY DEFINER RPC warnings remain; leaked-password protection is disabled and needs human Auth review.
- Corrected React lifecycle/lint findings without disabling rules; navigation busy refs, recovery unmount guards, invitation-scoped validation/action state and stable lazy runtime component selection now pass.
- Updated Next.js/matching lint config to 16.3.8 and compatible security dependencies without force. Kept active shadcn CSS, Radix, Framer Motion, crop/audio consumers and immutable/uncertain legacy media.
- Upload JSON origin checks use HTTP Host authority rather than Next's internal localhost hostname. Bytes bypass Next; signing and completion retain authentication/ownership and bounded JSON requirements.
- Cinema SSR opener remains disabled until lazy runtime handlers hydrate; slow-chunk WebKit coverage now exercises this boundary rather than losing the first tap.
- Browser Back from a client-entered editor initially bypassed the late popstate guard. A root layout-effect dispatcher now registers before Next’s passive listener; the editor supplies/clears its active handler, preserving Next history state. All eight affected Back/internal-navigation cases pass after the fix across desktop/mobile Chrome/WebKit.
- Real mobile editor testing found min-content expansion from 320px to 486px, displacing fixed action/dialog controls. Explicit bounded mobile grid tracks fixed it. Unpublish is available on mobile; retry/remove targets are at least 44px.
- Shared field names reference only the visible label; errors/helpers are descriptions instead of silently changing field names. Audio file inputs now have unique labels/descriptions, error alerts and appropriate keyboard behavior.
- Removed the confirmed-unused unsigned-preset getter and unused CI test-user variables. Legacy provider settings remain for old deployment compatibility until an authorized production rollout.

Initial failed runs are not counted as passes. Mobile overlap failures were fixed and rerun. Audio tests initially matched Next's empty route-announcer alert; they now scope assertions to the editor. Private owner notFound() may return streamed HTTP 200 after headers start; tests assert the 404 boundary, no private content, and explicit upload 403. Public unpublish still asserts HTTP 404. Starter error coverage exposed changing accessible field names and was rerun after the label fix.

## Commands and results

| Command/check | Result and limits |
| --- | --- |
| `npm ci --no-audit --no-fund --fetch-retries=1 --fetch-timeout=20000` | Clean lockfile install passed, 711 packages; no forced upgrades. |
| `npm run lint`, `npm run typecheck`, `npm run build` | Pass on the current implementation; normal repository production build uses Turbopack. |
| `npm run validate:royal-3d-assets` | Pass: 483 frames, six decor, seven stills, three film/poster pairs. |
| `npm run test:contracts` | 20 passed: actual React queue drain/coalescing/duplicate prevention/edit-during-publication/failure/retry/route switch/navigation/discard/recovery; readiness/URL/date/share/upload/static boundary helpers. Controlled RPC responses are not database substitutes. |
| `node scripts/run-live-verification.mjs --allow-shared-target` | Five live two-owner database cases passed: RLS/private SELECT and forged/direct writes/RPC refusal, trusted publish validation, revision races/frozen snapshots/stable links, RLS-hidden slug collisions, concurrent total quota/idempotency. |
| `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3102 npm run test:e2e -- --workers=2 --output=/private/tmp/wed-final-public-results` | **185 passed**, no failed/skipped cases, 3.0 minutes after the history-boundary fix. Desktop/mobile Chrome, Firefox, desktop/mobile WebKit against the production build. |
| `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3102 node scripts/run-live-verification.mjs --allow-shared-target --browser` | **40 distinct authenticated cases pass across runs**: the combined run passed 38 and exposed two Chrome Back failures; after fixing the early dispatcher, all eight affected Back/internal-navigation cases passed (1.2 minutes). The remaining cases were not unnecessarily repeated. |
| Live diagnostic `node provider-check.cjs` in isolated private tooling | 11 groups passed: test login/creation/private boundaries/revision/quota plus upload auth/owner/declared-size/tampered-ticket and generated PNG/WAV signing/upload/completion. Generated fixtures removed. |
| `npm audit --omit=dev --json` | Zero production advisories. |
| `npm audit --json` | Nine high-severity development-tool packages remain in braces/micromatch/fast-glob and dependent ESLint/shadcn/ts-morph chains. No compatible complete remedy reported; no breaking downgrade/force used. |
| Impeccable source detector on edited fields/editor/uploads | No findings. Earlier global bounce warning was the reduced-motion rule disabling bounce, not an active animation. This is not a complete WCAG certification. |
| `git diff --check`, focused cleanup/consumer review | Passed; all templates/active upload/maps/focus dependencies/dynamic assets preserved. |
| GitHub Actions / fresh Vercel Preview | Commit `97e8f20`: [Actions run 37185528643](https://github.com/thisissuman/wed-pro/actions/runs/37185528643) passed; [Vercel deployment FqC5XKethh7wHxr94A8uwEDAxRDD](https://vercel.com/thisissumans-projects/wed-pro/FqC5XKethh7wHxr94A8uwEDAxRDD) Ready. Follow-up selection fix is gated by the same CI/Preview checks. |

Public coverage includes template loading/openers/preloads/skip/reveal/reduced motion, music targets, 320/360/1280px layouts, both studio themes, long-heading stress, Royal/Floral gallery keyboard/focus/Escape and immutable media/cache/range/no-auth-cookie behavior. Batched temporary screenshots were inspected without baseline snapshots. Cinema gallery remains its existing static grid. No claim of full visual/accessibility certification or hardware behavior.

Authenticated coverage includes real template selection, permissive private autosave/reload, owner preview versus public HTML/OG metadata, republish/unpublish/re-publish stable links, edits during delayed publish response, failed save internal navigation/reload recovery, cropped image/audio cancellation/failed confirmation/retry, actionable starter errors and second-owner private editor/preview/upload refusal. The Back case verifies cancel/discard/recovery clearing in each browser profile. Fixture media progress only completes after metadata confirmation.

## Readiness and remaining human/extended cases

**Configured Preview is available for device testing; not yet a public-beta production release.** The older main deployment still uses incompatible direct database writes/public working reads. Corrected source is on PR #20's branch; do not restore insecure database policies. Matching production code/configuration must be released later with explicit merge/deployment authorization.

Pending user checks:

1. On actual Android Chrome and iPhone Safari, use dedicated accounts/disposable invitations. Check all three designs, keyboard/action visibility, narrow widths, enlarged text/rotation, crop/dialog/gallery/scratch skip/reveal and tap-first music.
2. Exercise save/reload/publish/private edit/republish/unpublish and photo/audio cancellation/retry on the HTTPS preview. Record device/browser and failures. Vercel Preview protection may require authorized Vercel access; do not disable it automatically.
3. The user will check real-user signup/OAuth/recovery and redirect allowlists. Seeded dedicated-user password sessions do not prove those flows.
4. The human will check actual WhatsApp image/title/link/cache behavior on a publicly accessible disposable invitation after an authorized release. The agent has sent no messages or social shares.
5. Before public launch, rotate the Cloudinary secret: Vercel’s import briefly displayed it in one tool response in this private chat; it was masked thereafter and never written to Git. Credential rotation is a user action, not performed by the agent. Also review Cloudinary account storage/cost/rate limits and abandoned-media operations, old unsigned preset exposure, Supabase leaked-password protection and development-tool advisories. Signed presets do not enforce product byte ceilings before provider storage.

Extended cases remain unverified rather than blanket-passed: all legacy marker/normalization variants, above-cap existing-account fixtures, suffix exhaustion, browser termination/Forward/multiple tabs/storage failure, all media formats (including real HEIC/M4A)/actual oversized remote assets, Admin rate ceilings, 200% zoom/Indic content/full screen-reader matrix and constrained hardware performance. The longer checklist remains in pending-verification.md. No unavailable case is represented as a device/provider pass.

Use appropriate checks after changes; the implementation-only deferral is over. Keep the manual release gates open until their owner records evidence.

Preview access observation: the branch alias redirects unauthenticated HTTP clients to Vercel SSO (302). Preview protection is preserved. Device testing requires authorized Vercel access; WhatsApp/public-crawler behavior must be checked on a public origin after an authorized release. No protection bypass token was extracted or protection disabled.

## Preview handoff follow-up

Stable device-test URL: https://wed-pro-git-codex-royal-3d-loading-becb6f-thisissumans-projects.vercel.app/ . PR #20 remains open. HTTPS Chrome login, template selection, private editor load, return to Dashboard and sign-out passed. Initial inactive controls responded after hydration/fresh navigation; no persistent navigation defect was established. The exact generated invitation `ea9b8960-4991-412d-8cc2-222ba3cc6fd4` was removed; no media was uploaded/saved there. The HTTPS file-chooser upload remains unverified because the Chrome extension lacks “Allow access to file URLs”; protection/extension permissions were not changed. Local real-provider PNG/WAV upload/cancellation/recovery passes remain valid.

An anonymous selection on the immutable Preview exposed Supabase's normal AuthSessionMissingError being displayed as a creation failure. Template selection now redirects that specific missing-session case to login while retaining real auth/network errors. Added a real-browser regression: all five public profiles pass on the rebuilt normal Turbopack production server (`3103`); authenticated template creation still passes on that build. The existing 37 desktop public cases also passed on Turbopack before this small fix. Removed the remaining single-template empty-dashboard wording. Lint, typecheck and production build pass after these changes. Total distinct public scenarios now cover 190 profile cases across runs; the new five are explicitly separate from the previous 185-case combined run.

GitHub Actions emitted platform notices about action Node-runtime/Ubuntu runner transitions; app Node 22 and the actual job passed. These are operational notices, not product failures.

## Publish-checklist presentation follow-up

User clarified that the existing requirements should remain mandatory. The attempted optional-validation source/test edits were fully reverted and the unapplied migration removed; no database change occurred. Only the editor checklist presentation changed: compact warm-gold card, section labels, plain-language venue/RSVP messages, full-width field actions with visible focus, and shorter demo-content acknowledgement. Lint, TypeScript, all 20 existing contract tests and production build pass. The sandboxed build stalled and was stopped; the permitted unsandboxed production build passed. Live visual/device confirmation of this small presentation change remains pending; existing template designs, validation conditions and publication boundary are unchanged.

## Authorized production release

On 4 October 2026 the user reported the Preview looks good, then explicitly authorized production configuration, merging PR #20 and deployment. The user elected to retain the current Cloudinary secret despite the documented private tool-response exposure; no credential was rotated. Device/browser/Auth specifics were not supplied, so this acceptance is not represented as independently measured device coverage. Production WhatsApp behavior remains a human post-release check. Run appropriate checks after changes; retain the explicit extended-case/provider operational risks. No new migration or personal invitation/media operation is part of this release.
