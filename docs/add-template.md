# Add A New Template

Use this checklist when adding sellable template designs from Figma, screenshots,
or a written design brief. The goal is to add visual variety without changing
editor, auth, publish, or public route logic.

For the repeatable copy-paste workflow, start with
`docs/create-template-prompt.md`. This file is the shorter implementation
checklist.

## 1. Scaffold

```text
src/templates/<template-id>/
  <PascalTemplate>.tsx
  theme.ts
  components/     # optional, template-specific interactions and ornaments
  hooks/          # optional, template-specific hooks
  sections/
```

Start from `src/templates/royal/` only where useful. Do not copy business logic
or Supabase access into a template. Templates are presentation only.

## 2. Theme Tokens

- Create `<template-id>/theme.ts`.
- Export `TemplateThemeTokens`.
- Wrap the root template in `TemplateThemeProvider`.
- Use `WeddingData.theme` only as an override layer; template defaults stay in
  the template folder.

## 3. Section Contracts

Import shared contracts from `src/templates/shared/sections/types.ts`:

```ts
import type { HeroSectionContract } from "@/templates/shared/sections/types";
```

New templates can keep bespoke section components, but props should match the
shared contracts so editor data stays stable.

Mapped sections must also use ids from
`src/templates/shared/sections/preview-ids.ts` so the editor live preview can
scroll to the active section:

```ts
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
```

Use the matching id on each section element, for example:

```tsx
<section id={PREVIEW_SECTION_IDS.events}>...</section>
```

## 4. Motion

- Import reusable presets from `src/templates/shared/motion/presets.ts`.
- Animate `transform` and `opacity` only on mobile.
- Respect `prefers-reduced-motion`.
- Keep cinematic interactions under 800ms unless there is a clear reason.

## 5. Registry & Routes

- Add the template to `src/templates/registry.ts`.
- Do **not** add separate card data to `src/data/templates.ts`; the template
  gallery is derived from the registry.
- Verify `/preview/<template-id>`.
- Verify `/template` preview/select buttons.
- Verify editor preview still renders with `TemplateRenderer`.

## 6. Mobile QA

Run the checklist in `docs/qa-mobile.md` before considering the template done.
Minimum checks:

- 360px viewport.
- Real Android.
- iPhone Safari.
- Public `/w/[slug]` after publish.

## 7. Commands

```bash
npm run lint
npm run build
npm run test:e2e -- --project=mobile-chrome
```

*(Note: Run the existing Playwright E2E suite to guarantee no regressions are introduced in existing templates or flows. You do not need to add any new test files or visual baseline snapshots for your new templates.)*

## Done When

- The template renders complete `WeddingData` without crashes.
- The template is previewable via `/preview/<template-id>`.
- It can be selected from `/template`.
- No database, auth, payment, or Zustand imports exist inside template files.
- Images use `next/image` with accurate `sizes`.
- Required preview ids are present for the editor scroll map.
- The existing E2E test suite runs and passes (no new tests are required).
