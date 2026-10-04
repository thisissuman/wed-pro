# Future template development

The current product has three supported designs: Royal Rajputana, Floral Elegance and Royal 3D Wedding Cinema. Adding another template is outside tasks 01–16. This guide describes future authorized work, not a request to create a new template or execute checks during the current implementation-only phase.

## Architecture

Every design presents WeddingData without database/auth/store access. Share section contracts, preview IDs, theme/typography tokens and safe URL helpers while retaining bespoke layouts. Register metadata once in src/templates/registry.ts and add a selected SSR-enabled loader in runtime-registry.tsx; marketing derives from metadata and must not import runtimes. Coordinate any trusted creation/publish template allowlist migration deliberately. Preserve legacy IDs centrally.

Do not rewrite editor/publication/auth per template. Templates receive private working data for owner previews and frozen published data for guests, with the same share metadata resolver. Explicit OG/WhatsApp image choices remain independent of hero replacement. Do not restore hero-to-OG overwriting or public working-content reads.

Use TemplateThemeProvider's isolated palette/on-image tokens and compensate action hit areas for typography zoom. Use shared ModalSurface inline for template overlays, expected focus/keyboard behavior and native/accessibly managed selects. Keep reduced-motion/skip/reveal alternatives and tap-first music. Preview examples come from server-supplied createDemoWeddingData; do not calculate a fresh demo calendar during client render or change saved user dates.

## Documentation map

| Reference | Purpose |
| --- | --- |
| [Template architecture](../.cursor/rules/template-architecture.mdc) | Presentation/schema/registry boundaries |
| [Add-template steps](add-template.md) | Scaffold, metadata/runtime and later verification |
| [Design intake](create-template-prompt.md) | Future design brief |
| [Sharing/loading](sharing-and-template-loading.md) | Selected SSR runtime and image metadata |
| [Overlays](accessible-overlays.md), [polish](mobile-motion-theme-and-demos.md) | Focus, motion, theme, mobile and demos |
| [Environment/CI](environment-and-ci.md), [pending verification](pending-verification.md) | Commands, prerequisites and coverage gaps |

Existing designs supply patterns, not proof a new template is already validated. Current specs are free-beta, editor-validation and royal-3d-cinema; there is no full authenticated lifecycle/new-template suite. Do not rely on an existing smoke pass to cover a new design. Appropriate test authoring/execution, mobile/accessibility/SSR/bundle and published share verification belong to an authorized verification stage. During the current roadmap, all of those remain deferred to task 16.
