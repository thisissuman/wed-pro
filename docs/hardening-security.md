# Security Hardening Checklist

Use this checklist before open beta launches and after any change touching auth,
publishing, uploads, or Supabase policies.

## Current Security Model

- Invitations live in `public.invitations`; dynamic invitation content is stored
  in `content` JSONB.
- Published invitations are public and readable by `anon`.
- Draft invitations are owner-only.
- Owners can insert, update, and delete only rows where `user_id = auth.uid()`.
- Public RSVP storage has been removed; guests only use WhatsApp or external links.
- No payment or `paid` flags exist during Free Beta, so publish is never gated by
  client-controlled state.

## Supabase / RLS

- [ ] `profiles` RLS is enabled and users can only select/update their own row.
- [ ] `invitations` RLS is enabled.
- [ ] `anon` can select only `status = 'published'` invitations.
- [ ] `authenticated` users can select their own rows and published rows.
- [ ] Insert/update/delete policies use `(select auth.uid()) = user_id`.
- [ ] `public.rsvps` is dropped in every environment via
  `supabase/migrations/20260525120000_drop_rsvps_table.sql`.
- [ ] No authorization policy depends on `user_metadata`.
- [ ] No `service_role` key is used in client-side code.

## Auth & Redirects

- [ ] `/dashboard` redirects anonymous users to `/login`.
- [ ] OAuth callback only accepts safe relative `next` paths.
- [ ] `AuthProvider` remains the single client auth source for nav components.
- [ ] `src/proxy.ts` refreshes sessions on protected routes.

## Publish & Public Sharing

- [ ] `publishInvitation()` checks ownership before changing status.
- [ ] Slug conflicts use suffixes through `findAvailableSlug()`.
- [ ] Draft public URLs return 404.
- [ ] Published `/w/[slug]` pages include title, description, and OpenGraph tags.
- [ ] `NEXT_PUBLIC_SITE_URL` is configured in production for absolute OG URLs.

## Uploads & Media

- [ ] Cloudinary upload preset limits file size and accepted media types.
- [ ] Public template rendering uses URL validation before showing user-provided media.
- [ ] Uploaded images are delivered through optimized transformations where possible.
- [ ] Music URLs are treated as user content and never executed as HTML.

## GitHub Actions CI

Workflow: `.github/workflows/ci.yml` (lint → build → Playwright on PRs and pushes to `main`).

| Secret | Required for | Notes |
|--------|----------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Auth E2E only | CI uses a harmless placeholder if unset |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth E2E only | CI uses a harmless placeholder if unset; real value is from Supabase → Project Settings → API |
| `NEXT_PUBLIC_SITE_URL` | Optional | Defaults to `http://127.0.0.1:3000` in CI |
| `PLAYWRIGHT_TEST_EMAIL` | Optional auth smoke test | Skipped when empty |
| `PLAYWRIGHT_TEST_PASSWORD` | Optional auth smoke test | Use a dedicated test user, not production |

Add secrets under **GitHub repo → Settings → Secrets and variables → Actions**.

After adding or changing secrets, open the PR → **Checks** → **Re-run all jobs** (no code push required).

### GitHub settings checklist

| Where | Do you need it? |
|-------|----------------|
| **Secrets → Actions** (the four secrets above) | Yes — you already did this |
| **Actions → General → Allow all actions** | Usually already default; only check if workflows never start |
| **Branch protection on `main`** | Optional — require `lint-build-test` before merge |
| **Environments / deployment approvals** | Not needed for this repo yet |
| **Vercel env vars** | Yes for production — same `NEXT_PUBLIC_*` as local `.env.local` |

## Verification Commands

```bash
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
npm run db:status
```

For authenticated Playwright smoke coverage, set:

```bash
PLAYWRIGHT_TEST_EMAIL="test@example.com"
PLAYWRIGHT_TEST_PASSWORD="strong-password"
```
