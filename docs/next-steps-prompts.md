# Wedding invitation project — copy-paste work prompts

Created 4 October 2026. Run these tasks in order. Copy one entire fenced prompt into the chat, finish it, then move to the next. The last prompt is the only verification/testing stage.

## Workflow agreed with the user

Tasks 01–15 are implementation only. Source reading and targeted reference searches needed to understand/edit code are allowed. Do **not** run lint, type checks, builds, unit/integration/E2E tests, asset validators, security scanners, UI detectors, Lighthouse, browser checks, screenshots, manual QA, upload probes, migration checks, or CI after each task. Do not auto-commit/push or disable existing CI/hooks to evade them. Test authoring and consolidated execution happen in task 16; existing test source may be adjusted when an implementation changes its contract, without executing it.

Writing migrations is allowed; applying migrations and exercising them is deferred. Dependency and lockfile changes are allowed as implementation, but installation verification is deferred. Keep an honest pending-verification list: “implemented, verification deferred” is not “tested” or “ready.” Each task's prompt repeats this instruction so it works in a fresh chat.

Keep the current three templates and Free Beta scope. No new templates, payments, guest-management feature, or broad redesign are needed in this roadmap. No deletion of existing user invitations or remote assets is authorized by these prompts.

If earlier changes already resolve a task, explain that from the source and update its implementation status without running checks. If a task needs missing credentials or a product decision, complete independent work, explain the dependency, and leave that item open. Do not claim completion while essential work is blocked.

## Progress tracker

Checkmarks below mean implementation completed, with verification deferred. Tasks 01–15 are implemented. Task 16 assessment and the authorized production release are complete with recorded coverage limits; evidence and remaining follow-ups are recorded in [task 16 evidence](task-16-verification.md). Remaining tasks stay unchecked until implementation is complete.

- [x] 01. Separate private edits from published invitations
- [x] 02. Coordinate autosave, publish, and unpublish writes
- [x] 03. Keep invitation links stable and handle slug collisions
- [x] 04. Protect unsaved edits and recover from save failures
- [x] 05. Add a clear publish-readiness check
- [x] 06. Fix uploads for Vercel and Cloudinary
- [x] 07. Enforce the beta invitation limit atomically
- [x] 08. Make dialogs, lightboxes, and selects accessible
- [x] 09. Make social-preview images match published metadata
- [x] 10. Load only the selected template runtime
- [x] 11. Keep static media out of authentication refresh
- [x] 12. Make marketing copy match the shipped product
- [x] 13. Polish mobile controls, motion, themes, and demo content
- [x] 14. Remove confirmed unused files, assets, and dependencies
- [x] 15. Refresh project documentation and prepare deferred verification
- [x] 16. Run checks/tests, fix failures, and assess beta readiness (recorded limits and human follow-ups remain)

## Task 16 current state

Task 16 is active. Static/contracts/assets, 185 public cases and the five-case two-owner database suite pass. Authenticated production-build browser cases and a configured HTTPS branch preview are being finalized; exact evidence and remaining manual/extended cases are in [task 16 evidence](task-16-verification.md). User-authorized commit/push/Preview release is allowed, with PR #20 merge kept pending. Real devices/WhatsApp/real-user Auth remain human checks; do not mark full public-beta readiness yet.

## Deferred verification notes

Use this section to record scenarios, migration/configuration prerequisites, retained cleanup candidates, missing inputs, and unresolved requirements as each task finishes. Do not paste credentials or private invitation data here.

### Task 16 live status (supersedes historical deferrals below)

Five migrations are applied under explicit shared-target authorization: snapshots → readiness → quota → hardening/index/profile policies → PT409 conflicts. Repository versions match live MCP history without changing applied SQL. Five original invitations/three public copies retain their content/link digest. Two-owner database tests pass isolation, trusted publish/revision/snapshot rules, hidden collisions and concurrent quota. Generated PNG/WAV uploads and private provider fixtures are cleaned up. Authenticated Chrome/WebKit production-build verification and Preview release are underway. Preserve legacy immutable assets and personal invitations.

Old direct-write/public-draft clients remain incompatible with the migrated schema. Use the new branch Preview for device testing; do not restore insecure policies for the old production app. A matching production merge/configuration is explicitly pending. Leaked-password protection and provider operational limits need human review. Historical task prompts below preserve the implementation-only instruction as history; it is lifted for current verification work.

- Initial baseline: the October 3 review passed TypeScript, production build, Royal 3D asset validation, and 17 production mobile tests; lint had five warnings. These results do not validate later changes.
- Live RLS/migration state, deployment/Cloudinary configuration, real devices, and production WhatsApp behavior were not verified in that review.
- Development-server Royal 3D opener failures were observed; production tests/manual localhost interaction passed. Investigate the development difference in task 16.

### Tasks 01–03: implemented; verification deferred

Contract and rollout details: [invitation-persistence.md](invitation-persistence.md).

