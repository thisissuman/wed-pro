# Invitation drafts, publication, and links

Tasks 01–03 were implemented on 4 October 2026; verification is deferred to roadmap task 16. The migration described here is authored, **not applied**. This document describes the intended contract of that migration and the updated application, not a verified live database state.

## Storage and access boundary

`public.invitations` contains the owner's working JSONB document, including while its status is `published`. `public.published_invitations` contains a frozen public copy. Autosave changes only working content. Owner editing, dashboard data, and owner preview read `invitations`; both guest rendering and `generateMetadata()` on `/w/[slug]` use the same request-cached read of `published_invitations`.

| Boundary | Anonymous | Authenticated owner | Other authenticated users |
| --- | --- | --- | --- |
| Working invitations | No table grants | SELECT/DELETE own rows; creation via quota RPC only | Cannot read or modify another owner's rows |
| Published copies | SELECT | SELECT | SELECT |
| Save/publish/unpublish RPCs | No EXECUTE | Own invitation only, expected revision required | Ownership check rejects another owner's ID |

The new migration removes all earlier invitation policies, including permissive public SELECT or FOR ALL policies, and replaces them with owner-only rules. Direct UPDATE of `invitations` and all client writes to `published_invitations` are revoked. Task 07 supersedes the initial column-scoped INSERT grant: the final quota migration revokes direct table/column INSERT and its policy; create_invitation_draft is the sole creation path. Private content is protected at the database boundary, including SELECT * and direct REST requests; there is no public fallback to the working table. Supabase service-role/database administrators remain privileged and must never be used in client code.

The existing working table gains `draft_revision` (nonnegative bigint, initially zero) and `first_published_at` (nullable timestamp). The public table has id, user_id, slug, template_id, status restricted to published, content, created_at, updated_at, and published_at. Its invitation foreign key cascades deletion of the public copy when an owner deletes the working invitation. Both documents retain the existing JSONB format and template-ID normalization.

## Atomic database operations

All three authenticated RPCs use a restricted search path, check `auth.uid()` against ownership, lock the invitation row, and compare the supplied expected revision. Each successful operation increments the revision. A revision mismatch returns SQLSTATE PT409 / HTTP 409 and requires reloading/reconciling instead of overwriting another session. Never raise custom 40001 for this application conflict: live verification reproduced PostgREST's serialization retry loop. Client reconciliation copy accepts PT409 and legacy 40001 during transition. The internal document helper has no client execution grant and overwrites JSON lifecycle metadata with authoritative row values.

- `save_invitation_draft`: persists working content/template only. Client JSON cannot change the reserved slug, publication status, or publication history. The public copy is untouched.
- `publish_invitation_snapshot`: publishes the saved working row and copies it into the public table in one transaction. It does not accept a second client content document. The expected revision identifies the intended saved document. Failure rolls back both status/link allocation and public-copy changes.
- `unpublish_invitation_snapshot`: removes the public copy and returns the working row to draft status in one transaction. Working content, reserved link, and first-publication marker survive. Public routes subsequently have no snapshot to read.

The browser helpers catch returned errors and thrown failures. Transport requests have a 20-second abort timeout. Aborting a request cannot undo a transaction that already committed: an uncertain result requires reloading to confirm publication/revision. Never assume timeout means rollback, or replay an old write with a guessed newer revision. Already-open guest pages and external social-preview caches cannot be withdrawn by deleting the database snapshot.

## Editor concurrency contract

`useInvitationPersistence` owns one ordered promise queue per mounted invitation. Autosave waits 900ms after edits, then reads the latest store content when its queued operation actually runs; it never keeps an old captured document in a debounce timer. User edits increment a local version; server acknowledgements do not.

Publish and Unpublish synchronously claim an action lock, cancel debounce timers, wait for any dispatched save, and drain new working edits. The publication request uses the resulting database revision. Edits arriving after that request is dispatched remain local/private; its older response merges authoritative lifecycle metadata without replacing those newer fields. A subsequent queued save persists them privately. They become public only through another Republish.

Queued obsolete autosaves skip during a publication action. Saves never write lifecycle status, even if an earlier save response arrives late. Duplicate publication/retry actions share the same synchronous lock, and desktop/mobile controls use the same busy state. Retry private save uses this queue too. Errors pause automatic retries, retain local edits/error text, and release busy controls in finally blocks; Publish/Unpublish can be explicitly retried. A private-save retry cannot resolve an uncertain publication result when there are no unsaved fields.

