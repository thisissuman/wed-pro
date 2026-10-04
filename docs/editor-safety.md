# Editor navigation, recovery, and publish readiness

Tasks 04–05: implemented; verification deferred to task 16. Read alongside [invitation persistence](invitation-persistence.md). No migration has been applied.

## Leaving the editor

The editor tracks user-edit and acknowledged-save versions separately. A same-value input blur does not create a new edit. Pending edits, dispatched writes, and save/error states trigger protection; a fully saved editor navigates normally.

Same-tab links (including Dashboard and another invitation) are captured before Next.js navigates. The owner chooses **Save and leave**, **Discard and leave**, or **Cancel**. Save waits for the coordinated write queue, drains the latest private fields, and leaves only after a positive save acknowledgement with no newer edits. Failure keeps the editor and recovery copy available. Discard cancels timers/queued unsent content, waits for a dispatched request, then leaves; it cannot undo content that already reached the server. Cancel preserves the editor. Publication actions and a pending leave action prevent duplicate choices.

Browser Back/Forward within the application are captured before the router changes the React tree while protection is needed. The current URL/history state is restored for the choice; accepting this navigation replaces that restored entry with the requested destination. Cancel keeps the current page; this can discard the browser's former forward-history branch. Cross-document history traversal, reload, and close use the browser's native beforeunload warning, which cannot reliably perform asynchronous saves and may be suppressed by mobile browsers. Recovery copies provide the fallback. New-tab/modified clicks leave the current editor open and do not prompt. Future programmatic navigation added inside the editor must go through the same leave flow; automatic auth redirects are covered by recovery/owner cleanup, not by intercepting arbitrary router methods.

## Recovery copies

Browser localStorage stores only unsaved/error/in-flight WeddingData, synchronously on store changes, scoped by authenticated owner ID plus invitation ID. It contains private invitation details on this device; it is not encrypted or a server backup. Preview dimensions, accordion position, dialogs, crop data, upload progress, and studio theme are excluded.

Copies expire after seven days. Opening that invitation as the same owner offers Restore private edits or Keep server version; never auto-publish or silently auto-restore. A changed server revision gets a warning before adopting recovered fields onto the current server identity/revision. Slug, status, and publication metadata always come from the current server row. The owner deliberately chooses which recovered fields to use, then reviews before publishing. Normal database revision guards still protect later concurrent changes.

A completed save with no newer edits, explicit discard, or keeping the server version clears the copy. AuthProvider clears private copies on explicit sign-out and account changes; write guards prevent a late response from recreating another owner's copy. Missing or full browser storage shows a warning to keep the tab open or copy fields before reloading. Session loss/sign-out can remove recovery for privacy; do not treat local storage as guaranteed durable retention. Another browser tab's recovery for the same owner/invitation shares a key; cross-tab database writes remain revision-guarded and the recovery prompt is always explicit.

Failed/uncertain writes never claim success. Retry private save uses the write queue. Conflicts and uncertain timeouts require confirmation against the saved server revision; preserve/recover local fields before reloading. An uncertain publication with no private edits requires retrying/confirming publication rather than treating a no-op save as proof of publication success.

## Publish contract

`src/lib/publish-readiness.ts` supplies the shared editor/helper contract. `20261004060252_publish_readiness.sql` adds the equivalent authoritative database validator inside the owner/revision-guarded publish transaction. It requires the pending task 01 migration first. Anonymous/non-owner calls remain rejected; direct authenticated RPC calls cannot bypass the saved-row checklist. Autosave remains permissive for partially completed forms. Unpublish is not gated by readiness.

Required for Publish and Republish:

- Both couple names are nonempty and are not starter labels such as Bride Name/Groom Name. The application cannot prove a person's legal identity; it rejects known placeholders rather than inventing restrictions on real names.
- A real calendar wedding date, plus at least one event with title, calendar date, time (24-hour HH:MM or 12-hour H:MM AM/PM), and non-placeholder venue name. Past dates remain allowed for existing invitations.
- Main venue name and at least one usable address, HTTP/HTTPS map link, or bounded numeric coordinates.
- When RSVP is enabled, a WhatsApp number (10–15 digits with optional +; spaces/hyphens normalized) or nonempty HTTP/HTTPS external RSVP URL. Hiding RSVP removes its destination requirement.
- Media/share-image URLs are hosted HTTP/HTTPS or safe root-relative paths for existing local assets. External RSVP/map links require HTTP/HTTPS. Inline data, blob, JavaScript, file, protocol-relative paths, backslashes, controls, and credential-bearing external URLs are rejected. Optional blank links remain allowed. Unsupported links are rejected even in hidden sections, with a clear/remove action.

Story, portraits, gallery photos, music, and explicit share images remain optional. Recognizable sample story descriptions and stock gallery URLs require explicit `demoContentAcknowledged: true` when included; owners can replace/remove them or hide the optional story instead. The acknowledgement is stored in working content and promoted only through publishing. Starter labels for names/venues cannot be acknowledged away. The acknowledgement covers recognizable stock/story content, not arbitrary claims about photo ownership or externally pasted text.

After a Publish attempt, the editor shows actionable required-field errors and a checklist that opens the matching mobile step/desktop accordion. URL issues can be cleared without rewriting unrelated fields. Dashboard publishing uses the same helper and directs invalid invitations back to the editor. New local edits are validated again after the queue drains; database validation uses exactly the saved revision being promoted.

The checklist uses a compact studio-themed card with section labels, plain-language messages and full-width keyboard-focusable field actions. Its summary describes readiness without claiming that pending or failed saves succeeded. Demo-content acknowledgement has a short heading and separate explanatory text. These are presentation changes only: venue, event and enabled RSVP requirements remain enforced by the existing shared/database validators.

Legacy `rsvp.type = form` maps to external-link mode when a form URL is present, otherwise WhatsApp. Legacy wedding-date absence falls back to the first stored event date or countdown date, without generating a fake date. Missing optional story/gallery collections normalize to empty arrays rather than inserting demo content into an existing invitation. Guest and owner preview rendering strip unsupported legacy URL protocols without rewriting the stored JSONB; old published snapshots continue to render until intentionally republished. Metadata and page rendering use the same sanitized published document.

Task 16 must reconcile frontend/database parity, legacy shapes, navigation/history behavior, storage failure/privacy, conflicting tabs, delayed responses, and checklist focus/mobile layout. No checks/tests or migration application occurred while implementing this contract.

Task 16 browser Back regression: the root EditorHistoryBoundary registers a capture dispatcher in a layout effect before Next’s passive router listener. The active editor supplies its guarded handler and unregisters on unmount; other routes have no guard. Late editor-only registration could allow a client-entered editor to unmount before its prompt. The handler preserves Next history state while restoring the current URL for save/discard/cancel; no custom router sentinel or extra dirty-history entry is introduced. Browser regression covers failed-save Back, cancel, explicit discard and recovery clearing.