- Pending migration: `20261004060250_private_drafts_and_published_snapshots.sql`. Not applied. New client depends on it; old clients with direct UPDATE become incompatible. Establish actual migration history, policies/grants, triggers, dependent views/RPCs, schema-cache refresh, and backup/recovery in a separately authorized final rollout. No public fallback to private working rows is acceptable.
- Backfill cases: preserve published JSONB byte-for-byte in storage, existing slugs/suffixes, all three templates, legacy template-ID remap, and currently unpublished historical links identifiable from publication markers. Identify history with both markers erased before rollout; automatic reconstruction is impossible. Old autosave's already-public edits cannot be retrospectively separated.
- Authorization cases: anonymous and other-owner direct SELECT/SELECT * of working content; forged lifecycle/revision INSERT; direct UPDATE; writes to snapshots; anonymous/non-owner RPC calls; helper execution; stale revision and concurrent-tab conflicts; no dependent boundary leaks private data.
- Lifecycle cases: initial publish, private edit after publication, matching guest page/metadata snapshot, owner preview of working edits, Republish, Unpublish without content loss, public 404, re-publish with original link, and owner deletion cascading public-copy removal.
- Delayed-response cases: click Publish before debounce fires; Publish/Unpublish during an active autosave; edits while saving and while publication is pending; successful publication followed by failed private save; duplicate desktop/mobile taps; explicit private-save retry; returned errors, thrown errors, timeout with possible server commit; rapid invitation change/unmount; stale dashboard and concurrent tabs. Controls must unlock and older acknowledgements must not overwrite newer fields or another editor.
- Link cases: hidden other-owner draft collision; simultaneous first publications for identical names; existing -2 suffix; retry exhaustion; long-name truncation and suffix limits; draft INSERT collisions; names changed before/after first publication; copy/share UI after suffix allocation; legacy links after Unpublish/re-publish.
- Tasks 04–05 now implement navigation/recovery and trusted publish readiness; see the later notes. No tests were authored or executed for tasks 01–03.

### Tasks 04–06: implemented; verification deferred

Contracts: [editor safety](editor-safety.md), [Cloudinary uploads](cloudinary-uploads.md).

- New migration prerequisite: `20261004060252_publish_readiness.sql`, after `20261004060250_private_drafts_and_published_snapshots.sql`. Both remain unapplied. Check TypeScript/database rule parity and direct authenticated RPC enforcement in the authorized final stage.
- Navigation cases: type then immediately Dashboard/another invitation; internal links and keyboard activation; Back/Forward including repeated attempts, cancellation, restored-entry history, cross-document traversal, hashes, new-tab/modified clicks; save/discard/cancel during debounce, active save, failed save, and publication; leave after a no-edit publication error; route/unmount changes and any future programmatic navigation. Discard affects unsent edits and cannot undo a sent request.
- Recovery cases: reload/close/mobile termination; storage quota/disabled storage; same-owner/invitation scoping; malformed/expired copies; same and stale server revisions; explicit restore using authoritative status/slug/revision; keep-server/discard/completed-save cleanup; explicit sign-out/account changes and late responses; multiple tabs sharing a recovery key; no preview/crop/UI state persisted. Recovery is device-local, unencrypted, best effort, and expires after seven days.
- Readiness cases: known starter names/venues, whitespace, long/non-Latin names; real vs impossible calendar dates, legacy ISO/event/countdown fallback and past invitations; event title/time/venue; address/map/coordinate alternatives; RSVP shown/hidden, whitespace/hyphens and old form mode; missing optional story/photos; sample descriptions/stock URLs and acknowledgement; invalid protocols/credential-bearing/control/relative URLs including hidden sections; structured server errors, matching field errors, mobile step/desktop accordion opening; safe old-snapshot rendering without JSONB destruction.
- Upload configuration dependency (not inspected): actual cloud name plus server-only `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_IMAGE_UPLOAD_PRESET`, `CLOUDINARY_AUDIO_UPLOAD_PRESET`, and `CLOUDINARY_FOLDER_MODE` fixed/dynamic. Presets must be signed and support the signed IDs/folders/formats. Admin resource lookup permission/rate limits, CORS/CSP, Vercel environment/origin, provider/account ceilings, and old exposed unsigned presets require review. No credentials were invented or live settings changed.
- Upload cases: auth/non-owner/sign-out, arbitrary folders/slots, declared and actual byte boundaries, MIME/format mismatch and audio-only/M4A metadata; signed-parameter/ticket tampering, replay/excluded resource-type switching, expiry; large files bypassing declared size (must be rejected at attachment); cropped hero/portraits/gallery, audio replacement and preserved existing URLs; progress/metadata completion, duplicate clicks, network/malformed response/timeout/Admin errors, cancellation at every phase, dialog close/unmount, ignored late responses; local crop failure and HEIC decoding. Use disposable fixtures only after authorization.
- Provider limitation: Cloudinary presets have no per-preset byte ceiling; product size limits reject attachment after an authenticated actual-byte lookup. Altered/cancelled requests may leave stored remote assets and incur account cost. Establish account-level limits and unused-upload/rate-limit operations before beta; this task does not delete assets or modify settings. Completion uses an Admin API read per upload.
- No checks, test authoring/execution, browser activity, migration application/verification, upload/configuration probes, deployment, commit, or push occurred for tasks 04–06. The next task at completion of 04–06 was 07.

