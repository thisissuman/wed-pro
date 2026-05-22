# Performance Rules

## Core Philosophy

Performance is a core product feature.

The platform must feel:
- fast
- smooth
- responsive
- lightweight

Users should never feel:
- lag
- heavy loading
- delayed interactions
- sluggish scrolling

Performance matters more than visual complexity.

---

# Mobile Performance Priority

Performance optimization must prioritize:
- low-end Android devices
- slow mobile networks
- limited device memory
- battery efficiency

The product must remain usable on average mobile hardware.

---

# Loading Speed Targets

Target:
- fast first paint
- fast interaction readiness
- minimal layout shift
- responsive scrolling

Public invitation pages should load quickly even on mobile data.

---

# JavaScript Rules

Reduce client-side JavaScript aggressively.

Prefer:
- server components
- server rendering
- lightweight hydration
- dynamic imports

Avoid:
- unnecessary client components
- large client bundles
- excessive third-party libraries

---

# Bundle Size Rules

Keep bundle sizes minimal.

Before adding dependencies:
- check bundle impact
- verify necessity
- prefer lightweight alternatives

Avoid dependency bloat.

---

# Image Optimization Rules

All media must be optimized.

Always:
- compress uploads
- resize large images
- use responsive image sizing
- lazy load media
- serve modern formats

Preferred formats:
- WebP
- AVIF when possible

Never render raw uploads directly.

---

# Lazy Loading Rules

Lazy load:
- images
- videos
- heavy sections
- editor modules
- template previews

Avoid loading unnecessary assets initially.

---

# Animation Performance Rules

Animations must remain lightweight.

Avoid:
- heavy parallax
- expensive transforms
- animation spam
- continuous animations
- large blur effects

Animations should never reduce scrolling or interaction performance.

---

# Rendering Rules

Avoid unnecessary rerenders.

Prefer:
- memoization where necessary
- selective subscriptions
- lightweight state updates

Do not prematurely optimize everything.

Optimize only meaningful bottlenecks.

---

# State Management Performance

State architecture should remain efficient.

Avoid:
- giant global stores
- deeply nested state
- excessive subscriptions

Prefer:
- modular stores
- localized updates
- flat structures

---

# Data Fetching Rules

Fetch only required data.

Avoid:
- over-fetching
- duplicate requests
- unnecessary polling

Use:
- server-side fetching
- caching
- pagination when needed

---

# API Performance Rules

API responses should remain lightweight.

Avoid:
- large payloads
- deeply nested responses
- unnecessary joins

Return only required fields.

---

# Public Invitation Performance

Public invitation pages are performance-critical.

They must:
- open quickly from WhatsApp
- render smoothly on mobile
- avoid blocking resources

Avoid:
- heavy video backgrounds
- oversized hero media
- excessive animations

Guest experience is critical.

---

# Font Optimization Rules

Use fonts carefully.

Avoid:
- too many font families
- excessive font weights
- large font files

Prefer:
- optimized Google Fonts loading
- limited font variants
- font-display swap

---

# Scroll Performance

Scrolling must remain smooth.

Avoid:
- heavy scroll listeners
- excessive DOM updates
- animation-heavy scroll effects

Use GPU-friendly transforms when necessary.

---

# Lighthouse Goals

Target strong Lighthouse scores, especially on mobile.

Focus on:
- performance
- accessibility
- best practices
- SEO

Avoid chasing perfect scores at the expense of usability.

---

# Editor Performance Rules

The invitation editor must remain:
- responsive
- smooth
- low-latency

Typing and editing should feel instant.

Avoid:
- blocking autosaves
- heavy rerenders
- iframe reload loops

---

# Caching Rules

Use caching strategically.

Cache:
- templates
- static assets
- optimized media
- reusable API responses

Avoid stale critical user data.

---

# Asset Rules

Optimize all assets.

Avoid:
- oversized SVGs
- huge PNGs
- unnecessary videos
- uncompressed media

Prefer:
- compressed assets
- responsive delivery
- CDN optimization

---

# Deployment Performance

Production deployments should:
- minimize unused assets
- optimize caching
- compress responses
- support CDN delivery

Use Vercel optimizations properly.

---

# Performance Monitoring

Monitor:
- loading speed
- interaction responsiveness
- mobile experience
- render performance

Optimize real bottlenecks, not theoretical ones.

---

# Final Principles

Always prioritize:
1. mobile performance
2. fast interactions
3. smooth scrolling
4. lightweight rendering
5. responsive editing

The product should feel:
- instant
- smooth
- optimized
- lightweight
- premium





template-engine/
wedding-data-schema/
invitation-editor/
publish-system/
public-invite-page/
mobile-ux/
image-optimization/
ui-components/
payment-integration/
auth-system/
dashboard-pattern/
content-generation/