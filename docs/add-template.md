# Add A New Template

**Index:** [`docs/create-new-template.md`](./create-new-template.md) · **Prompt:** [`docs/create-template-prompt.md`](./create-template-prompt.md) · **Agent:** [`.cursor/skills/create-template/SKILL.md`](../.cursor/skills/create-template/SKILL.md)

Implementation checklist for a new sellable design. Does **not** change editor, auth, publish, or `/w/[slug]` logic.

## 1. Scaffold

```text
src/templates/<template-id>/
  <PascalTemplate>.tsx
  theme.ts
  components/     # optional — intros, ornaments, cinematic kit
  hooks/          # optional — e.g. usePrefersReducedMotion (copy from royal or move to shared later)
  sections/
```

Reference: `src/templates/royal/`. No Supabase, auth, or Zustand in template files.

## 2. Root orchestrator

Mirror [`RoyalTemplate.tsx`](../src/templates/royal/RoyalTemplate.tsx):

- `TemplateThemeProvider` with `defaultTheme`, `theme={data.theme}`, `typographyScale={data.typography?.scale ?? "default"}`.
- `withEssentialSections(data.sections)` and `sections.show*` visibility flags.
- Pass `WeddingData` slices into each section; accept `isPreview` / `suppressMusicPlayer` on `TemplateProps`.
- `MusicPlayer` with `music={resolveMusicPlayback(data.music)}` if you want default fallback audio (optional).
- Cinematic `components/` only when the design spec requires them.

## 3. Theme tokens

- Export `TemplateThemeTokens` in `<template-id>/theme.ts`.
- Prefer CSS variables (`var(--template-primary)`, etc.) over hard-coded palette in sections.

## 4. Section contracts

```ts
import type { HeroSectionContract } from "@/templates/shared/sections/types";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
```

```tsx
<section id={PREVIEW_SECTION_IDS.events}>…</section>
```

Mapped ids: hero, couple, countdown, events, story, gallery, venue, rsvp.

## 5. Media and performance

- `isValidDisplayUrl()` before rendering couple/hero/gallery URLs.
- `next/image` + accurate `sizes` on every photo.
- Countdown: generic/`"--"` on server, update in `useEffect` (Royal `CountdownSection`).
- Motion from `src/templates/shared/motion/presets.ts`; `transform`/`opacity` only on mobile.
- `prefers-reduced-motion` for any cinematic interaction.

## 6. Registry and routes

- One entry in [`src/templates/registry.ts`](../src/templates/registry.ts).
- Do **not** add a second list in `src/data/templates.ts`.
- Verify:
  - `/preview/<template-id>`
  - `/template` preview + select
  - Editor live preview via `TemplateRenderer`

## 7. Mobile QA

[`docs/qa-mobile.md`](./qa-mobile.md) — use your `template-id` instead of `royal` in route rows.

Minimum: 360px viewport, real Android, iPhone Safari, published `/w/[slug]` WhatsApp share test.

## 8. Commands

```bash
npm run lint
npm run build
npm run test:e2e -- --project=mobile-chrome
```

No new visual screenshot tests. Existing smoke (`tests/e2e/free-beta.spec.ts`) must pass.

## Done when

- Full `WeddingData` renders without crashes.
- Registry + preview routes work.
- Preview ids wired for editor scroll.
- No DB/auth/payment/Zustand imports under `src/templates/`.
- E2E + mobile QA complete.
