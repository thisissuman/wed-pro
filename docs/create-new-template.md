# Create a New Template (Start Here)

Use this page when adding template #2 and beyond. The platform is built so you can ship **many templates without rewriting** editor, auth, publish, or `/w/[slug]` — only `src/templates/<template-id>/` changes.

## Can I build 10 templates without a rewrite?

**Yes.** Register each template once in [`src/templates/registry.ts`](../src/templates/registry.ts). The same `WeddingData` schema powers the editor, preview, DB `content` JSONB, and public pages. Bespoke layout, fonts, colors, and motion per template are expected; shared **contracts** and **preview section ids** keep the editor stable.

Do **not** refactor the core app for each template. Optional later wins (not blockers for template #2): lazy-load registry entries, guest-side Cloudinary width transforms.

## Which file do I use?

| File | Role |
|------|------|
| [`master-prompt.html`](../master-prompt.html) | Short copy-paste prompt for a **new Cursor chat** |
| [`docs/create-template-prompt.md`](./create-template-prompt.md) | Design intake fields + full prompt text (markdown) |
| [`docs/add-template.md`](./add-template.md) | Implementation checklist (scaffold → registry → QA) |
| [`.cursor/skills/create-template/SKILL.md`](../.cursor/skills/create-template/SKILL.md) | Agent step-by-step procedure |
| [`.cursor/rules/template-architecture.mdc`](../.cursor/rules/template-architecture.mdc) | Presentation-only rules (auto-applies under `src/templates/`) |
| [`.cursor/rules/animations.mdc`](../.cursor/rules/animations.mdc) | Motion limits + Royal cinematic kit reference |
| [`.cursor/rules/performance.mdc`](../.cursor/rules/performance.mdc) | Images, bundles, hydration |
| [`docs/qa-mobile.md`](./qa-mobile.md) | Manual mobile checklist before shipping |

## Workflow (human or Cursor)

1. Open **`master-prompt.html`** (or copy from `create-template-prompt.md`).
2. Fill the design spec: `template-id`, colors, fonts, section order, signature motion.
3. Point Cursor at the files in the table above (the master prompt does this for you).
4. Follow **`add-template.md`** while implementing.
5. Run verification commands (below) + **`qa-mobile.md`** on `/preview/<id>` and a published `/w/[slug]`.

## Reference implementation

Copy **patterns** from [`src/templates/royal/`](../src/templates/royal/), not every file:

| Pattern | Royal example | Required for every template? |
|---------|---------------|------------------------------|
| Orchestrator + visibility | `RoyalTemplate.tsx` | Yes |
| Theme tokens + provider | `theme.ts`, `typographyScale` on `TemplateThemeProvider` | Yes |
| Section contracts + preview ids | `sections/*`, `PREVIEW_SECTION_IDS` | Yes (mapped sections) |
| Safe media URLs | `isValidDisplayUrl()` in hero/gallery/couple | Yes for user images |
| Countdown hydration | `CountdownSection` — `mounted` before live numbers | Yes if you show countdown |
| Default music fallback | `resolveMusicPlayback()` from `@/lib/default-music` | Optional |
| Invitation opener / scratch date / sparkles | `InvitationOpener` from `src/components/invitation-opener` | **Only if in your design spec** |
| Love-shower ambient background | `LoveShowerBackground` | **Royal-only unless you want it** |

## What changed after the template docs (May 2026 polish)

Commits after the original template-doc pass (`feat/mobile-qa`, `feat/polish`, auth/audio fixes) — **no architecture rewrite**, but docs and Royal behavior updated:

- **Editor uploads:** `CroppedImageUploadField` / `AudioUploadField` (crop aspects 9:16 hero, 1:1 couple, 4:5 gallery) — editor only; templates just render URLs.
- **Typography scale:** `data.typography.scale` → `TemplateThemeProvider` zoom — works for any template using the shared provider.
- **Music:** `resolveMusicPlayback()` + muted autoplay with tap-to-unmute; honor `isPreview` and `suppressMusicPlayer` on `TemplateProps`.
- **Share / OG:** Hero upload syncs `seo.ogImage`; public metadata via `buildInvitationShareMetadata` — unchanged per template.
- **E2E:** Functional smoke in `tests/e2e/free-beta.spec.ts` (homepage, gallery, `/preview/royal`). **No** per-template visual screenshot baselines (removed — flaky across OS). **Do not add** new visual regression tests for new templates; run existing `npm run test:e2e`.

## Verification

```bash
npm run lint
npm run build
npm run test:e2e -- --project=mobile-chrome
```

Manual: [`docs/qa-mobile.md`](./qa-mobile.md) — replace `royal` with your `template-id` where routes are listed.

## Done when

- `/preview/<template-id>` and `/template` card work.
- Editor live preview scrolls via `PREVIEW_SECTION_IDS`.
- No Supabase/auth/Zustand inside `src/templates/`.
- Existing E2E suite passes (no new snapshot tests required).
