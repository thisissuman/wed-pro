# Create Template Prompt

Use this when creating a new sellable invitation template from Figma, screenshots,
or a written visual brief. Keep the editor schema stable; only the presentation
inside `src/templates/<template-id>/` should change.

## Short Master Prompt

Paste this into a fresh Cursor chat and fill the bracketed values:

```text
Create Vivaha Studio template "<template-id>" from my design spec.

Read and follow: docs/create-template-prompt.md, .cursor/skills/create-template/SKILL.md, .cursor/rules/template-architecture.mdc, .cursor/rules/animations.mdc, .cursor/rules/performance.mdc.

Design spec:
- Source: <Figma link, screenshots, or written brief>
- Name: <display name>
- Category: <royal|floral|minimal|modern>
- Colors: <primary, background, text, accent>
- Fonts: <heading, body>
- Section order: <list>
- Signature motion: <e.g. fade-up sections, horizontal gallery, curtain reveal, none>
- Thumbnail URL: <https://...>

Rules:
- Use WeddingData + shared section contracts only; no Supabase/auth/Zustand in src/templates/.
- Bespoke UI belongs in src/templates/<template-id>/sections/ and optional components/.
- Use PREVIEW_SECTION_IDS on mapped sections so editor live-preview scroll works.
- Register once in src/templates/registry.ts; /template gallery auto-wires.
- Mirror RoyalTemplate: TemplateThemeProvider, withEssentialSections, visibility flags, MusicPlayer.
- Use next/image + sizes, safe media URL checks, transform/opacity motion, and prefers-reduced-motion.
- (No new visual tests or baseline snapshots are required for new templates).

Branch: feat/<template-id>-template. Run lint, build, and test:e2e --project=mobile-chrome when done to verify existing flows.
```

## Design Intake

Provide as much of this as possible before generation:

| Field | Notes |
|-------|-------|
| `template-id` | Kebab-case id used in routes and DB, e.g. `floral-noor`. |
| Display name | User-facing card name in `/template`. |
| Category | Existing values: `royal`, `floral`, `minimal`, `modern`. |
| Source | Figma link, screenshots, moodboard images, or written design brief. |
| Thumbnail URL | Public HTTPS image for the template card. |
| Color tokens | Primary, secondary, accent, background, surface, text, muted text. |
| Fonts | Heading/body choice. Prefer existing root font variables unless a new font is intentional. |
| Section order | Can differ visually, but must still consume the same `WeddingData` slices. |
| Signature motion | Interactions, reveals, gallery behavior, intro, music treatment. |
| Reduced motion | How cinematic effects degrade when `prefers-reduced-motion` is enabled. |
| Non-goals | New editor fields, payments, auth, guest database, or template-specific business logic. |

## Architecture Rules

- Templates are presentation only. Do not import Supabase clients, auth helpers,
  payment code, server actions, dashboard state, or Zustand stores.
- Every template consumes `WeddingData` through `TemplateProps`.
- Every section should use contracts from
  `src/templates/shared/sections/types.ts`.
- Runtime theme values come from `TemplateThemeProvider` and local
  `<template-id>/theme.ts`.
- Shared UI atoms in `src/templates/shared/components/` are optional helpers.
  Use them when they match the design; do not make different templates look the
  same just to reuse code.
- User-provided media must be checked with `isValidDisplayUrl()` before rendering.
- Heavy gallery/map sections should stay lazy or lightweight enough for low-end
  Android.

## Required Files

```text
src/templates/<template-id>/
  <PascalTemplate>.tsx
  theme.ts
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
  components/     # optional, template-specific interactions
  hooks/          # optional
```

Root orchestrator checklist:

- Wrap with `TemplateThemeProvider`.
- Call `withEssentialSections(data.sections)`.
- Honor all section visibility flags.
- Pass only the relevant `WeddingData` slice to each section.
- Render `MusicPlayer` from `data.music`.
- Accept and pass through `isPreview` where template-specific preview behavior
  is needed.

## Preview Section IDs

The editor uses these DOM ids to scroll the live preview. Use the constants from
`src/templates/shared/sections/preview-ids.ts`; do not retype raw strings in new
templates.

| Editor panel | Required section id |
|--------------|---------------------|
| Page setup / media / wedding details | `PREVIEW_SECTION_IDS.hero` |
| Couple details | `PREVIEW_SECTION_IDS.couple` |
| Countdown | `PREVIEW_SECTION_IDS.countdown` |
| Events | `PREVIEW_SECTION_IDS.events` |
| Story | `PREVIEW_SECTION_IDS.story` |
| Gallery | `PREVIEW_SECTION_IDS.gallery` |
| Venue | `PREVIEW_SECTION_IDS.venue` |
| RSVP | `PREVIEW_SECTION_IDS.rsvp` |

Example:

```tsx
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";

export function EventsSection({ events }: EventsSectionContract) {
  return <section id={PREVIEW_SECTION_IDS.events}>{/* bespoke UI */}</section>;
}
```

Blessing and Thank You are not mapped by the editor today. Add them only if the
editor gets matching navigation targets.

## Registry

Register the template once in `src/templates/registry.ts`:

```tsx
import { FloralNoorTemplate } from "./floral-noor/FloralNoorTemplate";

const registry: TemplateRegistryEntry[] = [
  // existing templates...
  {
    id: "floral-noor",
    name: "Floral Noor",
    description: "Soft florals and graceful motion for an intimate celebration.",
    thumbnail: "https://...",
    category: "floral",
    badge: "New",
    component: FloralNoorTemplate,
  },
];
```

Do not add a second card entry in `src/data/templates.ts`; the gallery derives
from the registry.

## Motion And Media

- Use Framer Motion only.
- On mobile, animate `transform` and `opacity`; avoid layout, blur, and heavy
  shadow animation.
- Keep standard transitions between 200-400ms and cinematic reveals below 800ms.
- Respect `prefers-reduced-motion`.
- Use `next/image` with accurate `sizes`.
- Use real aspect-ratio containers for lazy images to avoid CLS.
- Music must be tap-first; do not rely on mobile autoplay.

## Visual Regression

*(Note: You do not need to add any new visual regression tests or baseline snapshots for your new templates. However, the existing Playwright E2E suite must always be run and pass to ensure existing templates/features remain fully functional.)*

## Verification

```bash
npm run lint
npm run build
npm run test:e2e -- --project=mobile-chrome
```

Also run the manual mobile checklist in `docs/qa-mobile.md` before shipping a
template to users.

## Done When

- `/preview/<template-id>` renders sample data.
- `/template` shows the template card, preview button, and select button.
- Editor preview renders through `TemplateRenderer` without route-specific code.
- Required preview ids are present.
- No template file imports database, auth, payments, dashboard state, or Zustand.
- All user-provided media uses safe URL checks before rendering.
- The existing E2E test suite runs and passes successfully (no new tests need to be added).
