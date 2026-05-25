# Add A New Template

Use this checklist when adding the next two designs. The goal is to add visual
variety without changing editor, auth, publish, or public route logic.

## 1. Scaffold

```text
src/templates/<template-id>/
  <PascalTemplate>.tsx
  theme.ts
  components/
  hooks/
  sections/
```

Start from `src/templates/royal/` only where useful. Do not copy business logic
or Supabase access into a template.

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

## 4. Motion

- Import reusable presets from `src/templates/shared/motion/presets.ts`.
- Animate `transform` and `opacity` only on mobile.
- Respect `prefers-reduced-motion`.
- Keep cinematic interactions under 800ms unless there is a clear reason.

## 5. Registry & Routes

- Add the template to `src/templates/registry.ts`.
- Add its card data to `src/data/templates.ts`.
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
npx playwright install chromium
npm run test:e2e -- --project=mobile-chrome
```

## Done When

- The template renders complete `WeddingData` without crashes.
- The template is previewable via `/preview/<template-id>`.
- It can be selected from `/template`.
- No database, auth, payment, or Zustand imports exist inside template files.
- Images use `next/image` with accurate `sizes`.
