---
name: dashboard-section-pattern
description: "Step-by-step workflow for adding a new dashboard editor section with shadcn UI, Zustand, RHF+Zod, mobile UX, and live preview sync. Use when creating or extending src/features/dashboard sections."
paths: ["src/features/dashboard/**/*.{ts,tsx}", "src/app/dashboard/**/*.{ts,tsx}"]
disable-model-invocation: false
---

# Dashboard Section Pattern

## When to Use

Creating or extending a dashboard editor section (gallery, events, story, settings, etc.).

## Workflow Checklist

```
- [ ] 1. Scope section purpose
- [ ] 2. Define structure & data needs
- [ ] 3. Create feature folder
- [ ] 4. Build UI components
- [ ] 5. Wire state (local vs Zustand)
- [ ] 6. Add validation (RHF + Zod)
- [ ] 7. Mobile UX pass
- [ ] 8. Loading / empty / error states
- [ ] 9. Performance check
- [ ] 10. Connect live preview
- [ ] 11. Accessibility pass
- [ ] 12. QA on devices
```

## Step 1 — Scope

Define: goal, user actions, required `WeddingData` fields, mobile behavior, preview impact.

Ask: editor vs settings? Does it need live preview sync?

## Step 2 — Structure

Simple hierarchy, minimal controls, clear mobile layout. Avoid overcrowding.

## Step 3 — Feature Folder

```
src/features/dashboard/<section-name>/
  components/
  hooks/        # optional
  types/        # optional
  utils/        # optional
```

Keep logic isolated per section.

## Step 4 — UI

- Tailwind + shadcn/ui + shared `src/components/ui/`
- Mobile-first; match design-language rule
- No inline styles; reuse spacing scale

## Step 5 — State

| Need | Use |
|------|-----|
| Isolated UI | `useState` |
| Shared editor + preview | `src/stores/invitation-editor-store.ts` (or dedicated store) |
| Server data | Server action / RSC — not duplicated in Zustand |

## Step 6 — Validation

React Hook Form + Zod schemas aligned with `WeddingData` types in `src/types/`.

## Step 7 — Mobile

44×44px targets; stacked layout; correct input modes; test keyboard overlap.

## Step 8 — States

Skeleton loading, friendly empty states, user-safe error messages.

## Step 9 — Performance

Avoid global rerenders; debounce heavy handlers; lazy-load media pickers if heavy.

## Step 10 — Preview

If section mutates invitation content:

- Update Zustand draft
- Preview should update without full iframe reload
- Map fields 1:1 to template `WeddingData` paths

## Step 11 — Accessibility

Labels, focus order, contrast, semantic HTML.

## Step 12 — QA

Test Android-sized viewport, iPhone, tablet, desktop. Verify dashboard nav links to the section.

## Principles

Lightweight, premium, responsive, intuitive — not enterprise admin complexity.