### Tasks 07–10 implementation and deferred prerequisites

- Quota: authored, unapplied `20261004060253_atomic_invitation_quota.sql`, after snapshot/readiness migrations. Creation is an owner-profile-serialized RPC; table/column INSERT is revoked. Counts total drafts + published working rows; retains accounts above cap. Old direct-insert clients need coordinated rollout. Final-stage cases: same-owner simultaneous creation at 0/2/3, independent owners, above-cap accounts, deletion races, idempotent uncertain-response retries, hidden slug collisions, direct/anonymous/spoofed-owner access, missing profiles, rollback/timeouts, all templates and legacy mapping. Reconcile actual roles/grants/functions/views/triggers, REST isolation, and schema-cache exposure then. See [quota contract](invitation-quota.md).
- Accessibility: shared installed Radix modal boundary, native selects, linked helper/errors, keyboard gallery navigation/openers and focus restoration. No dependency removal or design rewrite. Final-stage cases: Tab/Shift+Tab, initial/return focus and removed triggers, nested topmost Escape, rapid close/reopen, mobile preview/gallery/crop/navigation nesting, background touch/screen-reader isolation, scroll restoration, zoom/theme inheritance, crop arrows/zoom/cancel, drag/buttons, narrow screens, all openers/session/bypass/reduced-motion. UI-skill detectors/screenshots and a11y/browser/manual checks remain deferred. See [overlay contract](accessible-overlays.md).
- Sharing: one OG → WhatsApp image → hero → no-image resolver; existing explicit choices remain, hero no longer overwrites OG. Working preview requires Publish/Republish; public metadata stays on the published copy. Configure valid NEXT_PUBLIC_SITE_URL for matching browser/server production origins; server-only VERCEL_URL alone is insufficient. Final-stage cases: URL protocols/credentials/control/local paths, all precedence combinations, old choices and hero replacement/removal, Cloudinary transformation chains/versions/crops, external images, working versus published/failed publication/unpublish, canonical links and production WhatsApp cache behavior. No links shared or metadata tools called.
- Runtime: metadata-only registry plus typed SSR-enabled lazy loaders and centralized legacy mapping. Final-stage cases: production build, marketing import graph and bundles/chunks, selected-template loading and server HTML/streaming for all three designs/legacy IDs, CSS/theme/zoom, preview-section scrolling, editor/mobile template switching, slow chunks and failure/reload. No builds, measurements, browser checks, or Lighthouse ran. See [sharing/runtime contract](sharing-and-template-loading.md).
- Tasks 07–10: implemented; verification deferred. No tests authored/run, no checks, migrations applied/verified, deployment, commit, push, or CI changes. The next task at completion of 07–10 was 11.

### Tasks 11–12: implemented; verification deferred

- Contract: [session routing and beta copy](session-routing-and-product-copy.md). Static namespaces/files are explicit in the matcher and reusable early-return guard; no arbitrary extension exemptions. Dashboard boundary is exact root/slash descendants; OAuth/recovery/cookie redirects and upload/database authorization stay intact. Versioned cache headers and Next media/range serving are preserved.
- Task 16 routing cases: matcher/helper parity; dashboard and lookalike roots, nested media names and suffix IDs; encoded/normalized paths, queries/trailing slashes; OAuth/recovery and safe login next/cookies; upload auth/owner isolation; static requests with/without cookies/config; MP3/MP4/frame/decor/root image GET/HEAD/range/conditional serving and content/range/cache headers, absent auth Set-Cookie. No HTTP probes or live-session inspection performed.
- Copy: Free Beta, three actual designs, three total invitations including published, private edits/republishing, and WhatsApp/external RSVP without tracking. Removed unsupported five-star/customer quotes and Bestseller claim; story cards now carry labelled illustrative examples. Removed unsupported supplier price/delivery benchmarks, environmental estimates, unlimited-access and bespoke-service promises. Support email/design/template flows preserved.
- Human evidence needed before future testimonial/customer/rating/adoption/Bestseller/environmental/supplier/service claims: authentic source, accuracy, applicable permission and product capability. No factual input is required to keep the unsupported claims absent. Task 13 now implements decorative marquee pause/reduced-motion behavior; its cases remain deferred. Task 16 owns copy/CTA/anchor/mobile and support-link QA.
- No checks/testing/test authoring, probes, live sessions, migrations applied, deployments, commits, pushes or CI changes. Next implementation task is 13.

### Task 13: implemented; verification deferred

