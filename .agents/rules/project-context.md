---
trigger: always_on
---

# Project Context

## Product Overview

This project is a modern wedding invitation SaaS platform focused on creating premium, mobile-first digital wedding invitation experiences for Indian weddings.

Users should be able to:
- Browse invitation templates
- Preview live demos
- Select a template
- Edit wedding details in a dashboard
- Upload photos and music
- Customize events like Mehendi, Haldi, Reception, etc.
- Preview changes live
- Publish their invitation
- Get a shareable public URL
- Share invitations through WhatsApp, Instagram, and other social platforms

The product should feel:
- premium
- emotional
- elegant
- smooth
- modern
- lightweight
- mobile-first

The goal is NOT to build a generic SaaS dashboard.
The goal is to create a beautiful emotional experience with strong UX and smooth interactions.

---

# Core Product Philosophy

This product succeeds because of:
- smooth mobile UX
- fast loading performance
- emotionally premium templates
- frictionless editing experience
- easy publishing and sharing

The experience should feel polished and effortless even for non-technical users.

Most users will access the platform through mobile devices.

---

# Technical Stack

## Frontend
- Next.js Latest version (16.2.6)(App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand

## Backend
- Supabase
- PostgreSQL

## Media
- Cloudinary

## Payments
- Razorpay

## Deployment
- Vercel

---

# Architecture Principles

## Shared Wedding Schema

All templates must consume the same standardized wedding data schema.

Templates should only differ in:
- layout
- styling
- animations
- visual presentation

Templates must NEVER contain business logic.

---

## Separation of Concerns

Business logic, editor logic, data fetching, and rendering logic must remain separated.

Avoid tightly coupling:
- templates
- editor state
- database logic
- UI rendering

---

## Draft vs Published State

Invitations must support:
- draft state
- published state

Users should be able to:
- edit drafts safely
- preview before publishing
- republish updates later

---

# Mobile-First Philosophy

This product is primarily mobile-focused.

All UI and UX decisions should prioritize:
- touch interactions
- small screens
- thumb-friendly layouts
- low-end Android devices
- mobile responsiveness
- fast loading on slow networks

Desktop support is important but secondary.

---

# Performance Philosophy

Performance is critical.

Avoid:
- unnecessary animations
- large client bundles
- unoptimized images
- excessive rerenders
- heavy dependencies

Target:
- fast initial load
- responsive interactions
- smooth scrolling
- high Lighthouse mobile score

All media must be optimized aggressively.

---

# Design Philosophy

The design language should feel:
- elegant
- premium
- minimal
- warm
- modern
- emotionally expressive

Typography and spacing are extremely important.

Animations should remain subtle and smooth.
Avoid flashy or distracting motion.

Preferred style:
- clean layouts
- cinematic feel
- soft transitions
- luxury wedding aesthetic

---

# Template System

Templates are React components.

Each template must:
- accept standardized wedding data
- support responsive layouts
- support theming/customization
- remain reusable
- avoid direct database access

Templates should be modular and scalable.

Reusable sections may include:
- hero section
- countdown
- story timeline
- events
- gallery
- RSVP
- venue
- footer

---

# Invitation Editor Philosophy

The dashboard editor is a core part of the product.

The editor should feel:
- simple
- fast
- intuitive
- live
- responsive

Editing experience should include:
- real-time preview
- autosave
- smooth transitions
- minimal friction

Avoid overwhelming users with too many controls.

---

# Public Invitation Philosophy

Published invitation pages should:
- load quickly
- feel cinematic
- look premium
- work smoothly on mobile
- support social sharing
- support WhatsApp previews

The guest experience is extremely important.

---

# Image & Media Handling

Wedding platforms are media-heavy.

All uploads should support:
- compression
- resizing
- lazy loading
- optimized delivery
- responsive images

Prevent large uploads from hurting performance.

---

# State Management Philosophy

Use Zustand for editor and UI state management.

Separate:
- persisted data state
- temporary UI state

Avoid:
- deeply nested prop drilling
- unnecessary global state

---

# SEO & Sharing

Published invitations must support:
- dynamic metadata
- OpenGraph tags
- WhatsApp previews
- clean slugs
- SEO-friendly URLs

Public invitation links should feel shareable and premium.

Example:
- /w/rahul-weds-ananya

Avoid ugly IDs in URLs.

---

# Coding Philosophy

Code should prioritize:
- readability
- maintainability
- scalability
- modularity
- clean architecture

Avoid:
- premature optimization
- overengineering
- unnecessary abstractions
- bloated component structures

Keep implementations practical and scalable.

---

# Animation Philosophy

Use Framer Motion for animations.

Animations should:
- improve UX
- feel smooth
- remain subtle
- avoid blocking interaction

Avoid:
- excessive parallax
- heavy GSAP usage
- scroll-jacking
- flashy motion

Performance is more important than visual effects.

---

# Product Priorities

Priority order:
1. Mobile UX
2. Performance
3. Editor Experience
4. Template Quality
5. Publishing Flow
6. Visual Polish
7. Advanced Features

Do not sacrifice usability for visual complexity.

---

# MVP Philosophy

Initial MVP should focus on:
- one high-quality template
- clean dashboard
- live editing
- publish flow
- mobile responsiveness
- stable architecture

Avoid building:
- too many templates
- unnecessary AI features
- overly complex systems
- enterprise-level infrastructure

Build incrementally and scale carefully.

---

# Important Constraints

Avoid:
- heavy dependencies
- complex DevOps setup
- microservices
- unnecessary backend complexity
- premature scaling architecture

Focus on:
- speed of iteration
- maintainable architecture
- premium UX
- product quality
- smooth user experience

---

# Target Audience

Primary audience:
- Indian wedding couples
- mobile-first users
- users sharing invitations through WhatsApp and Instagram
- non-technical users

The product should feel easy enough for anyone to use without guidance.

---

# Long-Term Vision

Long-term, the platform may expand into:
- multiple premium templates
- invitation marketplace
- guest management
- RSVP analytics
- custom domains
- premium themes
- wedding microsites

However, initial focus should remain on:
- strong core architecture
- smooth editor UX
- scalable template system
- polished mobile experience

---

# Routing Philosophy

Every time a new route or dynamic mapping is created, ensure that you explicitly establish and verify the linkage between UI components (buttons, links, redirects) and the route. 
The system should naturally connect related flows:
- The template preview router (`/preview/[templateId]`) must be wired to the preview buttons on the frontend.
- When creating any new feature that requires a new route, wire it correctly so that manual URL access is not the only way to trigger it.