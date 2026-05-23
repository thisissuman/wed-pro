---
name: create-template
description: "Procedural workflow to scaffold a new wedding invitation template under src/templates, wire TemplateRenderer, and validate mobile performance. Use when adding templates like royal, modern, or classic."
paths: ["src/templates/**/*.{ts,tsx}"]
disable-model-invocation: false
---

# Create Template

## Prerequisites

- Read `template-architecture` and `project-context` rules
- `WeddingData` type in `src/types/` is the single content contract

## Checklist

```
- [ ] 1. Scaffold folder
- [ ] 2. Implement <Name>Template.tsx
- [ ] 3. Build sections (storytelling order)
- [ ] 4. Theme/config (MVP: template-local tokens OK)
- [ ] 5. Motion (transform/opacity only)
- [ ] 6. Images & lazy sections
- [ ] 7. Register in TemplateRenderer
- [ ] 8. Wire preview route if needed
- [ ] 9. Mobile QA
```

## Step 1 — Scaffold

```
src/templates/<template-id>/
  <Pascal>Template.tsx
  sections/
    HeroSection.tsx
    CountdownSection.tsx
    BlessingSection.tsx
    EventsSection.tsx
    CoupleSection.tsx
    StorySection.tsx
    GallerySection.tsx
    RSVPSection.tsx
    VenueSection.tsx
    ThankYouSection.tsx
  theme/          # optional colors, fonts
  config/         # optional static template config
```

## Step 2 — Root Template Component

```tsx
export function RoyalTemplate({ data }: { data: WeddingData }) {
  return (
    <main>
      <HeroSection data={data} />
      {/* ...sections in storytelling order */}
    </main>
  );
}
```

**Forbidden in templates:** `fetch`, Supabase client, auth, payments, Zustand imports.

## Step 3 — Sections

Recommended flow:

1. Hero / intro reveal (optional)
2. Countdown
3. Blessing / invitation message
4. Events (Mehendi, Haldi, Wedding, Reception, Sangeet)
5. Couple / story
6. Gallery
7. RSVP
8. Venue (+ map CTA)
9. Thank you

Sections live **inside** `src/templates/<id>/sections/` — bespoke styling allowed.

## Step 4 — Shared Logic

Extract reusable logic to hooks in `src/hooks/` or `src/utils/` (e.g. `useWeddingCountdown`), not duplicated per section.

## Step 5 — Motion

- Framer Motion; `transform` + `opacity` only on mobile
- Respect `prefers-reduced-motion`
- Durations per animations rule (max 800ms)

## Step 6 — Performance

- `next/image` with `sizes` for all photos
- `next/dynamic` for Gallery, RSVP forms, Maps
- Countdown: server placeholder → client `useEffect` update

## Step 7 — Register Renderer

In `src/templates/TemplateRenderer.tsx`, map `template_id` string to component:

```tsx
const TEMPLATES = {
  royal: RoyalTemplate,
  // <template-id>: <Pascal>Template,
} as const;
```

## Step 8 — Preview & Marketing

- Ensure `/preview/[templateId]` (or project equivalent) renders this template
- Link preview buttons from template picker UI

## Step 9 — Mobile QA

Verify on narrow viewport first: scroll performance, touch targets, image LCP, no layout shift.

## Done When

- Template renders full `WeddingData` without crashes on empty/partial data
- No DB or store coupling
- Registered in `TemplateRenderer` and previewable