- Contract: [mobile, motion, themes and demos](mobile-motion-theme-and-demos.md). Marketing h1/section hierarchy, 44px navigation/dialog/editor/template actions (zoom compensated), scrollable progress hit areas, wrapping names/status/errors, bounded hero content and 16px mobile fields. Editor action bar uses a focused-field VisualViewport keyboard inset with normal viewport fallback.
- Real Framer marquee pause/play, hover/focus pause and static reduced-motion wrapping examples; repeated cards hidden from assistive technology. Root reduced-motion preference, static blur/parallax/tilt, native reduced-motion cursor, immediate shared opener interaction and reduced decorative CSS effects. Existing template particle/poster/frame/skip/reveal and tap-first music interactions preserved.
- Studio colors stay outside `.template-theme`/`.on-image`; templates own tokens/legacy aliases and hero photo text has separate light tokens. Marketing photo captions retain contrast on studio mode changes. Shared server-supplied +90-day demo calculator/factory replaces February 2026 wedding dates; saved real dates do not advance. Explicit timezone/date labels avoid host-timezone differences; unfinished dates have safe display fallback. No existing date-dependent test assertion needed adjustment; new tests wait for task 16.
- Task 16 mobile cases: narrow screens/zoom/Indic and long content, actual 44px hit areas including typography scales, progress scroll/focus, errors, all editor steps, sticky/safe-area controls, nested crop/share/gallery/mobile previews, iOS/Android keyboard/toolbar/rotation/pinch, VisualViewport unavailable, preview containment and heading hierarchy. The keyboard coverage threshold and scrolling need device confirmation.
- Task 16 motion/theme cases: actual pause/resume, hover/focus/explicit pause combinations, loop seam/resize/cleanup, runtime preference changes/first paint/static cards, native cursor/text legibility, all openers/skip/reveal/poster/frame alternatives, audio play/pause; studio modes versus guest/editor template palettes/images/overlays/scales, marketing image captions and user-image contrast.
- Task 16 date cases: controlled reference/timezone/UTC-midnight/year/month/leap-day rollover, hourly homepage cache/request preview freshness, server HTML/hydration/countdowns, consistent events, starter persistence, missing/invalid dates/timezones, preserved past/real user dates through edit/reload/publish. No new migration/config dependencies; carry earlier prerequisites forward.
- Impeccable polish guidance applied using source; detectors, screenshots and visual/browser/device QA deferred explicitly. No checks/tests/test authoring, probes, migrations applied, deployment, commit, push or CI changes. Next implementation task is 14.

### Task 14: implemented; verification deferred

- Inventory and reasoning: [cleanup decisions](cleanup-decisions.md). Deleted the ten unused component candidates plus the unrendered SavingsCalculatorSheet and unreachable WeddingStyleQuiz. Removed DigitalVsPhysical calculator state/import and unused ArrowRight, and FinalCTA's permanently closed quiz state/mount/import and unused ArrowRight. No reachable feature/design flow changed; existing recommended template link/session handling remains.
- Removed five unused starter SVGs: file/globe/next/vercel/window. Retained their exact static session exemptions for legacy missing-file requests, without broadening route exemptions.
- Removed unused direct class-variance-authority, motion and next-cloudinary dependencies and their exclusive lock entries. Kept framer-motion, shared motion dependencies, radix-ui (active ModalSurface Dialog), and other existing app/tool dependencies and versions. Both package files edited; no installation, re-resolution, force upgrades or audits.
- Retained uncertain public/tap-to-open photos (dooropen.jpg, videoframe_5491.png, videoframe_9508.png): stored JSONB or older deployed clients may refer to these public wedding-media URLs; no live/history inspection performed.
- Retained all immutable Royal 3D v1 assets, including current-unused film2/poster, umbrella and declared stills, with archive-boundary comments in manifest/validator. Current runtime uses film indexes 0/2, dynamic numbered frames, sanctum_start poster, venue fallback and active arch/diya/elephant/lotus/toran decor. Manifest positions, validator counts/lists/behavior and cache headers remain unchanged. Retirement requires historical-deployment/saved-content evidence; prefer a new version namespace for future slimming.
- Preserved GlobalLovePointer, authenticated crop/audio uploads, InvitationOpener, both WeddingDateScratchReveal components, coordinate schema/map helpers, all three template folders, default music, migrations, tests, docs and .env.example. No remote media deleted.
- Task 16: clean lockfile-based installation (current node_modules intentionally untouched), imports/types/lint/build/runtime/peer dependencies, all template/editor/marketing/upload/accessibility paths, asset validator/dynamic files/posters/decor/cache/range, and legacy static URL serving. Diagnose failures without forced upgrades. Historical asset retirement remains a separately authorized evidence-dependent decision.
- No checks/testing/test authoring, asset validation, install validation/audit, probes, migration application, deployment, commit, push or CI changes. Next implementation task is 15.

### Task 15: implemented; verification deferred

