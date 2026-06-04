---
name: create-template
description: "Procedural workflow to scaffold a new wedding invitation template under src/templates, register it once, and validate mobile performance. Use when adding templates like floral, minimal, modern, or classic."
paths: ["src/templates/**/*.{ts,tsx}"]
disable-model-invocation: false
---

# Create Template

## Start

1. Read [`docs/create-new-template.md`](../../../docs/create-new-template.md) — doc map and scalability.
2. Read [`docs/create-template-prompt.md`](../../../docs/create-template-prompt.md) — design intake and master prompt text.
3. Follow this skill + [`docs/add-template.md`](../../../docs/add-template.md) for implementation.
4. Apply rules: `template-architecture`, `animations`, `performance`, `project-context`.

`WeddingData` in `src/types/` is the single content contract. Templates are presentation only.

## Checklist

```
- [ ] 1. Scaffold folder under src/templates/<template-id>/
- [ ] 2. theme.ts + <Name>Template.tsx (ThemeProvider, withEssentialSections, visibility)
- [ ] 3. Sections: contracts + PREVIEW_SECTION_IDS on mapped sections
- [ ] 4. isValidDisplayUrl + next/image + sizes; countdown mounted guard
- [ ] 5. Motion presets; prefers-reduced-motion; cinematic components only if in spec
- [ ] 6. MusicPlayer (isPreview, suppressMusicPlayer; optional resolveMusicPlayback)
- [ ] 7. Register once in src/templates/registry.ts
- [ ] 8. lint, build, test:e2e --project=mobile-chrome + docs/qa-mobile.md
```

Do **not** add Playwright visual snapshot baselines for new templates.

## Step 1 — Scaffold

```
src/templates/<template-id>/
  <Pascal>Template.tsx
  theme.ts
  components/     # optional
  hooks/          # optional
  sections/
    HeroSection.tsx … ThankYouSection.tsx, MusicPlayer.tsx
```

## Step 2 — Root template

```tsx
export function FloralTemplate({ data, isPreview, suppressMusicPlayer }: TemplateProps) {
  const sections = withEssentialSections(data.sections);
  const music = resolveMusicPlayback(data.music); // optional

  return (
    <TemplateThemeProvider
      defaultTheme={floralTheme}
      theme={data.theme}
      typographyScale={data.typography?.scale ?? "default"}
    >
      {sections.showHero !== false && (
        <HeroSection couple={data.couple} countdown={data.countdown} hero={data.hero} … />
      )}
      {/* …other sections… */}
      {!suppressMusicPlayer && <MusicPlayer music={music} isPreview={isPreview} />}
    </TemplateThemeProvider>
  );
}
```

**Forbidden:** `fetch`, Supabase, auth, payments, Zustand in `src/templates/<id>/`.

## Step 3 — Sections

Story order (flexible visually): intro → hero → couple → countdown → blessing → events → story → gallery → venue → RSVP → thank you.

Bespoke UI in `sections/`; props from `src/templates/shared/sections/types.ts`.

```tsx
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
<section id={PREVIEW_SECTION_IDS.hero}>…</section>
```

## Step 4 — Shared infrastructure

- Theme: `TemplateThemeProvider`, `tokens.ts`, per-template `theme.ts`.
- Motion: `src/templates/shared/motion/presets.ts`.
- Media: `isValidDisplayUrl` from `@/lib/media-url`.
- Shared infrastructure: Use the shared reusable `InvitationOpener` from `src/components/invitation-opener` (supporting 8 visual variants and dynamic monograms) for entrance reveals.
- Royal-only components (copy only when spec asks): `WeddingDateScratchReveal`, `SparkleOverlay`, `LoveShowerBackground` under `src/templates/royal/components/`.

## Step 5 — Register

One entry in `src/templates/registry.ts`. Do not edit `TemplateRenderer` routing or `src/data/templates.ts`.

## Step 6 — Verify

```bash
npm run lint
npm run build
npm run test:e2e -- --project=mobile-chrome
```

- `/preview/<template-id>` with sample data
- `/template` card preview/select
- Editor preview scroll sync
- [`docs/qa-mobile.md`](../../../docs/qa-mobile.md)

## Done when

- Renders full `WeddingData` safely (empty/partial fields).
- Registered and previewable; no store/DB coupling.
- Required `PREVIEW_SECTION_IDS` present.
- Existing E2E passes; mobile QA done.
