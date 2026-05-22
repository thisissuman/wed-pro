# State Management Rules

## Core Philosophy

State management should remain:
- predictable
- minimal
- scalable
- easy to debug
- easy to maintain

Avoid:
- unnecessary global state
- deeply nested prop drilling
- duplicated state
- overcomplicated architecture

The goal is smooth editor experience and maintainable application structure.

---

# Primary State Management Library

Use:
- Zustand

Do NOT introduce:
- Redux
- MobX
- overly complex state solutions

Zustand is the primary global state layer for this project.

---

# State Separation Principles

Separate state into:
1. server state
2. persisted application state
3. temporary UI state

Do not mix them together.

---

# Server State

Server state includes:
- database data
- user profile
- wedding data
- templates
- RSVP data

Prefer:
- server components
- direct server fetching
- server actions

Avoid storing large server datasets unnecessarily in Zustand.

---

# Persisted Application State

Persisted state includes:
- invitation draft data
- editor content
- user settings
- theme selections

Persist only necessary data.

Avoid storing:
- temporary UI toggles
- animation states
- modal visibility

inside persisted state.

---

# UI State

UI state includes:
- modal visibility
- sidebar open state
- tab selection
- temporary filters
- loading states

UI state should remain lightweight and localized whenever possible.

---

# Store Organization

Stores must remain modular.

Avoid:
- giant global stores
- unrelated state in same store
- monolithic architecture

Preferred structure:

```txt
/store
  /editor-store.ts
  /preview-store.ts
  /ui-store.ts
  /auth-store.ts
```

---

# Editor State Rules

The invitation editor is the most important state-heavy part of the product.

Editor state must support:
- live preview
- autosave
- undo-safe editing
- fast updates
- smooth typing performance

Avoid unnecessary rerenders.

---

# Autosave Rules

Autosave should:
- debounce updates
- avoid excessive API calls
- never block UI interaction

Preferred debounce:
- 500ms to 1500ms

Avoid saving on every keystroke.

---

# Live Preview Rules

Preview updates must feel:
- instant
- smooth
- responsive

Avoid:
- full page rerenders
- expensive hydration
- unnecessary iframe reloads

Prefer targeted updates.

---

# Component State Rules

Prefer local component state when:
- state is isolated
- state is temporary
- state is not shared

Do NOT globalize everything.

---

# Prop Drilling Rules

Avoid deep prop drilling.

If data passes through more than 2-3 layers:
consider:
- Zustand
- context
- composition refactor

---

# React Context Usage

Use React Context sparingly.

Good use cases:
- theme
- auth provider
- lightweight shared configuration

Avoid using Context for:
- large editor state
- highly dynamic data
- frequently changing state

---

# Derived State Rules

Avoid duplicated derived state.

Bad:

```ts
const [fullName, setFullName] = useState("");
```

when it can be computed from:

```ts
firstName + lastName
```

Prefer computed values.

---

# Async State Handling

Always handle:
- loading
- success
- error
- empty states

Avoid silent failures.

---

# Optimistic Updates

Use optimistic UI carefully.

Good for:
- editor updates
- quick settings changes
- lightweight interactions

Avoid optimistic updates for:
- payments
- publishing
- destructive operations

---

# Persistence Rules

Persist only critical state.

Avoid persisting:
- transient UI state
- large unnecessary payloads
- temporary animation state

Keep local storage clean and lightweight.

---

# Performance Rules

State updates should remain performant.

Avoid:
- excessive subscriptions
- global rerenders
- deeply nested state trees

Prefer:
- flat structures
- selective subscriptions
- modular stores

---

# Form State Rules

Use:
- React Hook Form
- Zod validation

Avoid managing large forms manually with useState.

Forms must remain:
- performant
- scalable
- validated

---

# Error Handling

State management must gracefully handle:
- API failures
- stale state
- invalid data
- disconnected sessions

Never crash the editor because of state inconsistency.

---

# Data Normalization

Avoid deeply nested state structures.

Prefer normalized structures where possible.

Bad:

```ts
wedding.events[0].guests[0].details
```

Prefer flatter scalable structures.

---

# Debugging Philosophy

State should remain:
- easy to inspect
- easy to trace
- easy to reason about

Avoid hidden side effects.

---

# Final Principles

Always prioritize:
1. simplicity
2. predictability
3. performance
4. maintainability
5. smooth UX

The editor experience should always feel:
- instant
- stable
- responsive
- reliable