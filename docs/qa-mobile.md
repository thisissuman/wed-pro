# Mobile QA & Performance Baseline

Use this checklist before shipping a template, editor polish pass, or public
invitation change. Mobile is the primary experience.

## Devices / Viewports

- [ ] 360 × 800 Android-sized viewport in browser devtools.
- [ ] Real low-end or mid-range Android device.
- [ ] iPhone Safari.
- [ ] Desktop at 1440px after mobile passes.

## Routes To Check

| Route | What to verify |
|-------|----------------|
| `/` | No horizontal scroll; CTA buttons are at least 44px tall; Free Beta copy is visible. |
| `/template` | Template card preview/select buttons are easy to tap; draft-limit dialog does not clip. |
| `/dashboard` | Invitation cards fit one column; publish/copy actions remain reachable. |
| `/dashboard/invitations/[id]/edit` | Step navigation is thumb-friendly; keyboard does not hide active inputs; autosave badge remains visible. |
| `/preview/royal` | Demo loads quickly; no editor chrome; motion does not block scroll. |
| `/w/[slug]` | Hero LCP is acceptable; curtain intro can be dismissed; scratch reveal works with touch; WhatsApp CTA opens. |

## Public Invitation Performance

- [ ] Hero image uses `next/image` with `priority` only for the LCP image.
- [ ] Gallery images use lazy loading with accurate `sizes`.
- [ ] Music does not autoplay silently on mobile; player is tap-first.
- [ ] Animations use `transform` and `opacity` only.
- [ ] `prefers-reduced-motion` disables cinematic intro/scratch where appropriate.
- [ ] No layout shift when couple photos, gallery, or venue images load.

## Image Upload Guidance

- [ ] Hero/background images: compressed, landscape, under 8 MB.
- [ ] Couple portraits: square or portrait crop, under 8 MB.
- [ ] Gallery: compressed WebP/JPEG, meaningful alt/caption where possible.
- [ ] Music: MP3/M4A, under 12 MB.
- [ ] Cloudinary upload preset limits file size and formats.

## Commands

```bash
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e -- --project=mobile-chrome
```

Optional local Lighthouse check after running `npm run build && npm run start`:

```bash
npx lighthouse http://127.0.0.1:3000/preview/royal --preset=desktop
```

For real public invite testing, use a published `/w/[slug]` URL and share it into
WhatsApp to inspect the link preview.