- Refreshed concise root operating memory, README, canonical context, schema/access/migration reference, security/mobile runbooks and environment/CI instructions. Detailed contracts remain linked; stale single-template/May status, direct INSERT and nonexistent authenticated spec instructions removed. .env.example clarifies explicit canonical origin, actual provider mode and future disposable test fixtures. CI comments corrected without changing triggers/steps or running CI.
- Consolidated [pending verification](pending-verification.md) includes every task's lifecycle/RLS/queue/links/navigation/recovery/readiness/upload/quota/accessibility/metadata/runtime/routing/copy/mobile/motion/theme/date/cleanup cases, skipped UI-skill verification, retained media and missing test/device/provider coverage. [Environment and CI](environment-and-ci.md) distinguishes implemented gates from absent backend/type/asset/full-browser/device gates and actual remaining spec files.
- All three October migrations remain authored/unapplied/unverified; order is snapshot → readiness → quota after reconciled earlier history, authorized nonproduction target and backup/link inventory. Verify there before proposing separately authorized coordinated production schema/client rollout; drain incompatible clients and preserve both copies/privacy on rollback.
- Actual Supabase project/Auth/redirect settings, disposable owners, Cloudinary credentials/signed presets/folder mode/Admin permission/account cost/rate operations/CORS/CSP, staging origin/deployment, GitHub settings and real devices remain unconfirmed. Setting CI secrets alone does not supply nonexistent authenticated lifecycle coverage. Clean installation after task 14 is pending.
- No checks/test authoring/execution, browser/manual QA, probes, live configuration inspection, migration application/verification, CI trigger, deployment, commit or push. Next is task 16, which must be explicitly started; do not lift deferral or claim readiness merely because documentation is complete.

## Prompts

### 01. Separate private edits from published invitations

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 01: Separate private edits from published invitations.

Implement a private working-draft and published-snapshot model. Currently autosave changes the same content guests read, so edits are visible before Republish.

Read InvitationEditor.tsx, the editor store, invitation normalization, publish helpers, owner preview routes, public /w/[slug] loading/metadata, and existing migrations. Make autosave update only working content. Publish/Republish should atomically promote the latest working content to the public snapshot. Guests and public metadata must use the same published snapshot; owner previews must use the working content. Unpublish must remove public access without losing edits.

Preserve existing published invitations, existing JSONB content, and all three templates. Author any required additive migration and safe backfill in supabase/migrations, but do not apply it yet. Define access rules so private working content cannot be read by anonymous users or other owners, even through direct Supabase queries. A new column on a publicly selectable row alone does not make its data private; use appropriate table/view/RPC boundaries and grants. Do not expose private data merely by hiding it in the React UI.

Keep the design as small as practical. Update schema/architecture documentation and record migration prerequisites for the final stage. Do not add payments, guest storage, or unrelated features.
```

### 02. Coordinate autosave, publish, and unpublish writes

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 02: Coordinate autosave, publish, and unpublish writes.

Fix write coordination in InvitationEditor.tsx, the store, publish helpers, and any server/database boundaries added by task 01.

Use one coordinated write pipeline for autosave, Publish/Republish, and Unpublish. Drain or invalidate debounce timers and queued snapshots correctly. Prevent an old autosave from reverting publication status. Preserve edits made while a publish request is pending; do not replace newer local content with the older response. Publication must promote the intended latest working snapshot atomically.

Handle failures and thrown network errors so controls cannot remain permanently busy. Keep the existing quiet autosave status and clear retry messages. Prevent duplicate actions and keep action availability consistent across desktop/mobile. Account for invitation changes/unmounts so old responses do not affect a different invitation. Document the final concurrency contract and deferred delayed-response scenarios.
```

### 03. Keep invitation links stable and handle slug collisions

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 03: Keep invitation links stable and handle slug collisions.

Fix slug allocation in invitation creation, autosave, publishing, and sharing.

Preserve each draft's generated unique slug until first publication. Generate a readable slug from real couple names on first publish, with bounded conflict retries that work even when RLS hides other users' drafts. Do not depend solely on a preflight availability query. Preserve an existing published slug, including suffixes such as -2, during normal edits, republishing, and unpublish/re-publish.

Changing couple names must not silently break links already sent to guests. Do not add a link-renaming feature in this task. Keep the displayed/copied URL consistent with the actual persisted URL and show any first-publish suffix adjustment clearly. Preserve legacy invitation links and the existing template-ID remap. Update the slug documentation and record final-stage collision scenarios.
```

### 04. Protect unsaved edits and recover from save failures

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 04: Protect unsaved edits and recover from save failures.

Improve editor navigation and save-failure recovery using the write pipeline from task 02.

Handle typing then immediately returning to Dashboard, navigating to another invitation, reload/closing the page, and leaving after a save error. Include error state in unsaved-change handling. A beforeunload listener alone does not protect internal Next.js navigation.

Flush writes or present a clear save/discard/cancel choice for relevant navigation. Provide a practical retry/recovery path for failed saves without claiming a save succeeded. If durable local recovery is used, scope it to the owner and invitation, handle stale versions, and clear it on discard/sign-out as appropriate. Keep preview-only UI state out of saved wedding content.

Do not introduce intrusive prompts when everything is saved. Document the chosen behavior and deferred navigation/network-failure scenarios.
```

