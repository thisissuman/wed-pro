# Git Rules & Best Practices

This document outlines the Git workflows, branching strategies, and commit conventions for the Vivaha Studio (`wed-pro`) project. Following these rules ensures clean history, smooth collaboration, and stable MVP iteration.

## 1. Branching Strategy

For this MVP phase, we use a simplified **GitHub Flow**:

*   **`main`**: The production-ready branch. Code here is always deployable to Vercel.
*   **Feature Branches (`feat/...`)**: Used for building new features (e.g., `feat/dashboard-editor`, `feat/royal-template`).
*   **Bugfix Branches (`fix/...`)**: Used for fixing bugs (e.g., `fix/hydration-mismatch`, `fix/mobile-gallery`).
*   **Chore/Refactor Branches (`chore/...` or `refactor/...`)**: Used for updating dependencies or cleaning up architecture (e.g., `chore/update-supabase`, `refactor/template-renderer`).

**Rule:** Never push directly to `main`. Always create a branch, commit your changes, and merge them back via a Pull Request (or fast-forward merge if working solo).

## 2. Commit Message Conventions

We strictly follow **Conventional Commits**. This makes it easy to read history, understand the timeline, and eventually automate changelogs.

**Format:**
```text
<type>(<optional scope>): <description>

[optional body]
```

**Allowed Types:**
*   `feat`: A new feature (e.g., `feat(templates): add modern minimal template`)
*   `fix`: A bug fix (e.g., `fix(preview): resolve hydration mismatch in countdown`)
*   `docs`: Documentation changes only (e.g., `docs(rules): update architecture guidelines`)
*   `style`: Code style changes (formatting, missing semi-colons, etc.)
*   `refactor`: A code change that neither fixes a bug nor adds a feature (e.g., `refactor(sections): decouple layout from content`)
*   `perf`: A code change that improves performance (e.g., `perf(images): migrate background images to next/image`)
*   `test`: Adding or correcting tests
*   `chore`: Changes to the build process, tooling, or environment configuration

**Best Practices for Commits:**
*   **Write in the imperative:** "Add editor", not "Added editor" or "Adds editor".
*   **Keep commits small & atomic:** Don't bundle a massive styling update with a backend database schema change. Commit them separately.

## 3. Working with `.gitignore`

Ensure sensitive and generated files are never committed to the repository. The following MUST be in `.gitignore`:
*   `node_modules/`
*   `.next/`
*   `.env`, `.env.local`, `.env.*.local` (**CRITICAL:** Never commit Supabase secret keys!)
*   `.DS_Store`
*   `coverage/`

## 4. Handling Supabase Database Changes

Since we are using Supabase as our backend, database schema changes must be version-controlled alongside your code.
*   **Rule:** Avoid making structural database changes (creating tables, changing columns) directly in the Supabase UI on Production.
*   **Workflow:** Use the Supabase Local CLI. Generate migrations for your changes:
    `supabase db commit -m "add_invitations_table"`
*   Commit the generated SQL migration files located in `supabase/migrations/` to your Git repository.

## 5. Pull Requests & Merging

When your feature branch is complete:
1.  **Rebase or Merge `main`:** Ensure your branch is up-to-date with `main` before submitting.
2.  **Squash and Merge:** When merging a feature branch into `main`, use "Squash and Merge". This compresses all your small intermediate commits (e.g., "fix typo") into one single, clean feature commit on the `main` timeline.
3.  **Self-Review:** Even if working solo, reviewing your own diff before merging is a great way to catch rogue `console.log` statements or commented-out code.

## 6. Next.js & Frontend Specifics

*   **Public Assets:** Images in `/public` should be committed, but ensure they are heavily compressed (WebP/AVIF). Do not commit 10MB raw high-res photos to Git.
*   **Config Files:** `next.config.ts`, `tailwind.config.ts`, and `tsconfig.json` are critical infrastructure. Any changes to them should be committed with a `chore(config): ...` message.
