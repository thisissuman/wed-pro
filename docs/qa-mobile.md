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
| `/w/[slug]` | Hero LCP is acceptable; curtain intro can be dismissed; tap-to-reveal date works; WhatsApp CTA opens. |
| `/login`, `/signup` | No extra top gap; duplicate-email message is clear; Google sign-in works on production. |

## Public Invitation Performance

- [ ] Hero image uses `next/image` with `priority` only for the LCP image.
- [ ] Gallery images use lazy loading with accurate `sizes`.
- [ ] Music does not autoplay silently on mobile; player is tap-first.
- [ ] Animations use `transform` and `opacity` only.
- [ ] `prefers-reduced-motion` disables cinematic intro/scratch where appropriate.
- [ ] No layout shift when couple photos, gallery, or venue images load.

## Image Upload Guidance

All editor uploads use the in-app crop dialog + progress bar (`CroppedImageUploadField` / `AudioUploadField`), not the Cloudinary widget.

- [ ] Hero background: crop **9:16** (not squashed); fills hero with `object-cover`; under 8 MB; progress bar completes.
- [ ] Re-upload hero if an older build saved a square-distorted file — crop now preserves aspect ratio.
- [ ] WhatsApp preview mock uses landscape OG crop (`1200×630`) from hero via Cloudinary transform.
- [ ] Couple portraits: **1:1** crop; under 8 MB.
- [ ] Gallery: **4:5** crop; max 12 photos; reorder arrows animate like Events.
- [ ] Music: MP3/M4A via upload field; under 12 MB; progress bar completes.
- [ ] On mobile: tap Upload → **Photos** or **Files** (system picker).

## Light theme (real device)

- [ ] Toggle light theme on **physical Android** (not only devtools): dashboard + editor labels, inputs, and step titles are readable on white surfaces.
- [ ] Editor cards use `--editor-card-bg` / `--editor-field-*` tokens (no invisible ivory-on-white text).

## Editor polish

- [ ] Typography scale (Small / Default / Large) changes **all** invite text in live preview (hero names, RSVP, thank you, events).
- [ ] Live Preview music button: first open may autoplay muted once; **tap unmutes** or pauses correctly.
- [ ] Events, Love Story, and Gallery reorder use up/down arrows with layout animation.
- [ ] Sonner toasts: gold/royal pill style (`rounded-full`), not default green/white.

## Production share test

After publish, share `https://wed-pro.vercel.app/w/your-slug` in WhatsApp (not localhost).
Set `NEXT_PUBLIC_SITE_URL=https://wed-pro.vercel.app` on Vercel.

## Commands

```bash
npm run lint
npm run build
npm run test:e2e -- --project=mobile-chrome
```

*(Note: Run the existing E2E suite to guarantee no regressions are introduced in existing templates or flows. You do not need to add any new visual screenshot baseline tests for new templates; writing new visual tests is deferred.)*

Optional local Lighthouse check after running `npm run build && npm run start`:

```bash
npx lighthouse http://127.0.0.1:3000/preview/royal --preset=desktop
```

For real public invite testing, use a published `/w/[slug]` URL and share it into
WhatsApp to inspect the link preview.
