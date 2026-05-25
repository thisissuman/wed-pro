---
name: create-template
description: "Procedural workflow to scaffold a new wedding invitation template under src/templates, register it once, and validate mobile performance. Use when adding templates like floral, minimal, modern, or classic."
paths: ["src/templates/**/*.{ts,tsx}"]
disable-model-invocation: false
---

# Create Template

## Prerequisites

- Read `docs/create-template-prompt.md` first. It is the source of truth for
  design intake, required preview ids, acceptance criteria, and the short master
  prompt used for repeatable template creation.
- Read `template-architecture` and `project-context` rules
- `WeddingData` type in `src/types/` is the single content contract
- Templates are presentation only: no Supabase, auth, payments, server actions,
  Zustand, or dashboard state inside `src/templates/<template-id>/`

## Checklist

```
- [ ] 1. Scaffold folder
- [ ] 2. Implement <Name>Template.tsx
- [ ] 3. Build sections with shared contracts + required preview ids
- [ ] 4. Theme tokens + TemplateThemeProvider
- [ ] 5. Motion presets (transform/opacity only)
- [ ] 6. Images, media validation, and lazy heavy sections
- [ ] 7. Register once in src/templates/registry.ts
- [ ] 8. Add /preview/<template-id> visual snapshot
- [ ] 9. Mobile QA
```

## Step 1 — Scaffold

```
src/templates/<template-id>/
  <Pascal>Template.tsx
  components/     # optional: template-specific intro, ornaments, effects
  hooks/          # optional: usePrefersReducedMotion
  sections/
    HeroSection.tsx
    CoupleSection.tsx
    CountdownSection.tsx
    BlessingSection.tsx
    EventsSection.tsx
    StorySection.tsx
    GallerySection.tsx
    VenueSection.tsx
    RsvpSection.tsx
    ThankYouSection.tsx
    MusicPlayer.tsx
  theme.ts
  config/         # optional static template config
```

## Step 2 — Root Template Component

```tsx
export function FloralTemplate({ data, isPreview }: TemplateProps) {
  const sections = withEssentialSections(data.sections);

  return (
    <TemplateThemeProvider defaultTheme={floralTheme} theme={data.theme}>
      {sections.showHero !== false && (
        <HeroSection
          couple={data.couple}
          countdown={data.countdown}
          hero={data.hero}
          weddingHashtag={data.weddingHashtag}
        />
      )}
      {/* ...render every content section from WeddingData */}
      <MusicPlayer music={data.music} />
    </TemplateThemeProvider>
  );
}
```

**Forbidden in templates:** `fetch`, Supabase client, auth, payments, Zustand imports.

## Step 3 — Sections

Recommended flow:

1. Hero / intro reveal (optional)
2. Couple reveal
3. Countdown
4. Blessing / invitation message
5. Events (Mehendi, Haldi, Wedding, Reception, Sangeet)
6. Story
7. Gallery
8. Venue (+ map CTA)
9. RSVP
10. Thank you

Sections live **inside** `src/templates/<id>/sections/` — bespoke styling is
expected. Each section should import its contract from
`src/templates/shared/sections/types.ts`.

For editor preview scroll sync, mapped sections must use ids from
`src/templates/shared/sections/preview-ids.ts`:

```tsx
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";

<section id={PREVIEW_SECTION_IDS.hero}>...</section>
```

## Step 4 — Shared Logic

Extract reusable logic to hooks in `src/hooks/` or `src/utils/` (e.g. `useWeddingCountdown`), not duplicated per section.

Use shared section contracts from `src/templates/shared/sections/types.ts` so new templates consume the same `WeddingData` slices without changing the editor.

Use `src/templates/shared/theme/ThemeProvider.tsx` and `src/templates/shared/theme/tokens.ts` for runtime CSS variables. Each template owns a local `theme.ts` with default `TemplateThemeTokens`; `WeddingData.theme` is an override layer, not a separate implementation path.

Shared UI in `src/templates/shared/components/` is optional. Use it when it
matches the design, but do not flatten premium templates into identical layouts.

## Step 5 — Motion

- Prefer presets from `src/templates/shared/motion/presets.ts`
- Framer Motion; `transform` + `opacity` only on mobile
- Respect `prefers-reduced-motion`
- Durations per animations rule (max 800ms)

## Step 6 — Performance

- `next/image` with `sizes` for all photos
- `next/dynamic` for Gallery, Maps (heavy sections)
- Countdown: server placeholder → client `useEffect` update
- Use `isValidDisplayUrl()` before rendering user-provided media URLs

## Step 7 — Register Once

Add one entry to `src/templates/registry.ts`. Do not edit `TemplateRenderer.tsx`
or `src/data/templates.ts`; the marketing gallery is derived from the registry.

```tsx
{
  id: "floral",
  name: "Floral Noor",
  description: "Soft florals and graceful motion for an intimate celebration.",
  thumbnail: "https://...",
  category: "floral",
  badge: "New",
  component: FloralTemplate,
}
```

## Step 8 — Preview & Marketing

- Verify `/preview/<template-id>` renders sample data
- Verify `/template` shows the card and its Preview/Select actions
- Add a visual regression case for `/preview/<template-id>` in
  `tests/e2e/visual-regression.spec.ts`, then create the baseline once with
  `--update-snapshots`

## Step 9 — Mobile QA

Verify on narrow viewport first: scroll performance, touch targets, image LCP, no layout shift.

## Done When

- Template renders full `WeddingData` without crashes on empty/partial data
- No DB or store coupling
- Registered in `src/templates/registry.ts` and previewable
- Card appears on `/template` through the registry-derived gallery
- Required `PREVIEW_SECTION_IDS` are present for live editor scroll sync
- Mobile QA checklist in `docs/qa-mobile.md` passes
