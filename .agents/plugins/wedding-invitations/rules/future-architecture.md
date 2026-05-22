# Future Architecture & Scalability Guidelines

This document serves as the architectural roadmap and validation guide for future phases of the Vivaha Studio platform. It details how the platform should scale, what to optimize, and what architectural traps to avoid as the product evolves.

---

## 1. Section Reusability & Templates

**Philosophy: 100% Reusability is an Anti-Pattern.**
To maintain a premium, bespoke, cinematic feel, forcing all templates to share the exact same UI components destroys creative freedom. 

*   **Headless Logic (100% Shared):** Use custom hooks (e.g., `useWeddingCountdown`, `useEventsFormatter`) to share business logic across templates.
*   **Core UI Atoms (100% Shared):** Buttons, inputs, typography wrappers, and icons.
*   **Template Sections (Bespoke):** Keep `HeroSection`, `EventsSection`, etc., isolated inside their specific template folders (e.g., `src/templates/royal/sections`). Hardcoded Tailwind colors are acceptable here to enforce the template's unique visual identity.

---

## 2. Template Customization & Theming

**Philosophy: Build Customization Later.**
Do not over-engineer CSS-variable injection or dynamic layout swapping for the MVP.

*   **ThemeConfig:** The `ThemeConfig` interface (`primaryColor`, `fontHeading`, etc.) is fully scalable. 
*   **Implementation (Phase 2):** When a Theme Customizer is built in the dashboard, the renderer will inject the user's `ThemeConfig` as a `<style>` block at the root (e.g., `:root { --theme-primary: #D4AF37; }`). Hardcoded tailwind classes in bespoke templates (like `text-champagne-gold`) will be migrated to `text-[var(--theme-primary)]`.
*   **Layout Swapping:** For MVP, lock layouts to templates. If a user wants a different layout, they must pick a different template. Do not build "section re-ordering" yet.

---

## 3. Mobile Performance & Optimization

**Philosophy: Protect the Main Thread and Time-To-Interactive (TTI).**

*   **Heavy CSS:** Restrict properties like `backdrop-filter: blur()` strictly to desktop breakpoints. They cause massive frame drops on low-end Android devices.
*   **Animations:** Limit Framer Motion to `transform` (scale/translate) and `opacity`. Animating `height` or `box-shadow` causes lethal layout thrashing. Avoid infinite JS loops (e.g., bouncing arrows); use CSS `@keyframes` for ambient motion.
*   **Lazy Loading:** Use `next/dynamic` for heavy components below the fold (Gallery, RSVP, Maps). 
*   **Images:** Strictly use `next/image` with proper `sizes` attributes (e.g., `sizes="(max-width: 768px) 100vw, 50vw"`). Do not use heavy `background-image` CSS for large photos; use absolutely positioned `next/image` tags instead.
*   **Scroll Architecture:** Rely entirely on native browser scrolling. Do not use smooth-scroll libraries (scroll-jacking) as they destroy mobile performance and touch accessibility.
*   **Hydration:** Always render time-sensitive data (like the Countdown timer) empty or generic on the server. Update the specific time delta inside a `useEffect` on the client to avoid hydration mismatch errors.

---

## 4. Database Readiness

**Philosophy: Keep Data Flat for the MVP.**
Your `WeddingData` interface is perfectly structured for document storage.

*   **Storage Strategy:** Use a single `invitations` table in Supabase. Store the entire `WeddingData` object inside a `JSONB` column. 
*   **Anti-Pattern:** Do not normalize `WeddingData` into 15 relational tables (Couples, Events, Galleries) for the MVP. It makes autosaving the draft state incredibly complex and slow.

---

## 5. Public Sharing (SEO & WhatsApp)

**Philosophy: The Public Route Must Be Server-Rendered.**
Social crawlers (WhatsApp, Instagram) do not execute JavaScript. 

*   **Routing:** The public route (e.g., `src/app/w/[slug]/page.tsx`) must be a React Server Component (RSC).
*   **Data Fetching:** Fetch the invitation `JSONB` data on the server. 
*   **Metadata:** Use Next.js `generateMetadata()` to inject OpenGraph tags and `whatsappPreviewImage` into the `<head>` before passing the data down to the client-side `<TemplateRenderer />`.

---

## 6. The Editor Architecture

**Philosophy: Side-Panel Dashboard + Iframe Preview.**
Do not build "inline" visual editors (where users click directly on the template text to edit). It couples layout and content too tightly and breaks complex cinematic animations.

1.  **Zustand Store:** Use a global state to hold the `WeddingData` draft while the user types.
2.  **Left Panel (Editor UI):** A clean dashboard of standard form inputs (React Hook Form) bound to the Zustand store.
3.  **Right Panel (Live Preview):** An `<iframe>` or isolated wrapper that consumes the Zustand store and renders the template in real-time.
