# Template Engine Skill

## Purpose

The template engine powers the wedding invitation rendering system.

Templates must remain:
- reusable
- scalable
- presentation-focused
- mobile-first
- performance optimized

The template engine is one of the core architectural systems of the platform.

---

# Core Philosophy

All templates must consume the same standardized wedding data schema.

Templates should only differ in:
- layout
- typography
- animation style
- visual presentation

Templates must NOT contain:
- business logic
- direct database access
- payment logic
- authentication logic

---

# Template Architecture

Each template should behave like a theme layer.

Example:

```tsx
<ModernTemplate data={weddingData} />
```

Templates receive structured data and render UI only.

---

# Shared Wedding Schema

Every template must support:
- bride & groom information
- events
- gallery
- countdown
- RSVP
- venue details
- story section
- music support

Avoid template-specific schema structures.

---

# Template Folder Structure

Preferred structure:

```txt
/templates
  /classic
  /modern
  /royal
```

Each template should contain:
- layout
- sections
- theme config
- animations
- responsive styling

---

# Reusable Section Philosophy

Templates should be built from reusable sections.

Examples:
- Hero
- Story
- Countdown
- Gallery
- Events
- RSVP
- Venue
- Footer

Avoid duplicating entire layouts unnecessarily.

---

# Responsive Design Rules

Templates must remain:
- mobile-first
- touch-friendly
- responsive
- performant

All templates must work smoothly on:
- Android devices
- iPhones
- tablets
- desktop screens

---

# Performance Rules

Templates must:
- lazy load media
- minimize animations
- optimize images
- avoid unnecessary rerenders

Avoid:
- heavy animation libraries
- excessive client rendering
- large media payloads

---

# Theme System

Templates should support:
- colors
- typography
- spacing
- theme customization

Keep theme configuration centralized.

---

# Animation Rules

Animations should:
- remain subtle
- feel cinematic
- enhance emotional storytelling

Avoid:
- flashy motion
- excessive parallax
- performance-heavy effects

---

# Public Rendering Rules

Published invitation pages must:
- load quickly
- feel premium
- support sharing previews
- render consistently

Guest experience is critical.

---

# Final Principles

Always prioritize:
1. scalability
2. reusability
3. mobile experience
4. performance
5. emotional design quality

Templates should feel:
- elegant
- lightweight
- premium
- cinematic