### 05. Add a clear publish-readiness check

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 05: Add a clear publish-readiness check.

Implement a small, shared publish-readiness validator and connect it to desktop/mobile Publish/Republish and the trusted publish boundary.

Check real couple names, valid wedding date, usable event details/main venue, and a valid RSVP destination when RSVP is enabled. Optional sections remain optional. Reject unsupported URL protocols for media and external RSVP/map links. Preserve accepted legacy invitation data through deliberate normalization rather than unsafe rendering.

Starter names, sample stories, and stock gallery images must not be mistaken for the couple's real content. Prefer clear starter guidance and explicit acknowledgement of demo content where appropriate rather than arbitrary requirements for photos or a love story. Do not block republishing existing invitations just because they lack optional content.

Show actionable errors next to fields and a concise summary that opens the relevant step. Do not rely only on display-only validation or client-side checks. Keep draft autosave permissive enough for partially completed forms. Record the final publish contract and deferred validation cases.
```

### 06. Fix uploads for Vercel and Cloudinary

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 06: Fix uploads for Vercel and Cloudinary.

Replace the full-file-through-Next.js upload path with a practical authenticated direct-to-Cloudinary upload flow, preserving crop UX, progress, photo/audio replacement, and existing saved URLs.

Read the current upload route/client and crop/audio components. The current code allows 8 MB images and 12 MB audio through the app server; the earlier audit found this exceeds Vercel's request payload limit. Design the app endpoint to authorize/sign an upload rather than forward the entire file. Keep secrets server-only. Use owner-scoped folders, allowlisted resource types, appropriate size/format restrictions, and clear failure/cancellation/timeout behavior.

Do not assume an unsigned public preset provides authenticated ownership guarantees. If required Cloudinary credentials/preset configuration are missing, complete the code, .env.example, and setup instructions, then record the exact configuration dependency; do not invent credentials or upload personal files. Fetch official documentation only as needed to implement the integration; do not run upload probes or configuration checks now.

Do not change live Cloudinary settings, delete remote media, or upload files during this task. Record final-stage deployment/upload cases.
```

### 07. Enforce the beta invitation limit atomically

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 07: Enforce the beta invitation limit atomically.

Implement the existing limit of three total invitations per owner at a trusted server/database boundary.

Read TemplateCard.tsx, invitation creation code, policies, and migrations. Preserve the current user-facing limit dialog and explain that the cap counts total invitations, including published ones. A client count followed by insert must not be the enforcement mechanism.

Handle concurrent creation requests and direct API access while keeping owner isolation. Do not remove existing invitations from accounts already at/above the cap; simply prevent further creation until below the cap. Preserve the three templates and login/selection flow.

Author any migration/RPC needed, with appropriate grants and search_path, but do not apply it now. Avoid creating alternative unprotected insert paths. Update docs and record deferred concurrent-request/quota scenarios.
```

### 08. Make dialogs, lightboxes, and selects accessible

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 08: Make dialogs, lightboxes, and selects accessible.

Improve the existing interface's keyboard and focus behavior without redesigning its visual identity.

Read src/components/ui/dialog.tsx, shared Inputs.tsx, crop/share/delete/unpublish dialogs, gallery lightboxes, and invitation openers. Implement correct initial focus, focus containment, Escape behavior, focus restoration, unique labels/IDs, background interaction management, and nested-overlay handling where relevant. Preserve gallery navigation, mobile drag behavior, and existing touch controls.

Use a maintained accessible primitive already available where appropriate; do not remove a dependency that this task needs. Custom selects should support the expected arrow keys, selection, Escape, and focus behavior, or become a suitable native/accessible control. Keep names, roles, states, and validation messages coherent.

Do not conduct browser/keyboard/a11y checks now. Record them for the final stage. Read any applicable UI skill, but defer its detector/screenshots/verification requirements per this explicit user workflow.
```

### 09. Make social-preview images match published metadata

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 09: Make social-preview images match published metadata.

Create one shared resolver for invitation share-image selection and use it in SharePreviewPanel, SEO metadata, and any sharing dialogs that display an image.

Read src/lib/seo.ts, media-url.ts, SharePreviewPanel.tsx, hero upload synchronization, and working/published snapshot handling from task 01. Decide and document one precedence order for ogImage, whatsappPreviewImage, hero image, and any fallback. Preserve existing explicit image choices and validate URL inputs.

Owner preview should represent what the next publication will share; public metadata should use the current published snapshot. Use the same transformation/crop behavior and canonical site URL rules. Do not claim WhatsApp instantly refreshes cached previews. Add clear copy when publication is needed for changes to become public.

