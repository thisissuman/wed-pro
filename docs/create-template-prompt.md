# Create Template Prompt

**Start here:** [`docs/create-new-template.md`](./create-new-template.md) — doc map, scalability, and what changed after the May 2026 polish pass.

Use this file for the **design intake** and **copy-paste master prompt** when creating a sellable template from Figma, screenshots, or a brief. Implementation steps are in [`docs/add-template.md`](./add-template.md).

## Short master prompt

Paste into a fresh Cursor chat (same text as [`master-prompt.html`](../master-prompt.html)):

```text
Create Vivaha Studio template "<template-id>" from my design spec.

Read: docs/create-new-template.md, docs/add-template.md, .cursor/skills/create-template/SKILL.md, .cursor/rules/template-architecture.mdc, .cursor/rules/animations.mdc, .cursor/rules/performance.mdc.

Design spec:
- Source: <Figma / screenshots / brief>
- Name: <display name>
- Category: <royal|floral|minimal|modern>
- Colors: <primary, background, text, accent>
- Fonts: <heading, body — or use existing CSS variables>
- Section order: <list>
- Signature motion: <e.g. fade-up sections, horizontal gallery, curtain intro, none>
- Thumbnail URL: <https://...>

Rules:
- Presentation only in src/templates/<template-id>/ — no Supabase, auth, Zustand, payments.
- WeddingData + section contracts from src/templates/shared/sections/types.ts.
- PREVIEW_SECTION_IDS on hero, couple, countdown, events, story, gallery, venue, rsvp.
- Register once in src/templates/registry.ts (gallery auto-wires).
- TemplateThemeProvider + local theme.ts; pass typographyScale from data.typography.
- withEssentialSections(data.sections) + visibility flags like RoyalTemplate.
- isValidDisplayUrl() before user images; next/image + sizes; countdown mounted guard.
- MusicPlayer: honor isPreview and suppressMusicPlayer; optional resolveMusicPlayback().
- Cinematic extras (intro, scratch date, sparkles) only if listed in signature motion.
- Do not add Playwright visual snapshot tests. Run: npm run lint, npm run build, npm run test:e2e -- --project=mobile-chrome.

Branch: feat/<template-id>-template.
```

## Design intake

Provide as much as possible before generation:

| Field | Notes |
|-------|-------|
| `template-id` | Kebab-case id for routes and DB, e.g. `floral-noor`. |
| Display name | User-facing card name on `/template`. |
| Category | `royal`, `floral`, `minimal`, `modern` (extend registry category if needed). |
| Source | Figma link, screenshots, moodboard, or written brief. |
| Thumbnail URL | Public HTTPS image for the template card. |
| Color tokens | Primary, background, surface, text, muted, accent. |
| Fonts | Heading/body; prefer existing root font variables unless a new font is intentional. |
| Section order | Visual order may differ; still consume the same `WeddingData` slices. |
| Signature motion | Reveals, gallery behavior, intro, music treatment — **list only what you want built**. |
| Reduced motion | How cinematic effects degrade when `prefers-reduced-motion` is on. |
| Non-goals | New editor fields, payments, auth, guest DB, or template-specific business logic. |

## Architecture rules

- Templates are **presentation only** — no Supabase, auth, payments, server actions, dashboard state, or Zustand under `src/templates/`.
- Every template uses `TemplateProps`: `data`, optional `isPreview`, optional `suppressMusicPlayer` (editor publish flow).
- Sections use contracts from `src/templates/shared/sections/types.ts`.
- Theme: `TemplateThemeProvider` + `<template-id>/theme.ts`; `WeddingData.theme` is overrides only.
- User media: `isValidDisplayUrl()` from `@/lib/media-url` before `next/image` or `<img>`.
- Shared atoms in `src/templates/shared/components/` are optional — do not flatten distinct templates.

## Royal reference (patterns, not a full copy)

Use `src/templates/royal/` for structure:

- `withEssentialSections(data.sections)` and per-section visibility flags.
- `typographyScale={data.typography?.scale ?? "default"}` on `TemplateThemeProvider`.
- `resolveMusicPlayback(data.music)` if you want the bundled default track when the couple uploads nothing.
- Cinematic components (`InvitationOpener` [reusable from `src/components/invitation-opener`], `WeddingDateScratchReveal`, `SparkleOverlay`, `LoveShowerBackground`) are Royal-specific unless your design spec asks for equivalents.

## Preview section IDs

Use constants from `src/templates/shared/sections/preview-ids.ts`:

| Editor panel | Section id |
|--------------|------------|
| Page setup / media / wedding details | `PREVIEW_SECTION_IDS.hero` |
| Couple details | `PREVIEW_SECTION_IDS.couple` |
| Countdown | `PREVIEW_SECTION_IDS.countdown` |
| Events | `PREVIEW_SECTION_IDS.events` |
| Story | `PREVIEW_SECTION_IDS.story` |
| Gallery | `PREVIEW_SECTION_IDS.gallery` |
| Venue | `PREVIEW_SECTION_IDS.venue` |
| RSVP | `PREVIEW_SECTION_IDS.rsvp` |

Blessing and Thank You are not in the editor scroll map today.

## Registry

```tsx
import { FloralNoorTemplate } from "./floral-noor/FloralNoorTemplate";

{
  id: "floral-noor",
  name: "Floral Noor",
  description: "…",
  thumbnail: "https://…",
  category: "floral",
  badge: "New",
  component: FloralNoorTemplate,
}
```

Do not duplicate cards in `src/data/templates.ts` — the gallery reads the registry.

## Motion and media

- Framer Motion; on mobile animate `transform` and `opacity` only.
- Presets: `src/templates/shared/motion/presets.ts`.
- Max cinematic duration 800ms; respect `prefers-reduced-motion`.
- `next/image` with accurate `sizes`; countdown uses client `mounted` guard (see Royal `CountdownSection`).

## Testing

- **Do not** add per-template Playwright visual baselines (removed — flaky across macOS vs Linux CI).
- **Do** run the existing suite:

```bash
npm run lint
npm run build
npm run test:e2e -- --project=mobile-chrome
```

Manual: [`docs/qa-mobile.md`](./qa-mobile.md).

## Done when

- `/preview/<template-id>`, `/template` card, and editor `TemplateRenderer` preview work.
- Required preview ids present; no forbidden imports in `src/templates/`.
- Existing E2E passes; mobile QA done for your template id.
