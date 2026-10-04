# Project operating instructions

Read this file and [canonical project context](.cursor/rules/project-context.mdc) before repository edits. Preserve unrelated work, saved invitations and the three existing template designs. Keep repeated workflows and changed contracts in this file or linked durable docs; explain unfamiliar commands in plain language. Never expose secrets, rewrite applied migrations, or push directly to main.

## Current workflow: task 16 verification in progress

The user explicitly started task 16; the tasks 01–15 no-checks rule is lifted for this verification stage. Run appropriate checks for verification fixes, preserve unrelated changes, and record commands/results and unavailable coverage in [task 16 evidence](docs/task-16-verification.md). Task 16 remains open until critical database/provider prerequisites and pending cases are resolved; local passes do not establish beta readiness.

Use only explicitly identified disposable database/media setups. On 4 October 2026 the user authorized migrations and disposable verification on the shared Supabase/Cloudinary targets. Five migrations are now applied, including two verification fixes; repository filenames match MCP-assigned history versions without changing applied SQL. Original 5 invitations/3 published copies and their content/link digest are preserved. Cloudinary credentials, signed presets and generated PNG/WAV signing/upload/completion pass; generated fixtures were removed. Two-owner database coverage passes; 40 distinct authenticated Chrome/WebKit browser cases pass; the Preview release is underway. See current evidence for exact coverage and remaining cases. Never infer authorization from credentials or estimated row counts. The user authorized commit/push on the existing codex branch and Vercel Preview configuration/deployment for device testing. Keep PR #20 open: merging/main/production deployment, password changes, messages and deletion of personal invitations/media remain unauthorized. Do not force dependency upgrades or disable gates. Restore the normal workflow only after the final stage is actually complete.

## Contracts to preserve

- Free Beta: Royal Rajputana (`royal`), Floral Elegance (`floral-elegance`), Royal 3D Wedding Cinema (`royal-3d-cinema`); three total invitations per owner, including published ones. RSVP is WhatsApp/external link, without payments, guest storage or analytics. No fabricated testimonials or unsupported product claims.
- Owner working JSONB is private in `invitations`; guests and metadata read only `published_invitations`. Save/publish/unpublish use the revision queue and trusted RPCs. Stale application revisions return PT409/HTTP 409, never SQLSTATE 40001 (which causes PostgREST retry loops). Preserve first-publication slugs/suffixes; no direct INSERT/UPDATE or public working-table fallback.
- Protect internal navigation and save errors with save/discard/cancel and owner/invitation-scoped recovery. Keep temporary preview/crop state out of saved content. Readiness validation belongs in both the shared helper and database publish transaction; draft saving remains permissive.
- Creation uses the owner-profile-serialized quota RPC. Radix ModalSurface/shared Dialog supplies focus/background/scroll behavior; template overlays remain inline. Keep framer-motion and radix-ui.
- Upload app endpoints accept bounded JSON; bytes go directly to Cloudinary with authenticated signing and metadata completion. Keep secrets server-only; do not restore unsigned ownership assumptions.
- Registry metadata imports no template runtimes. Use SSR-enabled lazy loaders, centralized legacy IDs, shared preview IDs and share-image resolver. Isolate studio/template/on-image colors, retain 44px targets and reduced-motion/skip/reveal/tap-first music behavior. Demo dates are computed from a supplied server/creation reference, never advanced for saved invitations.
- Static session exemptions use explicit namespaces/exact paths, not extensions/substrings. Preserve protected route boundaries/cache/range behavior. Keep immutable v1 and uncertain legacy media until historical evidence permits retirement.

## Detailed references

| Topic | Documentation |
| --- | --- |
| Ordered tasks/status | [Roadmap](docs/next-steps-prompts.md) |
| Pending cases and rollout order | [Verification plan](docs/pending-verification.md) |
| Environment/CI prerequisites and commands | [Environment and CI](docs/environment-and-ci.md) |
| Schema/access/ordered migrations | [Database reference](supabase-db.md) |
| Publication, queue, links | [Persistence contract](docs/invitation-persistence.md) |
| Navigation, recovery, validation | [Editor safety](docs/editor-safety.md) |
| Direct upload setup/limitations | [Cloudinary uploads](docs/cloudinary-uploads.md) |
| Trusted creation cap | [Quota contract](docs/invitation-quota.md) |
| Focus/overlays/selects | [Accessibility contract](docs/accessible-overlays.md) |
| Share images/lazy runtimes | [Sharing and loading](docs/sharing-and-template-loading.md) |
| Mobile/motion/themes/demos | [Polish contract](docs/mobile-motion-theme-and-demos.md) |
| Routing/factual marketing | [Routing and copy](docs/session-routing-and-product-copy.md) |
| Deletions/retained assets | [Cleanup decisions](docs/cleanup-decisions.md) |
| Final security/mobile cases | [Security](docs/hardening-security.md), [mobile QA](docs/qa-mobile.md) |
| Template development | [Architecture](.cursor/rules/template-architecture.mdc) |
