# Vivaha Studio

A mobile-first digital wedding invitation project built with Next.js, React, TypeScript, Tailwind, Zustand, Supabase and Framer Motion. Free Beta offers three total invitations per owner, including published invitations. RSVP uses WhatsApp or an external link; there are no payments, in-app RSVP records or guest analytics.

Tasks 01–15 are implemented; **task 16 verification is in progress**. See [verification evidence and remaining gates](docs/task-16-verification.md). Local passes do not establish beta readiness. Five required migrations are applied under explicit authorization. The two-owner database suite passes; 40 distinct authenticated Chrome/WebKit browser cases pass. A branch/Vercel preview is authorized for device testing; merge and production release remain pending.

## Three templates

| ID | Design |
| --- | --- |
| `royal` | Royal Rajputana |
| `floral-elegance` | Floral Elegance |
| `royal-3d-cinema` | Royal 3D Wedding Cinema |

`src/templates/registry.ts` is the metadata source for marketing/cards. `runtime-registry.tsx` loads the selected component with server rendering enabled; templates render the same WeddingData schema through bespoke sections. `template-ids.ts` preserves the garden-mandap legacy mapping. Shared theme tokens, preview IDs and accessible inline overlays preserve each design.

## Invitation lifecycle

Owners edit private working content in `invitations`. Autosave updates that copy only. Publish/Republish drains the editor write queue, validates the intended saved revision, and atomically promotes it to `published_invitations`. Guests and their SEO metadata use the same public snapshot; owner preview uses working content. Unpublish removes public access while retaining edits and link history.

Drafts keep a generated slug until first publication. Database unique constraints allocate a readable couple-name slug with bounded suffix retries; later name edits/republishing retain the exact shared link. The trusted creation RPC caps total working invitations at three. Internal navigation/save failures use save/discard/cancel and explicit owner-scoped local recovery.

## Routes and source

| Route/source | Purpose |
| --- | --- |
| `/`, `/template` | Marketing, browse/preview/create |
| `/preview/[templateId]` | Server-supplied future demo content |
| `/dashboard` | Owner invitations |
| `/dashboard/invitations/[id]/edit` | Editor/store/queued writes and working preview |
| `/w/[slug]` | Published guest content and metadata |
| `/api/cloudinary/upload`, `/api/cloudinary/complete` | Authenticated JSON signing and asset confirmation |
| `src/lib`, `src/stores`, `src/features/invitations` | Shared contracts, state and owner workflows |
| `supabase/migrations` | Versioned schema/RLS/RPC source |

Uploads keep crop/progress/audio replacement UX. File bytes go directly to Cloudinary, with owner-bound signing and server metadata confirmation. Required credentials, signed presets, folder mode and provider limits are described in [upload setup](docs/cloudinary-uploads.md). Image/audio attachment limits are 8/12 MiB; preset settings alone do not enforce product byte limits before storage.

## Setup and final-stage verification

Use Node 22 to match current CI and npm with package-lock.json. `.env.example` contains placeholders; it is not configured credentials. [Environment and CI](docs/environment-and-ci.md) explains later installation/start/check commands, origin/auth/upload settings, existing test coverage and CI gaps. Task 16 is active; run appropriate checks for changes. Use the guarded live runner only with explicitly authorized dedicated accounts.

Five October migrations are applied on the authorized shared target: private snapshots, readiness, quota, timestamp/index/profile hardening, and PT409 revision conflicts. [Database reference](supabase-db.md) and [pending verification](docs/pending-verification.md) define the safe nonproduction-first rollout sequence, backup/history prerequisites and separate production authorization. New clients require those database boundaries; old clients must be drained during coordinated rollout.

Database history, preserved original documents and generated Cloudinary uploads are confirmed. Live tests use two dedicated accounts and clean up only generated fixtures. Device/WhatsApp/real-user Auth and production rollout remain pending; see the evidence and manual handoff before describing the app as production-ready.

Read [AGENTS.md](AGENTS.md) and [canonical context](.cursor/rules/project-context.mdc) before work. Detailed contracts, cleanup retention decisions and task-by-task scenarios are linked from the [roadmap](docs/next-steps-prompts.md).
