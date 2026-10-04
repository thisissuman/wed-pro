# Supabase database reference

The checked-in schema uses WeddingData JSONB with private working documents and independent public copies. Versioned SQL in `supabase/migrations` is the source. Task 16 inspected live history/grants and applied the five October migrations to the explicitly authorized shared target. New environments must reconcile their own history first.

## Tables and access

| Table | Access after the five October migrations |
| --- | --- |
| profiles | Auth-linked owner identity; owner SELECT/UPDATE under earlier security migration |
| invitations | Private working JSONB, including published status; owner SELECT/DELETE; no direct client INSERT/UPDATE |
| published_invitations | Frozen public JSONB; anonymous/authenticated SELECT only; no direct client writes |

Working rows retain id, user_id, globally unique slug, template_id, draft/published status, content, timestamps and nullable published_at; add draft_revision and persistent first_published_at. Public snapshot id references its working invitation with cascading deletion and published-only status. Existing profile/timestamp triggers remain part of prerequisite history; owner indexes/slug constraints support queries and collision arbitration. No RSVP table/guest analytics/payment flag is part of Free Beta; the earlier drop_rsvps migration must be reconciled with actual history.

Do not place private columns on anonymously selectable rows or expose them through permissive views/functions. Policies and table/column/function grants work together; React hiding is not authorization. Service-role/database administrators are privileged and must stay outside client code.

## Trusted writes

| RPC | Contract |
| --- | --- |
| create_invitation_draft | Infers owner, locks existing owner profile, counts all working rows and enforces three total; same owner/request ID retry is idempotent |
| save_invitation_draft | Locks owner row, requires expected revision, saves private content/template; cannot alter slug/public status/history |
| publish_invitation_snapshot | Checks owner/revision and saved-row readiness, allocates first-publication slug and atomically promotes saved content |
| unpublish_invitation_snapshot | Checks owner/revision, removes public snapshot, retains working edits/slug/first-publication history |

Save/publish/unpublish increment the working revision; stale-revision conflicts require reconciliation, never guessed retries. Internal document/readiness helpers are not client-executable. Keep explicit SECURITY DEFINER search_path/grants from migrations and audit actual dependent views/functions/roles in task 16. The queue drain/intended publication contract is in [persistence](docs/invitation-persistence.md); validation parity in [editor safety](docs/editor-safety.md); serialized quota/isolation in [quota](docs/invitation-quota.md).

Creation reserves a unique generated slug with bounded retries. First publish uses database constraints to allocate a readable base or suffix through -25, even when other owners' drafts are hidden. Existing first-published slugs/suffixes are stable through names/edits/unpublish/re-publish. Quota counts published working rows once, not their public copies; existing above-cap rows are retained.

## Required migration order and rollout

Reconcile the actual environment with every earlier checked-in migration first, including initial schema, profile creation/search_path hardening, working-table security, duplicate-index removal and the historical RSVP create/drop migrations. Never assume their presence from file dates or replay applied history.

These migrations were applied on 4 October 2026 to the shared production project under explicit user authorization. For a new target, reconcile history and apply in this order:

1. `20261004060250_private_drafts_and_published_snapshots.sql`: owner/public split, revision RPCs, snapshot backfill and first-publication history.
2. `20261004060252_publish_readiness.sql`: authoritative saved-row validation inside publication.
3. `20261004060253_atomic_invitation_quota.sql`: sole creation RPC, owner serialization and revoked direct INSERT.
4. `20261004060822_harden_timestamp_and_snapshot_index.sql`: restricted timestamp-trigger search path, snapshot owner FK index and profile-policy initplans.
5. `20261004061209_nonretryable_revision_conflicts.sql`: expected-revision conflicts use PT409/HTTP 409 instead of PostgREST-retryable 40001.

MCP assigned the recorded timestamps. Source files were renamed to match live history; applied SQL contents were not rewritten. Do not replay the earlier local draft versions as additional migrations.

Before application establish target authorization, actual schema/history/grants/triggers/views, backup/restore and legacy publication-marker inventory. Currently published rows are copied with existing JSONB/id/slug/template/timestamps intact. Historical publications with all markers erased cannot be automatically reconstructed; identify/preserve their links deliberately. Old autosave's previously exposed edits cannot be retroactively separated from what guests saw.

After nonproduction application, task 16 must verify backfill/schema-cache exposure and direct REST/RPC isolation, revision/lifecycle/readiness/collision/quota cases before any production rollout proposal. New clients require the new schema/RPCs; old direct-write clients must be drained during a coordinated rollout. Do not deploy either side independently or restore old public policies/direct writes as a workaround.

Production schema application was explicitly authorized and completed; Vercel Preview deployment is authorized; main/production release remains pending. Recovery/rollback must preserve both working/public documents and their privacy; code rollback must support the new schema. Do not downgrade to public working content or drop new tables to restore compatibility. Any deployed old client that reads working rows publicly or writes tables directly is incompatible and needs the matching app release. Detailed gates: [pending verification](docs/pending-verification.md), [environment/CI](docs/environment-and-ci.md).


## Task 16 target status

History and grants were inspected through Supabase MCP; all five new migrations applied successfully. A private pre-migration preservation export is at `/private/tmp/wed-supabase-preservation-oVWAiP/pre-migration.json` (local permissions 0600; not a complete Auth/disaster-recovery backup). Each migration is transactional. Recovery must keep the private/public boundary and use additive corrections/compatible code; the export preserves original invitation documents and prior schema metadata for comparison, not permission to restore insecure policies.

The original 5 rows and 3 published snapshots match the pre-migration content/link digest after fixture cleanup. Dedicated-account direct REST probes passed creation, private/public separation, invalid publish refusal, concurrent stale writes returning 409, republish/unpublish/stable links, concurrent quota and idempotency. The guarded two-owner suite passed all five cases, including cross-owner/anonymous reads and writes, frozen publication/revision races, RLS-hidden collisions and concurrent quota. Extended legacy/edge cases remain documented, not implied passes. Table-list estimates are not evidence of emptiness. Leaked-password protection remains disabled; authenticated SECURITY DEFINER RPC warnings are intentional and require continued owner/revision/grant review. No Auth setting was changed.
