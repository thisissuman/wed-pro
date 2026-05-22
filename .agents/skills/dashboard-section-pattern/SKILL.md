# Dashboard Section Pattern Skill   

## Purpose

This workflow defines the standard process for creating a new dashboard section.

The goal is to ensure:
- UI consistency
- responsive layouts
- scalable architecture
- smooth user experience
- maintainable code structure

---

# Step 1 — Understand Section Purpose

Before implementation:
- define the section goal
- identify user actions
- identify required data
- define mobile behavior
- define expected interactions

Questions:
- What problem does this section solve?
- Is it editor-related or settings-related?
- Is it mobile-friendly?
- Does it require live preview updates?

---

# Step 2 — Define Section Structure

Determine:
- layout structure
- content hierarchy
- interaction flow
- responsive behavior

Prefer:
- simple layouts
- clear hierarchy
- minimal cognitive load

Avoid:
- overcrowded sections
- excessive controls
- unnecessary complexity

---

# Step 3 — Create Feature Folder

Preferred structure:

```txt
/features/dashboard/[section-name]
```

Example:

```txt
/features/dashboard/gallery
```

Inside:
- components
- hooks
- types
- utils

Keep feature logic isolated.

---

# Step 4 — Create UI Components

Build:
- reusable components
- mobile-first layouts
- responsive controls

Use:
- Tailwind CSS
- shadcn/ui
- shared design system

Avoid:
- duplicated UI
- inline styling
- inconsistent spacing

---

# Step 5 — Add State Management

Determine:
- local state
- global Zustand state
- server state

Avoid unnecessary global state.

Use Zustand only when:
- state is shared
- editor synchronization is required
- preview updates are required

---

# Step 6 — Add Validation

Use:
- React Hook Form
- Zod

Validate:
- required fields
- media constraints
- content limits

Avoid weak validation.

---

# Step 7 — Implement Mobile UX

Test:
- small screen layouts
- touch interactions
- scrolling behavior
- keyboard behavior

Ensure:
- touch-friendly controls
- readable typography
- responsive spacing

---

# Step 8 — Add Loading & Empty States

Every section must support:
- loading states
- error states
- empty states

Use:
- skeleton loaders
- lightweight transitions

Avoid blank UI.

---

# Step 9 — Optimize Performance

Ensure:
- minimal rerenders
- lazy loading where needed
- optimized media handling

Avoid:
- large client bundles
- unnecessary animations
- excessive subscriptions

---

# Step 10 — Connect Preview System

If the section affects invitation rendering:
- sync with editor state
- update live preview smoothly
- avoid full preview reloads

Preview updates should feel instant.

---

# Step 11 — Accessibility Check

Verify:
- keyboard accessibility
- readable contrast
- semantic HTML
- accessible labels

Accessibility is mandatory.

---

# Step 12 — Final QA

Before completion verify:
- mobile responsiveness
- smooth interaction
- performance
- visual consistency
- state stability

Test:
- Android
- iPhone
- tablet
- desktop

---

# Final Principles

Dashboard sections should always feel:
- lightweight
- premium
- responsive
- intuitive
- mobile-first

Avoid enterprise admin-panel complexity.

The editing experience should feel effortless.