Do not share links, call social preview tools, or run metadata checks now. Record the final-stage metadata/WhatsApp cases.
```

### 10. Load only the selected template runtime

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 10: Load only the selected template runtime.

Refactor template registration so marketing/template-card metadata does not eagerly import every template component.

Maintain one source of truth for template IDs, names, thumbnails, categories, and descriptions. Use lazy component loaders for the selected runtime while preserving server rendering/public invitation content, theme CSS behavior, live editor preview, preview-section IDs, and all three existing designs. Avoid a duplicate manually maintained marketing list.

Keep legacy template-ID mapping and existing saved invitations working. Provide appropriate loading/error behavior without turning the entire guest invitation into an unnecessary client-only loading screen. Do not add another template or rewrite bespoke sections.

Do not measure bundles, run builds, or use Lighthouse now. Record bundle/loading checks for the final stage.
```

### 11. Keep static media out of authentication refresh

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 11: Keep static media out of authentication refresh.

Adjust src/proxy.ts and the session proxy so public static media, including mp3/mp4 and versioned cinematic assets, does not perform unnecessary Supabase session work.

Preserve dashboard protection, session refresh on relevant application routes, OAuth/recovery callbacks, and safe redirects. Match exact route/path boundaries; do not accidentally exempt a protected route because its name includes media or resembles a file extension.

Preserve versioned asset cache headers and normal media/range serving. Do not weaken database policies or upload authorization. Document the routing boundary and final-stage protected-route/media-header cases.

Do not make HTTP probes, inspect live sessions, or run routing tests during this task.
```

### 12. Make marketing copy match the shipped product

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 12: Make marketing copy match the shipped product.

Correct outdated or unsupported product claims in homepage copy, testimonials, template cards, and related documentation.

The shipped product is Free Beta with Royal Rajputana, Floral Elegance, and Royal 3D Wedding Cinema. RSVP is WhatsApp or an external link, without in-app tracking/guest analytics. Do not imply payments, unavailable templates, or unlimited invitation creation when the account cap is three.

Do not invent customer quotes, adoption numbers, ratings, or evidence for a Bestseller label. Preserve verified real testimonials if evidence is provided; otherwise remove unsupported quotes/claims or clearly identify demo content. Keep the tone warm and wedding-focused, and retain a clear path to browse/preview/create.

Preserve the current design and factual support/contact details. Do not add policy promises that the product does not implement. Record any facts requiring human input. No browser/copy QA or checks in this task.
```

### 13. Polish mobile controls, motion, themes, and demo content

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 13: Polish mobile controls, motion, themes, and demo content.

Make a focused polish pass across marketing, editor, and the three existing invitation templates while preserving their individual designs.

Use one primary page h1 on marketing routes with sensible section hierarchy. Bring small mobile navigation/actions up to the project's 44px touch-target convention. Keep long names/content, form errors, sticky controls, keyboard-visible layouts, and preview container widths in mind.

Provide intentional reduced-motion alternatives for perpetual testimonial motion and other decorative effects. Implement actual pause behavior where a pause affordance is offered; CSS animationPlayState does not pause a Framer Motion transform. Preserve invitation skip/reveal alternatives and tap-first music controls.

Separate app-theme tokens from invitation-template tokens so switching the studio theme does not unintentionally change guest-template contrast, especially over images. Replace stale February 2026 demo dates with consistent evergreen/future demo behavior, computed in one place without hydration mismatches; preserve user-entered real dates and adjust existing date-dependent test source if needed, without executing it.

Do not redesign, add features, perform screenshots, run a detector, or conduct visual QA now. Record all deferred mobile, theme, motion, and date cases.
```

### 14. Remove confirmed unused files, assets, and dependencies

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 14: Remove confirmed unused files, assets, and dependencies.

Re-read the current source before deleting anything: previous tasks may have introduced consumers. Use focused source/reference searches as implementation research, not a validation run.

Reassess these candidates:
- src/components/magic-ui/pointer.tsx and shine-border.tsx
- src/components/media/CloudinaryUploadField.tsx
- src/components/ui/Chip.tsx
- src/features/dashboard/cta/CreateInvitationCTA.tsx
- src/features/dashboard/share/ShareUrlPanel.tsx
- src/features/dashboard/shared/CoordinatesInput.tsx
- src/templates/royal/components/CinematicIntro.tsx, ScratchReveal.tsx, and TapReveal.tsx
- SavingsCalculatorSheet.tsx, which previously had an unused import but no rendered control
- Unused ArrowRight imports/state in DigitalVsPhysical.tsx and FinalCTA.tsx

Remove only still-unused candidates and associated obsolete imports. Preserve active GlobalLovePointer, crop/audio uploads, InvitationOpener, WeddingDateScratchReveal, coordinate schema/map helpers needed by existing data, and all three template folders.

Reassess class-variance-authority, motion, radix-ui, and next-cloudinary. Keep dependencies now used by accessibility/other tasks and keep framer-motion. Update package.json and the lockfile together; dependency/lockfile editing is implementation work, but defer install validation, audit, build, lint, and tests. Do not bypass dependency errors with forced upgrades.

Unused starter SVGs and public/tap-to-open are candidates. Royal 3D film2 and unused declared stills/decor require manifest/validator coordination. Do not remove assets from immutable v1 URLs without establishing that earlier deployed versions cannot still need them; if that is unknown, retain them and document the decision. Keep dynamically addressed frames, active posters/decor, default music, migrations, tests, docs, and .env.example. Avoid broad directory deletion based on import counts alone.

List deletions and retained uncertain candidates. Do not execute asset validation or other checks now.
```

