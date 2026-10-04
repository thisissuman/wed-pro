# Sharing images and template runtime loading

Tasks 09–10 implemented; verification deferred to task 16.

## One sharing image

`resolveInvitationShareImage` is the only invitation social-image selector: first usable **seo.ogImage**, then **seo.whatsappPreviewImage**, then **hero.backgroundMedia**, then **no image** (text/summary metadata). There is no invented stock fallback. Explicit saved choices remain intact; replacing/removing the hero no longer changes either SEO image field. Previously synchronized OG values remain explicit until the owner clears or changes them.

The resolver rejects unsupported protocols, credentials, control characters, backslashes, protocol-relative URLs, known audio/video URLs, and non-image Cloudinary resource paths. Hosted HTTP(S) images and safe root-relative local images become absolute URLs against the canonical origin. The two explicit image URL fields show immediate feedback without blocking partial draft saving. Publication still enforces task 05's saved-row URL rules; partially edited drafts may contain invalid text without using it for image rendering.

Cloudinary delivery retains existing transformations, then applies a final `c_fill,w_1200,h_630,g_auto,f_auto,q_auto` share transformation before the version/public ID. A final identical transform is not repeated. External images keep their source URL; the editor shows the same landscape cover framing, while external social apps control their own presentation. No image fetch or probe occurs during selection.

SharePreviewPanel and SEO use this same helper. The editor previews **working content for the next publication**; public `/w/[slug]` metadata/rendering continue to read the same cached published snapshot. Share dialogs currently show no image. Publish/Republish is required before edits become public, and WhatsApp/social caches may continue to display an older preview afterward. Unpublish removes public access without removing private choices.

`getSiteUrl` supplies one HTTP(S) origin, stripping paths/trailing slash and rejecting credentials or malformed configuration. Priority is NEXT_PUBLIC_SITE_URL, then server VERCEL_URL, then the existing localhost fallback. Explicit NEXT_PUBLIC_SITE_URL is required for a consistent browser/server production origin; VERCEL_URL alone is server-only. Copy, WhatsApp messages, displayed links, and SEO use the canonical origin with the persisted slug. On-site relative navigation still opens the current environment. Configure the canonical origin before production sharing; fallback localhost is not a production invitation host.

## Metadata and lazy runtime separation

`src/templates/registry.ts` owns all template IDs, names, descriptions, thumbnails, categories, and badges. It imports no template components. Marketing cards derive from this registry; do not create another marketing list.

`src/templates/runtime-registry.tsx` contains statically declared Next dynamic loaders for the three template components. Its keys satisfy the TemplateId type derived from metadata. Only TemplateRenderer imports the runtime registry. SSR remains enabled; selected invitation content is rendered on the server rather than opting into ssr:false. Runtime and template CSS stay attached to their existing template modules. Shared preview IDs, theme provider behavior, editor props, and bespoke sections are unchanged.

`template-ids.ts` owns the existing garden-mandap → royal-3d-cinema mapping; template defaults re-export it for compatibility, and metadata/runtime selection resolves legacy IDs too. TemplateRenderer retains its unknown-template message, adds an accessible pending status, and catches client runtime/chunk errors with a Reload action. Reload continues to respect the editor's unsaved-change protection.

For future templates, add one metadata entry and one SSR-enabled runtime loader (plus any deliberate database allowlist change); do not eagerly import components into the metadata registry.

## Deferred cases

Task 16: URL/protocol/credential/control/local-path cases; precedence with all three explicit/hero combinations; hero removal/replacement; retained old OG selections; Cloudinary portrait/chain/version transformations and external images; working edits versus published metadata, failed publication/unpublish, canonical server/browser origins, stable suffixed links, production WhatsApp caching.

Task 16: bundle/chunk inspection and production build for metadata-only marketing imports, one selected runtime, initial server HTML/streamed content for all three templates and legacy IDs, template CSS loading, theme/zoom and preview-section scrolling, live editor/mobile preview switching, slow imports and chunk failure/reload. No bundle measurements, metadata tools, link sharing, builds, browser checks, or Lighthouse were run.
