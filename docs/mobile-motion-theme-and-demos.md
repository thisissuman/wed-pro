# Mobile, motion, invitation themes and demo dates

Task 13: implemented; verification deferred. The three designs retain their existing layouts, reveal/skip interactions and tap-first music controls. No browser, keyboard, visual, device or automated checks have run for this change.

## Controls and layout

Marketing pages keep one primary page h1, with section/footer headings below it. Navigation, footer links, shared buttons and dialog close/actions have at least 44px hit areas. Editor actions and invitation buttons also have scoped minimum sizes; template zoom compensates the hit-area minimum so shrinking typography does not shrink the target below 44px.

The editor's nine progress strokes sit inside 44px buttons in a horizontally scrollable row, retaining their visual stroke and completed/current state. Header titles and status/errors can wrap. Shared text fields, textareas and selects use 16px mobile text to avoid iOS input-focus zoom, with the existing smaller desktop size. Template text wraps long words/names within the preview width; hero content has an explicit bounded width. Existing gallery navigation, touch/drag and music behavior remain in place.

With VisualViewport available, `useEditorKeyboardInset` measures keyboard coverage while a form field in the editor has focus. It moves the mobile action bar above that coverage, adds document space for it and brings the active field into view. Small viewport/browser-chrome changes are ignored (150px threshold). Without that API the existing normal viewport/safe-area layout remains. This is a progressive implementation; real-device keyboard, zoom, rotation and viewport behavior are pending task 16.

## Motion contract

Root MotionPreferences uses Framer Motion's user reduced-motion setting. The illustrative example-card marquee uses a MotionValue and playback controls: Pause/Resume calls actual pause/play on the animation, and hover/focus within the track pauses temporarily without clearing an explicit pause. Resize restarts the loop using measured card/gap distance; it respects the current pause state. Repeated cards are hidden from assistive technology.

Reduced-motion CSS makes the first set of example cards static and wrapping, hides repeated copies/fades and removes the pause control. This applies before client preference effects settle. Reduced-motion users retain the native pointer; decorative cursor motion is not mounted. Marketing parallax/tilt and character blur entrances have static alternatives. Decorative ping/bounce and studio edge glow stop; useful busy indicators remain. Programmatic section/preview scrolling respects the current OS preference.

Shared invitation opening completes immediately after the open/skip interaction under reduced motion, and its perpetual hint becomes static. Royal/Floral particle CSS already provides a static reduced-motion arrangement; Cinema's existing poster/frame/skip and scratch/reveal alternatives are preserved. Music still requires the existing guest interaction, and pause still pauses actual audio.

## Theme boundary

TemplateThemeProvider marks each invitation with `.template-theme`, owns `--template-*` tokens and scopes legacy semantic color variables to that palette. Studio `.light` utility overrides explicitly exclude template descendants. Template surfaces/text therefore use their own defaults or saved WeddingData.theme, independent of the studio toggle. Scoped template/media styles and inline template overlays retain those variables; app dialogs/chrome remain studio themed.

Photo heroes have separate `--template-on-image` / `--template-on-image-muted` text tokens, so changing studio mode or base invitation text does not turn photo-overlay names dark. Uploaded images and the saved overlay-opacity control are preserved. Marketing card image captions use a separate `.on-image` boundary for the same reason. These boundaries prevent theme leakage; contrast against arbitrary user images/colors still needs the final visual review.

## Demo calendar and rendering

`src/lib/demo-dates.ts` is the single calculator. A supplied ISO reference determines a wedding day 90 UTC calendar days ahead, sample event days at -3/-2/-1/0/+1, a 19:30 Asia/Kolkata demo countdown and an explicitly UTC-formatted marketing date.

`sampleWeddingData` is a date-free content scaffold. Render demos through `createDemoWeddingData(referenceIso)` rather than rendering that scaffold directly. The template preview route computes the calendar on the server per request and serializes WeddingData. The homepage computes its illustration date on the server, serialized with its existing hourly revalidation. Client rendering never recomputes a new demo calendar from the browser clock. Invitation creation uses the same calculator once for its starter wedding day and retains its existing 19:00 starter event/countdown time.

Normalization/autosave/publication do not advance saved invitation dates. User-entered or previously saved dates, including past weddings, remain intact. Missing/invalid draft dates render an announced-later label or a non-NaN countdown. Date labels use the shared explicit-timezone formatter (UTC for date-only events, saved countdown timezone/default Asia/Kolkata for heroes/Cinema); invalid timezone fallback is also explicit, independent of host timezone.

No existing date-dependent test expectation required an update for these sample dates. Test authoring and execution are deferred to task 16.

## Deferred cases

Task 16 owns narrow 320/360/390px screens, 200% zoom, enlarged text, long Latin/Indic names, URLs, stories, event/venue text, error wrapping, all editor steps, progress targets/scroll/focus, portrait/landscape, sticky controls/safe areas, nested crop/share/gallery/mobile previews, template typography scales and preview containment. Include iOS Safari/Android keyboards, input focus/scroll, toolbar movement, VisualViewport missing, pinch zoom and rotation; tune the keyboard heuristic if required.

Verify actual marquee Pause/Resume, hover/focus pause and retained explicit pause, resize loop/seam, preference changes while running, CSS first paint, static reduced-motion cards, animation cleanup/unmount, native cursor, character text readability, opener/skip/reveal/frame/poster alternatives and tap-first audio/play/pause. Check busy indicators still communicate work.

Verify light/dark studio switches with all three templates in owner preview and guest pages, overlays, hero images and default/custom palettes, template scales, dark/light photo captions, readable long text and actual image contrast. Check marketing heading hierarchy across homepage/template pages without introducing extra h1s.

Verify fixed-reference demo date generation across UTC midnight, browser/server timezones, month/year/leap-day rollover and hourly cache refresh; preview server HTML/hydration, starter persistence, event/countdown calendar consistency, missing/invalid timezone/date inputs, and unchanged real/past dates after reload/edit/publish. No migration or provider configuration is added by task 13; earlier migration/upload prerequisites remain outstanding.


## Task 16 cinematic opener finding

Production WebKit could activate the server-rendered cinematic seal before the lazy runtime's handlers attached, losing the first keyboard gesture. The seal now remains disabled until hydration and then receives initial focus when appropriate; frame preparation does not prevent entry after that point. A blocked-JS regression case covers SSR disabled → hydrated enabled → keyboard opening. Real-device audio/keyboard behavior still needs the pending manual cases.