### 15. Refresh project documentation and prepare deferred verification

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and the repository's canonical documentation before editing. Follow docs/next-steps-prompts.md and implement only the task below, building on completed earlier tasks. Preserve unrelated work and current template designs.

User instruction for this task: do not run any checks or testing now. No lint, type checks, build, unit/integration/E2E tests, asset validators, security scans, UI detectors, browser checks, screenshots, manual QA, upload probes, migration verification, or CI. Source reading and focused reference searches needed to implement are allowed. Defer test authoring/execution to task 16. Do not apply migrations, deploy, commit, push, or disable checks. Update relevant durable docs for changed behavior, record deferred cases/prerequisites in this roadmap, and report “implemented; verification deferred.”

Task 15: Refresh project documentation and prepare deferred verification.

Update root AGENTS.md, README.md, the canonical project context, supabase-db.md, security/mobile runbooks, and environment/CI instructions to reflect the implementation completed in tasks 01-14.

Keep AGENTS.md concise and link to the detailed docs. Explain the current three-template architecture, working/published snapshots, stable links, write coordination, publish validation, upload configuration, invitation quota, accessibility patterns, and template-loading architecture. Remove stale single-template/May 2026 claims and instructions referencing test files that do not exist.

Document required migrations/configuration and a safe final-stage application order. Separate checked-in behavior from configuration that still needs confirmation. Preserve the user's deferred-verification instruction until task 16 actually begins; do not claim any feature is tested or production-ready.

Update a pending-verification checklist with scenarios from all previous tasks, any skipped requirements, and any missing credentials/device/deployment prerequisites. Do not author/execute the full test suite yet, trigger CI, apply migrations, deploy, commit, or push.
```

### 16. Run all checks and tests, fix failures, and assess beta readiness

```text
Work in /Users/kira/wed-pro. Read the nearest AGENTS.md and canonical project documentation before proceeding. Follow docs/next-steps-prompts.md.

Task 16: Run all checks and tests, fix failures, and assess beta readiness.

This is the final verification stage. Start only after tasks 01-15 have been implemented and all intentionally deferred/unresolved items have been reviewed. The earlier no-checks/no-testing rule is lifted for this stage.

Read AGENTS.md, this roadmap, canonical docs, implementation notes, current Git state, and the full pending-verification checklist. Summarize unfinished prerequisites first. Implement any remaining code prerequisites before treating the project as ready; do not silently skip critical coverage.

Author meaningful tests for the changed behavior, then run the consolidated verification:
1. Lint, TypeScript, production build, Royal 3D asset validation, relevant dependency/security checks, and source/dependency/asset cleanup review.
2. Apply authored migrations only to an explicitly identified local/test environment and check their behavior there. Inspect linked migration status when access exists. Do not apply production migrations or deploy without my explicit authorization for that environment.
3. Test authenticated create/edit/autosave/reload/publish/republish/public-view/unpublish lifecycle against a dedicated disposable test setup. Cover delayed/reordered writes, edits during publication, stable/suffixed slugs, collisions hidden by RLS, private working content, owner isolation, concurrent quota enforcement, invalid publish data, navigation with pending/failed saves, and recovery.
4. Run the existing suite against the production build, then appropriate desktop/mobile Chrome and Safari/WebKit coverage. Investigate development-server opener failures separately; do not equate them with production defects without evidence. Avoid clock-dependent demo assertions and unnecessary visual snapshot baselines.
5. Check all three templates and editor at 320/360px and desktop widths, both studio themes, long content, typography sizes, keyboard-only interactions, modal/listbox focus, reduced motion, scratch alternatives, music controls, images, and maps. Run applicable UI detectors and investigate their findings rather than reporting comments as defects.
6. Verify upload authentication/authorization, formats/sizes/errors/progress, static-media proxy exclusions/cache/range behavior, lazy template loading, and public metadata using the current published snapshot. Use disposable media only in an explicitly designated test setup.
7. Confirm real Android/iPhone and production WhatsApp share behavior where available. If a device, credential, external setting, migration permission, or deployment is unavailable, state exactly what remains unverified and give a short manual checklist. Do not substitute an emulator for a real-device claim, send messages, change passwords, or delete existing personal invitations.

Fix failures within scope and rerun the affected checks until resolved, then finish the combined checks. Preserve unrelated work and use safe fixtures, never real invitations as disposable data. Do not introduce new features during verification.

Report changes, commands/results, skipped checks with reasons, remaining risks, and a clear readiness verdict for a small Free Beta. Only after this stage is complete, update AGENTS.md/runbooks to close the deferred-verification phase and restore the normal appropriate-checks-after-changes workflow. Do not commit, push, merge, apply production migrations, or deploy unless separately requested.
```