Unmount or invitation change deactivates the session and cancels its timer. Queued work and acknowledgements cannot update the next editor; an already-dispatched transaction can still finish against its original invitation. Another tab or a stale dashboard operation is protected by the database revision check. Dashboard publication also uses the RPCs and never uploads its older cached content over the saved working document.

Task 04 adds navigation save/discard/cancel and owner-scoped browser recovery. See [editor safety](editor-safety.md); storage can be unavailable and conflicts/uncertain responses still require confirming the current server revision.

## Stable links

Creation reserves a template-prefixed random slug using a UUID and at most three INSERT attempts for unique conflicts. That generated slug stays unchanged through draft edits/autosave. There is no preflight availability query and no link-renaming UI.

On first publication the helper requests a readable slug from the couple's names. The database unique constraint arbitrates collisions, including drafts hidden by RLS and simultaneous publications. There are at most 25 candidates: the base, then -2 through -25, with suffix room inside the 64-character limit. Exhaustion rolls back and shows a retry message. The persisted returned slug is used for sharing and displayed with an adjustment notice when a suffix was allocated.

After first publication, the database ignores any requested rename and keeps the exact saved slug, including historical suffixes. Name edits, Republish, Unpublish, and publishing again never silently change a shared link. `first_published_at` is never cleared by Unpublish. Legacy template-ID remapping is retained. Task 05 adds publish readiness at both the shared helper and database transaction, including starter-name rejection and sample-story/stock-photo acknowledgement. See [editor safety](editor-safety.md).

## Migration and rollout prerequisites for task 16

Migrations, in order: `20261004060250_private_drafts_and_published_snapshots.sql`, `20261004060252_publish_readiness.sql`, then `20261004060253_atomic_invitation_quota.sql` under supabase/migrations. All three are authored and unapplied. Reconcile earlier history first; see [database reference](../supabase-db.md) and [final-stage gates](pending-verification.md).

Before applying it, establish the actual deployed migration history, existing policies/grants/triggers, dependent views/functions, and PostgREST schema-cache refresh requirements in an authorized nonproduction environment. Arrange a backup/recovery plan and a coordinated migration/client rollout. Existing clients that UPDATE working rows directly become incompatible; new clients need the new columns, table, and RPCs. Do not deploy either side independently or restore the old public working-table policy as a compatibility workaround.

The migration copies every currently published row's existing JSONB exactly into the public table, keeping ids/slugs/timestamps/templates. It leaves working JSON intact and backfills first-publication markers for current published rows and identifiable historical publications (published_at or JSON meta.publishedAt). It does not cast potentially malformed JSON timestamps. Historical publication with both markers already erased cannot be reconstructed automatically; identify any such legacy rows before rollout and preserve their links deliberately. Changes already exposed by the old autosave model cannot be separated retroactively from the old public document.

No migration has been applied or verified in this phase. Task 16 must author and execute authorization, lifecycle, collision, and delayed-response cases recorded in the roadmap. Production migration/deployment still requires separate authorization. A rollback must preserve both copies and the owner-only boundary; simply returning to the previous public working-table model exposes private edits.

## Creation quota and social metadata additions (tasks 07–10)

Creation now uses only the owner-serialized create_invitation_draft RPC; total working rows, including published ones, count toward three invitations. Its additional migration remains unapplied. See [quota contract](invitation-quota.md). Sharing images use one explicit OG → explicit WhatsApp → hero → no-image resolver, with working content for the next-publication editor preview and published content for guests. See [sharing/runtime contract](sharing-and-template-loading.md). These additions do not change the revision queue, first-publication slug history, or public/private access separation. All verification remains deferred to task 16.


## Task 16 lifecycle correction and local coverage

Action availability is scoped to the initial invitation object instead of resetting React state synchronously inside the session effect. Invitation switches immediately stop displaying the old action; the existing session token still invalidates old queued operations/responses. Server readiness errors are associated with the draft that produced them and stop displaying when that draft changes. Recovery reads schedule their UI update with an unmount guard; navigation's busy ref synchronizes in an effect. Local React pipeline tests cover drain/coalescing, duplicate publish, edits during publication, save failure/retry, switching invitations, navigation flush/discard and recovery isolation/expiry. These mocked-boundary results do not validate PostgreSQL/RLS or authenticated browser navigation.
