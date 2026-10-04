# Mobile QA runbook: ongoing coverage

Task 16 assessment and the authorized release are complete with recorded limits. User accepted the Preview without specifying device/browser details; preserve these unchecked cases as follow-ups. [Local evidence](task-16-verification.md) records public template/keyboard/browser checks and their limits. Authenticated editor/navigation and generated-media browser coverage pass across desktop/mobile Chrome/WebKit. Real devices, enlarged typography and broader provider/device formats remain manual checks. Broad checklist items are not passed by public-demo emulation alone. Use [pending verification](pending-verification.md), [polish contract](mobile-motion-theme-and-demos.md), [overlays](accessible-overlays.md) and [environment/CI](environment-and-ci.md) during verification and subsequent changes.

## Environments and routes

- [ ] 320/360/390px mobile widths, Android hardware/slow network, iPhone Safari, portrait/landscape, enlarged text/200% zoom, then desktop. Browser emulation does not confirm real keyboard/audio behavior.
- [ ] `/` and `/template`: one main h1, sensible sections, factual Free Beta/cap/three-template copy, labelled examples, preview/create/contact paths and reachable 44px controls.
- [ ] `/dashboard`: narrow owner cards, long couple names, stable copy/open actions and quota dialog; only owner working data.
- [ ] `/dashboard/invitations/[id]/edit`: all panels, errors/status wrapping, horizontal progress targets, desktop/mobile consistent action availability, preview containers and template typography scales.
- [ ] `/preview/royal`, `/preview/floral-elegance`, `/preview/royal-3d-cinema`: all three bespoke designs/legacy mapping, selected runtime/server content and request-supplied future demo calendar.
- [ ] `/w/[slug]`: frozen public content/metadata, owner private edits hidden, stable suffix, unpublish 404, opener/skip/reveal alternatives and tap-first music.
- [ ] Login/signup/OAuth/recovery: keyboard/errors/redirects and production allowlists, without inspecting personal live sessions.

## Keyboard, navigation and overlays

- [ ] 16px mobile fields avoid focus zoom; VisualViewport inset, toolbar movement, safe areas, keyboard opening/closing, rotation/pinch and unavailable API preserve active input/action visibility. Tune threshold if needed.
- [ ] Typing immediately followed by Dashboard/other invitation/Back/Forward/reload, save failure and discard/cancel; save acknowledgement before leave, no prompt when clean, explicit stale/expired/disabled recovery paths.
- [ ] Publish summary/field errors open relevant step/accordion, with real-vs-starter guidance/demo acknowledgement and optional content remaining optional.
- [ ] Radix initial/return focus, Tab loops, nested topmost Escape, labels/helper/errors/native selects and background/scroll isolation across crop/share/delete/unpublish/quota/navigation/gallery/mobile preview/openers.
- [ ] Gallery touch drag/buttons/keyboard, crop focus/zoom/arrows/cancel, all target sizes including scaled templates, removed triggers and rapid close/reopen.

## Media, motion and themes

- [ ] Direct signed image/audio flow uses disposable fixtures after provider authorization: hero 9:16, portraits 1:1, gallery 4:5/reorder, progress, size/format/HEIC/M4A cases, old URLs/replacement/cancellation/timeouts/late replies. See [upload configuration](cloudinary-uploads.md).
- [ ] Marquee actual pause/resume, hover/focus/explicit pause, resize seam/cleanup and live OS reduced-motion changes; static first-paint cards and native cursor under reduced motion.
- [ ] Static decorations/parallax/blur alternatives, opener/skip/reveal/poster/frame alternatives, tap-first audible music and actual pause; busy indicators still communicate work.
- [ ] Studio light/dark labels/input/card tokens; guest/editor template colors and photo-overlay text stay independent. Check image contrast, long Indic names/content, template zoom and portal/inline overlay inheritance on devices.
- [ ] Shared +90-day demo date at controlled reference/timezone/midnight/leap/year boundaries; SSR/hydration/freshness, starter dates saved once and user/past dates unchanged after editing/publication.

## Loading and public sharing

- [ ] Server content and selected chunks/CSS for every template, slow/error/reload behavior without lost edits, hero/gallery image sizing/lazy loading/layout shift and constrained-network media/frame behavior.
- [ ] Full immutable v1 archive validator, active/dynamic frames/posters/decor/default music/cache/range plus retained legacy media URLs. No historical asset deletion based on current imports.
- [ ] Shared OG → WhatsApp → hero → none resolver, existing crops/final share transform, explicit canonical staging/production origin, working/public difference and honest cache copy.
- [ ] Later authorized public HTTPS WhatsApp test uses a disposable invitation; local preview is insufficient and caches need not refresh immediately. Never share personal links without authorization.

Record real devices/browser versions/network/origin, evidence and blocked/skipped cases. Existing Playwright smoke projects are documented in environment-and-ci; there is no guarantee of regression-free behavior from running them alone. Consolidated test authoring, checks and any performance/visual tooling happen in task 16, not this runbook refresh.

## Device handoff after preview release

Use the latest PR #20 Preview URL recorded in task-16-verification.md, with a test account/disposable invitation. On an actual Android and iPhone: select/edit/save/reload each template; open keyboard and ensure fields/action bar stay reachable; publish then make a private edit and compare the guest link; republish/unpublish/re-publish without link changes. Cancel/retry photo and music replacement, then check crop, modal focus/close, gallery, scratch reveal/skip and tap-first music. Try enlarged text, rotation and both studio themes. The human may share the disposable link in WhatsApp and observe image/title/cache behavior. Record device/browser and failures; browser emulation is not a hardware pass. Real-user OAuth/recovery is also the user's manual gate.

Task 16 fixed a mobile grid min-content expansion from 320px to 486px that displaced fixed controls, restored mobile Unpublish availability and added stable field labels/descriptions and media remove/retry touch targets. No template was redesigned.
