# Coding Standards

## Core Philosophy

This project prioritizes:
- simplicity
- scalability
- readability
- maintainability
- performance
- premium user experience

Avoid:
- overengineering
- unnecessary abstractions
- bloated dependencies
- deeply nested logic
- massive components

Code should feel clean, predictable, and scalable.

---

# Tech Stack Standards

## Frontend
- Next.js ((16.2.6)) App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand

## Backend
- Supabase
- PostgreSQL

---

# TypeScript Rules

Always use strict TypeScript.

Avoid:
- `any`
- unsafe casting
- loosely typed objects

Prefer:
- explicit interfaces
- reusable types
- shared schemas

Bad:

```ts
const data: any = response;
```

Good:

```ts
interface WeddingData {
  brideName: string;
  groomName: string;
}
```

---

# Component Standards

Components must:
- have single responsibility
- remain reusable
- remain modular
- stay easy to read

Avoid:
- huge components
- mixed UI + business logic
- deeply nested JSX

Split components when complexity grows.

---

# File & Folder Naming

## Components
Use PascalCase.

Example:

```txt
WeddingHero.tsx
InvitationEditor.tsx
```

---

## Hooks
Use camelCase with `use` prefix.

Example:

```txt
useWeddingData.ts
useAutosave.ts
```

---

## Utility Files
Use kebab-case.

Example:

```txt
generate-slug.ts
format-date.ts
```

---

## Routes
Use lowercase kebab-case.

Example:

```txt
/dashboard/create-invite
/w/rahul-weds-ananya
```

---

# Folder Structure

Use structured and predictable folders.

Example:

```txt
/app
/components
/features
/templates
/hooks
/lib
/services
/store
/types
/utils
```

Avoid random file placement.

---

# State Management Rules

Use Zustand for:
- editor state
- UI state
- preview state

Avoid:
- unnecessary global state
- excessive React Context
- prop drilling

Separate:
- persisted data state
- temporary UI state

---

# Styling Rules

Use Tailwind CSS consistently.

Avoid:
- inline styles
- random spacing
- inconsistent colors
- unnecessary CSS files

Prefer:
- reusable utility patterns
- consistent spacing scale
- shared design tokens

---

# Responsive Design Rules

Everything must be mobile-first.

Always test:
- small Android devices
- iPhones
- tablets

Avoid:
- fixed widths
- hover-only interactions
- desktop-only layouts

Touch interactions must feel natural.

---

# Performance Rules

Performance is critical.

Always:
- lazy load images
- optimize media
- minimize rerenders
- use dynamic imports when needed
- reduce client-side JavaScript

Avoid:
- large bundles
- unnecessary dependencies
- heavy animations
- unoptimized images

Target fast mobile performance.

---

# Animation Standards

Use Framer Motion only.

Animations should:
- improve UX
- remain subtle
- feel smooth
- never block interaction

Avoid:
- excessive motion
- scroll-jacking
- heavy GSAP usage
- distracting animations

Performance matters more than flashy effects.

---

# Template System Rules

Templates must:
- remain presentation-only
- use shared WeddingData schema
- avoid direct database access
- avoid business logic

Templates should only control:
- layout
- visuals
- animations
- presentation

---

# Database Standards

Use Prisma schema as source of truth.

Avoid:
- giant JSON blobs
- duplicated data
- unnecessary raw SQL

Prefer proper relational design.

Example:
- weddings
- events
- photos
- guests
- RSVP
- templates

must remain relational.

---

# API & Data Fetching

Prefer:
- server components
- server actions
- optimized fetching

Avoid:
- unnecessary client fetching
- duplicate requests
- over-fetching data

Keep payloads minimal.

---

# Forms & Validation

Use:
- React Hook Form
- Zod

Validation must exist:
- client-side
- server-side

Avoid duplicated validation logic.

---

# Error Handling

Always handle:
- loading states
- empty states
- error states

Never:
- silently fail
- expose raw backend errors
- leave blank screens

Provide meaningful user feedback.

---

# Image Handling Rules

All uploads must support:
- compression
- resizing
- lazy loading
- optimized delivery

Prefer:
- WebP
- responsive image sizing
- CDN optimization

Never render raw large uploads directly.

---

# Accessibility Rules

Basic accessibility is mandatory.

Always:
- use semantic HTML
- provide alt text
- maintain readable contrast
- support keyboard navigation

Avoid inaccessible UI patterns.

---

# SEO & Sharing Rules

Public invitation pages must support:
- dynamic metadata
- OpenGraph tags
- WhatsApp previews
- SEO-friendly slugs

Good:

```txt
/w/rahul-weds-ananya
```

Bad:

```txt
/w/123123123
```

---

# Code Reusability

Prefer:
- shared utilities
- reusable sections
- shared UI primitives
- reusable hooks

Avoid:
- duplicated logic
- repeated layouts
- copy-paste components

---

# Import Order

Recommended order:
1. external libraries
2. internal modules
3. components
4. styles
5. types

Keep imports clean and organized.

---

# Comments

Write comments only when necessary.

Avoid obvious comments.

Bad:

```ts
// increment count
count++;
```

Good comments explain:
- architecture decisions
- reasoning
- non-obvious logic

---

# Dependency Rules

Before adding a package:
- check bundle size
- check maintenance quality
- check if native implementation is simpler

Avoid dependency bloat.

---

# Security Rules

Never expose:
- API secrets
- service role keys
- payment secrets

Always:
- validate permissions
- secure API routes
- use environment variables properly

---

# Testing Philosophy

Initial MVP focuses on:
- manual testing
- responsive testing
- critical flow testing

Critical flows:
- auth
- uploads
- payment
- publishing
- public invitation rendering

Avoid enterprise-level testing complexity initially.

---

# Final Engineering Principles

Always prioritize:
1. user experience
2. mobile responsiveness
3. performance
4. maintainability
5. simplicity

Avoid unnecessary complexity.

The goal is to build:
- a scalable invitation platform
- premium mobile UX
- smooth editing experience
- fast public invitation pages
- maintainable architecture