# Animation Guidelines

## Core Philosophy

Animations should:
- enhance user experience
- support emotional storytelling
- guide interaction
- improve flow
- feel premium and smooth

Animations must NEVER:
- reduce usability
- hurt performance
- distract users
- block interaction

Subtlety is preferred over flashy effects.

---

# Animation Style

Preferred animation feel:
- soft
- cinematic
- elegant
- lightweight
- natural

Avoid:
- aggressive motion
- excessive bouncing
- exaggerated scaling
- chaotic transitions

The product should feel refined, not flashy.

---

# Primary Animation Library

Use:
- Framer Motion

Avoid:
- GSAP-heavy architecture
- unnecessary animation libraries
- animation duplication

Framer Motion should handle almost all motion requirements.

---

# Performance First

Performance is more important than visual effects.

Avoid:
- animation-heavy pages
- expensive scroll effects
- excessive parallax
- animation loops
- large motion calculations

Animations must remain smooth on:
- low-end Android devices
- mobile browsers
- slower networks

---

# Motion Duration Rules

Preferred animation durations:

- Fast interactions:
  - 100ms–200ms

- Standard UI transitions:
  - 200ms–400ms

- Emotional/cinematic transitions:
  - 400ms–700ms

Avoid animations longer than:
- 800ms

Long animations make the UI feel slow.

---

# Easing Rules

Preferred easing:
- ease-out
- smooth cubic-bezier curves
- natural motion

Avoid:
- harsh linear transitions
- robotic movement
- over-bouncy easing

Motion should feel calm and premium.

---

# Page Transition Philosophy

Page transitions should:
- feel smooth
- preserve flow
- reduce abrupt context switching

Avoid:
- dramatic full-screen transitions
- over-animated route changes
- slow navigation

Navigation speed matters more than visual complexity.

---

# Hover Effects

Hover effects should remain subtle.

Preferred:
- soft scale
- opacity transitions
- gentle elevation
- background transitions

Avoid:
- large movement
- spinning effects
- exaggerated transforms

Remember:
mobile devices do not support hover.

---

# Scroll Animations

Scroll animations should:
- reveal content naturally
- support storytelling
- feel lightweight

Avoid:
- scroll-jacking
- excessive parallax
- heavy scroll listeners
- animation spam on every section

Use viewport animations sparingly.

---

# Mobile Animation Rules

Mobile animation must remain:
- lightweight
- responsive
- battery-efficient

Reduce animation complexity on mobile devices.

Avoid:
- excessive blur
- heavy transforms
- large animated shadows

---

# Loading Animations

Loading states should feel:
- calm
- polished
- lightweight

Preferred:
- skeleton loaders
- subtle shimmer
- soft fades

Avoid:
- aggressive spinners
- flashy loading screens
- distracting loaders

---

# Modal Animations

Modals should:
- appear quickly
- feel smooth
- maintain focus

Preferred:
- fade + slight scale
- fade + slide

Avoid:
- dramatic zooms
- rotating entrances
- long transition delays

---

# Editor Animation Philosophy

The invitation editor should feel:
- responsive
- instant
- fluid

Avoid:
- delayed interactions
- animation lag
- heavy transitions during typing/editing

Editing performance is critical.

---

# Public Invitation Motion

Public invitation pages may use:
- cinematic reveals
- subtle fades
- storytelling transitions

But performance remains the top priority.

Avoid turning invitation pages into animation showcases.

---

# Animation Frequency

Not every element needs animation.

Use motion intentionally.

Too much animation creates:
- visual fatigue
- slower UX
- reduced elegance

Whitespace and typography often create better premium feel than excessive motion.

---

# Blur & Glassmorphism Rules

Use blur effects carefully.

Avoid:
- excessive backdrop blur
- layered glassmorphism
- performance-heavy transparency

Use subtle blur only when necessary.

---

# Shadows & Depth

Depth should feel:
- soft
- realistic
- subtle

Avoid:
- harsh shadows
- glowing effects
- overly dramatic depth

---

# Accessibility & Reduced Motion

Respect reduced motion preferences.

Animations should degrade gracefully when:
- reduced motion is enabled
- device performance is low

Never force motion-heavy experiences.

---

# Animation Consistency

Maintain consistency across:
- timing
- easing
- interaction feedback
- transition patterns

Avoid random animation styles across the product.

---

# What Animations Should Achieve

Animations should help users:
- understand hierarchy
- notice changes
- follow interactions
- feel emotional connection

Animations are UX tools, not decoration.

---

# Final Principles

Always prioritize:
1. performance
2. usability
3. smoothness
4. elegance
5. subtlety

The product should feel:
- cinematic but lightweight
- premium but fast
- emotional but usable

Good animation should feel almost invisible.