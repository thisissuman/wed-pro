# Task 14 cleanup decisions

Implemented; verification deferred. Decisions use current source, import/reference searches, the existing lockfile dependency declarations and the asset manifest/validator source. No installation, lint, type checking, build, tests, asset validation, audit, browser checks, live data inspection, migrations, deployment, commit or push occurred.

## Deleted source files

These components had no active consumers in the current source. References to the generic scratch/tap candidates were their own definitions, distinct from the active WeddingDateScratchReveal components.

- `src/components/magic-ui/pointer.tsx`
- `src/components/magic-ui/shine-border.tsx`
- `src/components/media/CloudinaryUploadField.tsx`
- `src/components/ui/Chip.tsx`
- `src/features/dashboard/cta/CreateInvitationCTA.tsx`
- `src/features/dashboard/share/ShareUrlPanel.tsx`
- `src/features/dashboard/shared/CoordinatesInput.tsx`
- `src/templates/royal/components/CinematicIntro.tsx`
- `src/templates/royal/components/ScratchReveal.tsx`
- `src/templates/royal/components/TapReveal.tsx`
- `src/features/dashboard/comparison/SavingsCalculatorSheet.tsx`
- `src/features/dashboard/cta/WeddingStyleQuiz.tsx`

DigitalVsPhysical imported SavingsCalculatorSheet and held calculatorOpen state without rendering a calculator or an opening control. Removed those imports/state and its unused ArrowRight import. FinalCTA mounted WeddingStyleQuiz with quizOpen permanently false and no opening control; removed that dead mount/state, its imports and unused ArrowRight. The quiz had no other consumer, so its module was removed with the unreachable state. The existing template recommended query/session handling remains for previous links/preferences; this cleanup does not introduce or remove a reachable quiz/calculator flow.

The unused CloudinaryUploadField compatibility wrapper is removed; CroppedImageUploadField, AudioUploadField, crop dialogs and the authenticated direct signing/completion implementation remain. Only the unused coordinate input UI is removed: coordinate schema, persisted coordinates and map helpers remain. The active GlobalLovePointer, InvitationOpener and both WeddingDateScratchReveal components remain, as do all three template folders and their runtime/metadata registration.

## Deleted starter assets

No current source, CSS, tests or asset scripts referenced these assets for rendering. Their exact names only occurred in the static session exemption list.

- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`

The exact-path session exemptions remain intentionally: stale requests to these legacy static URLs can receive Next's normal missing-file response without initiating an auth refresh. This does not exempt arbitrary extensions or application routes. No cache/range behavior or protected-route boundary changes are made.

## Dependencies and lockfile

Removed direct dependencies `class-variance-authority`, `motion` and `next-cloudinary`: current source has no imports requiring them. The active animation library remains `framer-motion`; its locked version and shared motion-dom/motion-utils/tslib dependencies remain unchanged. `radix-ui` stays because ModalSurface imports its Dialog primitive for current accessibility behavior. Cloudinary uses the existing signed direct-upload HTTP flow without next-cloudinary.

package.json and package-lock.json were edited together, preserving remaining resolutions, integrity fields and dependency versions. The removed exclusive lock entries are class-variance-authority, motion, next-cloudinary, @cloudinary-util/types, @cloudinary-util/url-loader, its nested @cloudinary-util/util and zod, @cloudinary-util/util, @cloudinary/transformation-builder-sdk and @cloudinary/url-gen. Other zod/clsx instances remain required by existing app/tool dependencies. No package-manager command, forced upgrade, install validation or audit ran. node_modules is not rewritten in this phase; task 16 must use a clean lockfile-based installation so stale installed packages cannot mask missing dependencies.

## Retained uncertain assets

`public/tap-to-open/dooropen.jpg`, `videoframe_5491.png` and `videoframe_9508.png` have no current compiled-source consumer. They are wedding-specific legacy media at public URLs; stored invitation JSONB or earlier deployed clients may still refer to them. No live data/history inspection is authorized in this stage, so all three remain with the reserved static namespace. Removing them requires evidence about those historical consumers first.

All `public/media/royal-3d-cinema/v1` assets remain. These URLs are served with immutable versioned cache headers, and the absence of a current import does not establish older deployments no longer need them. Keep the manifest's array positions and validator's requirements intact:

- Film 2 and its poster have no current template band; film 1 and film 3 remain addressed as films[0] and films[2].
- Declared stills couple.webp, ganesha.webp, map.webp, scratch_reveal.webp and varmala.webp have no current direct runtime reference; the duplicate sacredStart manifest key is also not directly consumed. sanctum_start.webp is nevertheless the active sacred sequence poster, and venue_art.webp is the active venue fallback.
- umbrella.webp has no current runtime consumer; arch, diya, elephant, lotus and toran are active decor.
- Numbered low/high hero frames and sacred frames are dynamically addressed by manifest functions, including opener preloads. Their files must not be inferred unused from literal import counts.

Comments in assets.ts and the validator record this archive boundary; asset lists, counts and validator behavior are unchanged. Any future slimmer asset release should use a new version namespace with coordinated runtime manifest/validator/cache documentation. Retiring v1 needs separate evidence/authorization; do not remove v1 files simply because a new runtime stops selecting them.

Default music, active posters/decor, all migrations, tests, docs and .env.example remain. No remote media was deleted.

## Task 16 follow-up

Perform a clean dependency installation from the edited lockfile, then the consolidated type/lint/build/runtime checks to catch unresolved imports and peer/transitive issues. Preserve existing dependency errors for diagnosis rather than forcing upgrades. Reconcile source references, marketing/editor paths, authenticated image/audio uploads and the Radix overlays across all three templates. Run the existing asset validator against the retained v1 archive, and assess deployed dynamic frames/posters/decor, cache/range serving and legacy static URL behavior. Asset validators, audits and new tests wait for that stage. Historical public-media retirement remains blocked on deployment/saved-content evidence and its own authorization.

Task 16 removed the confirmed-unused getUploadPreset helper and unused CI test-user environment entries. Legacy provider preset settings are retained for the old deployment until an authorized coordinated production release; app uploads use signed server presets only.
