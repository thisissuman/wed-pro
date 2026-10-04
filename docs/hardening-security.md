# Security runbook: ongoing verification

Task 16 assessment and the authorized release are complete with documented limits. Run appropriate security checks after relevant changes. [Local verification evidence](task-16-verification.md) records passing contracts/static checks and the remaining gates. The broad items below are not closed by local smoke tests. Database/upload writes require an explicitly authorized disposable target; the shared target is explicitly authorized for the five migrations and dedicated fixtures. Production configuration and PR #20 release are authorized and verified. [Pending verification](pending-verification.md) holds the complete scenario list; [environment/CI](environment-and-ci.md) holds commands, secrets and coverage limitations.

## Database boundary

- [ ] For a new target, reconcile prior history and apply snapshots → readiness → quota → hardening → PT409. All five are already applied on the authorized shared target; do not replay them. Validate backups, preserved JSONB/slugs/public snapshots/history and PostgREST exposure.
- [ ] profiles is owner-only; working invitations allow only owner reads/deletion; anonymous and other-owner direct REST/SELECT * cannot read private content.
- [ ] Public snapshot SELECT is allowed; direct snapshot writes and working table/column INSERT/UPDATE are denied. No permissive dependent view/function/old policy or inherited grant bypasses this.
- [ ] Row-locked ownership/revision RPCs and internal helper grants/search_path withstand forged lifecycle content, stale revisions, anonymous/non-owner calls and uncertain results.
- [ ] Owner-serialized creation counts total invitations including published, is idempotent for the same request, rejects concurrent/direct bypass and retains above-cap rows.
- [ ] Old RSVP storage is absent after reconciled earlier create/drop history; no payment/guest tracking authorization path exists. Never use client service-role keys or user_metadata as policy authority.

## Auth, routes and publication

- [ ] Exact dashboard root/descendants are protected; login/OAuth/recovery safe next/cookies and single shared client AuthProvider behave correctly.
- [ ] Literal proxy matcher and session helper agree on explicit static namespaces/files without arbitrary extension/substrings. Media-like protected routes remain protected; callbacks and independent upload authorization remain intact.
- [ ] Static MP3/MP4/frames GET/HEAD/range/cache behavior is normal without session-generated cookies; immutable v1 contract survives.
- [ ] Autosave changes only working content; owner preview uses it; guest page/metadata share frozen published content. Unpublish yields public 404 without losing edits/history.
- [ ] Saved-row publish validation matches shared rules for real names/dates/events/main venue/RSVP, safe URLs and demo acknowledgement; direct RPC cannot bypass. Optional omissions and accepted legacy content remain supported.
- [ ] Stable suffix links survive renaming couple fields/republishing/unpublish; canonical origin is configured explicitly and public metadata does not disclose private edits.
- [ ] Navigation/save-error recovery is owner/invitation-scoped; no UI/crop state persists. Best-effort local copies expire/clear appropriately, are device-local/unencrypted, and never resolve stale server conflicts silently.

## Upload/provider boundary

- [ ] Server-only Cloudinary credentials, signed presets, real fixed/dynamic mode and Admin read permission confirmed in authorized fixtures. No secret/unsigned widget ownership assumption or full file forwarding through Next.
- [ ] Signing/completion enforces owner/slot/ticket/parameters/expiry/type/format/actual 8/12 MiB byte attachment limits; replay/resource-type switching cannot attach unauthorized media.
- [ ] Timeout/cancel/unmount/replacement and late responses preserve prior media. Provider leftovers/cost and account/rate operational prerequisites are documented; presets do not impose product pre-storage byte ceilings.
- [ ] Media/RSVP/map/share URLs reject unsupported protocols, credentials and unsafe inputs; safe legacy rendering preserves stored JSONB without unsafe HTML execution.

## CI and release gates

CI runs npm ci, Chromium install, lint, TypeScript, Royal assets, contract tests, production build and mobile-Chrome public tests on PRs/main pushes. Provider-backed database/browser suites are separately guarded; they are not silently enabled against shared production by CI. The user authorized pushing the existing PR #20 branch and Preview configuration, with merge/main/production release pending. Current evidence records actual results.

Every skipped credential/configuration/device case needs an explicit reason and readiness impact. Production migration/deployment requires separate authorization after verified nonproduction results, backup/history review, incompatible client drainage and a privacy-preserving recovery plan. Do not restore public working-table policies or direct writes to bypass rollout failures.
