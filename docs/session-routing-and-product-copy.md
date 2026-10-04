# Session routing and Free Beta copy

Tasks 11–12 implemented; verification deferred to task 16.

## Static asset boundary

`src/proxy.ts` excludes explicit public asset namespaces and exact files. `src/lib/auth/session-routing.ts` describes the same boundary for the reusable session helper. Next requires the matcher to be a literal; update both places together when adding a public asset namespace/file.

Excluded: `/media/` (including default MP3, thumbnails and all versioned cinema films/frames/decor), `/tap-to-open/`, `/_next/static/`, `/_next/image` and its namespace, exact `/favicon.ico`, and the legacy root SVG URLs `/window.svg`, `/globe.svg`, `/next.svg`, `/vercel.svg`, `/file.svg`. The internal `/_next/static` directory root is also excluded. The public `/media` and `/tap-to-open` directory roots without trailing slash remain matched; no application routes should be added beneath these reserved static namespaces.

The session helper returns NextResponse.next immediately for these paths, before reading Supabase configuration, constructing a client, reading auth cookies or calling getUser. It performs no redirect, rewrite, body read or cache/range-header replacement. Next's public-file serving owns the response. Existing `/media/royal-3d-cinema/v1/:path*` immutable one-year Cache-Control stays in next.config.ts. Range/HEAD/conditional media behavior is not replaced by an app handler.

Every other application route remains matched, including public invitations/previews, login/signup, auth callbacks/recovery and upload APIs. Protection uses the exact `/dashboard` root or `/dashboard/` descendants. A route/ID ending in `.png`, `.mp3`, `.mp4`, or another suffix is not a static exemption; a nested `media` segment or a name such as `/media-tools` also remains matched. `/dashboard-other` does not become a protected dashboard route merely because its name shares a prefix. Such future routes need their own explicit authorization boundary.

OAuth/recovery forwarding from `/`, safe login next paths and refreshed redirect cookies retain their existing behavior. The Cloudinary endpoints still check authentication and ownership independently. Database grants/RLS are unchanged by this task.

## Product copy contract

The current product is **Free Beta**, with **Royal Rajputana, Floral Elegance, and Royal 3D Wedding Cinema**. Accounts can create **three total invitations, including published ones**. Editing is private; publication/republishing promotes the public copy. RSVP sends guests to WhatsApp or an external link; the studio does not track replies, guest analytics, or a guest list. No checkout/payment gate is shipped.

Homepage/features/template-selection copy names this scope. Hero/features/CTA copy avoids unlimited creation and instant-public-edit implications. Social sharing uses a published link without promising instant social-cache refresh. Royal's unsupported Bestseller badge is replaced with a descriptive Royal badge; Floral's unspecified New claim is replaced with Botanical. Available-template metadata stays in the shared registry.

No evidence was supplied for the existing five-star quotes, named customers, adoption counts or ratings. They have been removed from the data/rendering rather than rewritten as new testimonials. The existing story-card layout now contains clearly labelled illustrative product examples without quotes, customer names or stars. Its legacy filename/component/anchor are retained for compatibility; these are not customer reviews. Existing decorative animation behavior is left for task 13.

The homepage process illustration is labelled as sample wedding details. Unsupported printing-price/delivery benchmarks are replaced with variable supplier costs/timings. Task 14 removes the unused calculator component (it had no rendered opening control); the comparison retains factual variable-cost wording without supplier benchmarks or environmental estimates. A custom-template/design-team sales promise is replaced by a contact invitation; the factual support email remains unchanged. No new policy, retention, refund, privacy, support-response, uptime or bespoke-service promise is introduced.

Human input is required before adding real testimonials (source, accuracy and permission), customer/adoption numbers, ratings, a Bestseller claim (sales evidence), quantified environmental claims, supplier benchmarks, or a promised custom-design service. Missing evidence does not block factual beta copy; those claims stay absent. Preserve the current contact address unless the owner provides a replacement.

## Final-stage cases

Task 16: matcher/helper parity; unauthenticated/authenticated dashboard root and descendants, including media-like names/file-like IDs; lookalike roots (`/dashboard-other`, `/media-tools`, `/tap-to-opening`, `/_next/static-tools`), query strings, encoded/normalized paths and trailing slashes; root and nested OAuth/recovery callbacks; login/signup redirect cookies and safe next destinations; authenticated/non-owner upload signing/completion; static requests with/without cookies and missing Supabase config.

Task 16: normal/HEAD/range/conditional media delivery, Content-Type/Content-Length/Accept-Ranges/Content-Range and status as supported by the deployment, immutable versioned cache headers, no auth-generated Set-Cookie on excluded assets, and Next image/static delivery. No HTTP probes, live sessions, headers or routing tests were inspected during implementation.

Task 16: copy/CTA/anchor/mobile rendering, all three registry cards, beta cap/readiness dialog consistency, WhatsApp/external RSVP wording, labelled examples without social proof, and support mailto preservation. No browser/copy QA or checks were run.
