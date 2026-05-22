# template-architecture.md

# Template Architecture Rules

## Core Philosophy

Templates are the core product experience.

The template system must support:

* cinematic storytelling
* smooth animations
* emotional wedding flow
* mobile-first rendering
* scalable customization
* future live editing
* reusable sections
* performant rendering

Templates should feel:

* luxurious
* emotional
* immersive
* cinematic
* Indian wedding focused
* smooth
* premium

Avoid:

* generic landing page architecture
* hardcoded layouts
* duplicated logic
* template-specific backend logic
* tightly coupled rendering systems

---

# MOST IMPORTANT PRINCIPLE

Templates are ONLY presentation layers.

Templates must:

* render UI
* consume structured data
* handle animations
* control visual storytelling

Templates must NEVER:

* fetch database data directly
* contain auth logic
* contain business logic
* contain payment logic
* manage backend state

Correct architecture:

```tsx id="2hvhsg"
<TemplateRenderer
  template="royal"
  data={weddingData}
/>
```

---

# Template System Architecture

Each template must follow:

```txt id="j6k0jo"
/templates
  /royal
    Template.tsx
    sections/
    animations/
    theme/
    config/
```

Templates should remain isolated and modular.

---

# Shared Section Architecture

Templates must be built using reusable sections.

DO NOT create giant monolithic template files.

Use modular sections.

Example:

```txt id="cwpmoc"
sections/
  HeroSection
  IntroRevealSection
  CountdownSection
  BlessingSection
  EventSection
  CoupleStorySection
  GallerySection
  RSVPSection
  VenueSection
  ThankYouSection
```

This architecture is mandatory for scalability.

---

# Shared Wedding Data Structure

All templates must consume the same shared data structure.

Example:

```ts id="m2w4wu"
WeddingData {
  couple
  story
  events
  gallery
  venue
  countdown
  RSVP
  theme
  music
}
```

Templates should ONLY render data.

This structure will later become:

* editor source
* preview source
* database structure
* publish source

---

# Rendering Flow

Correct rendering flow:

```txt id="vsfjg5"
Dashboard Editor
→ updates WeddingData
→ preview rerenders
→ template consumes updated data
```

Templates should always remain stateless presentation systems.

---

# Template Storytelling Flow

Templates should follow emotional storytelling flow.

Recommended flow:

```txt id="ey8v7g"
Invitation Open Animation
↓
Hero Reveal
↓
Bride & Groom Reveal
↓
Countdown
↓
Blessing Message
↓
Wedding Details
↓
Events Timeline
↓
Meet The Couple
↓
Gallery
↓
RSVP
↓
Venue
↓
Thank You
```

The invitation should feel like:

* a cinematic wedding experience
* not a normal website

---

# Invitation Open Animation

Templates may begin with:

* opening invitation card
* opening curtain/parda
* animated reveal
* cinematic intro

This section should:

* feel emotional
* feel premium
* remain smooth on mobile

Avoid:

* heavy 3D rendering
* laggy animation
* excessive GPU effects

---

# Hero Section Rules

Hero section is the emotional anchor.

Hero may include:

* animated couple names
* cinematic typography
* wedding date
* countdown
* animated motifs
* background reveal

Hero should:

* feel immersive
* remain lightweight
* prioritize typography and spacing

Avoid visual overload.

---

# Animation Architecture

Animations should remain:

* modular
* reusable
* performant
* mobile-friendly

Preferred:

* Framer Motion
* viewport animations
* subtle parallax-lite
* fade reveals
* staggered text reveals

Avoid:

* GSAP-heavy architecture initially
* excessive scroll effects
* animation spam
* laggy motion

---

# Scroll Experience Philosophy

Templates are cinematic scrolling experiences.

Scrolling should feel:

* smooth
* immersive
* paced
* emotional

Each section should:

* reveal naturally
* breathe visually
* maintain emotional rhythm

Avoid:

* dumping too much content together
* crowded layouts
* excessive animation frequency

---

# Blessing Section Rules

Blessing sections may contain:

* family blessings
* invitation message
* son/daughter of information
* emotional text

Typography should feel:

* elegant
* royal
* breathable

This section should prioritize:

* readability
* spacing
* emotional tone

---

# Scratch Reveal Architecture

Scratch reveal effects may exist for:

* wedding date reveal
* invitation surprise interaction

These interactions should:

* remain lightweight
* support touch devices
* degrade gracefully

Avoid heavy canvas rendering initially.

---

# Event Section Architecture

Events must support:

* Mehendi
* Haldi
* Wedding
* Reception
* Sangeet

Each event should support:

```ts id="e8dg9n"
Event {
  title
  icon
  description
  date
  time
  venue
  googleMapLink
}
```

Event cards should remain reusable.

---

# Venue Section Rules

Venue sections should support:

* venue name
* address
* map button
* background imagery

Google Maps CTA should remain:

* touch-friendly
* prominent
* mobile optimized

---

# Couple Story Section

Templates may contain:

* Meet The Couple section
* romantic storytelling
* animated reveals
* emotional text

This section should support:

* animated headings
* quote-style content
* emotional pacing

Avoid excessive text density.

---

# Animated Character / Decorative Elements

Templates may contain:

* animated couple illustrations
* floating motifs
* floral animations
* cultural decorative elements

Decorative elements should:

* remain subtle
* support storytelling
* avoid hurting performance

Avoid:

* visual clutter
* animation overload

---

# Gallery Section Architecture

Gallery must support:

* prewedding photos
* cinematic layouts
* responsive grids
* carousels
* storytelling arrangements

Gallery layouts should remain:

* modular
* reusable
* responsive

Avoid:

* unoptimized image rendering
* massive image payloads

---

# RSVP Architecture

RSVP should support:

* CTA button
* WhatsApp redirect
* future RSVP forms

Initial architecture should remain flexible.

Example:

```ts id="gh37ea"
RSVP {
  type
  whatsappNumber
  message
}
```

---

# Thank You Section

Templates should end emotionally.

Include:

* thank you message
* couple names
* elegant typography
* emotional closure

Ending should feel:

* warm
* memorable
* cinematic

---

# Theme Architecture

Templates must support theme configuration.

Theme system should support:

* colors
* typography
* gradients
* section spacing
* decorative styles

Avoid hardcoded styling everywhere.

---

# Mobile-First Rules

Templates must prioritize:

* mobile rendering
* touch interactions
* lightweight performance
* smooth scrolling

Most users will experience invitations on mobile devices.

Desktop is secondary.

---

# Performance Rules

Templates must remain:

* lightweight
* responsive
* optimized

Always:

* lazy load images
* optimize media
* reduce rerenders
* minimize heavy animation

Avoid:

* laggy 3D systems
* massive assets
* unoptimized videos

---

# Editor Compatibility Rules

Templates must remain editable later.

Every editable content area should map cleanly to:

* future dashboard controls
* future editor fields

Avoid tightly coupling content to layout logic.

---

# Scalability Rules

Architecture must support:

* multiple templates
* multiple themes
* future section reuse
* future editor integration

Avoid:

* duplicated sections
* duplicated animation systems
* hardcoded rendering patterns

---

# Final Principles

Always prioritize:

1. emotional storytelling
2. mobile experience
3. smooth animations
4. scalable architecture
5. lightweight performance
6. reusable sections
7. elegant typography
8. cinematic pacing

Templates should ultimately feel like:

“a luxury cinematic Indian wedding storytelling experience built for modern mobile users.”
