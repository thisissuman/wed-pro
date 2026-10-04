# Keyboard and overlay contract

Task 08 implemented; verification deferred to task 16. The installed Radix Dialog primitive supplies shared mechanics through `src/components/ui/ModalSurface.tsx`. Preserve this dependency during cleanup.

Existing crop, navigation/recovery, quota, publish/share, delete/unpublish, mobile preview, gallery, and opener surfaces retain their layouts. Each modal has a generated unique title/label association and `aria-modal`, focus containment/Tab cycling, background screen-reader isolation and pointer blocking, and shared scroll locking. Radix manages the active nested focus scope and topmost Escape dismissal. No component should independently overwrite body overflow or add a document-wide Escape handler for these overlays.

Initial focus goes to an explicit `data-dialog-initial-focus` control where appropriate, otherwise Radix chooses a focusable control. Destructive actions and save/discard navigation start on Cancel; crop starts on Zoom. Crop uses the library's arrow-key crop area plus labelled zoom and upload/error controls. The file picker is opened by the labelled upload button; closing crop restores that button explicitly.

Ordinary dismissal restores the connected opener control. When deletion or navigation removes it, focus falls back to the remaining dialog or main heading/content. Delete/unpublish and navigation dialogs block dismissal while their action is busy. Crop dismissal aborts the pending upload. Focus cannot escape to the background while a modal is active.

Template overlays render inline to inherit theme variables, typography zoom, and existing animation placement; dashboard/editor overlays portal to the body. Gallery ArrowLeft/ArrowRight handlers live on the active modal rather than the window. Close/Escape, navigation buttons, image captions/count announcements, vertical drag dismissal, and existing touch behavior are retained.

Invitation covers expose a keyboard Open control. Escape follows the same opening transition; focus moves into the revealed invitation after closing. Hidden invitation content is inert while the shared opener is present and remains in server HTML. Session-seen and bypass flows preserve access to the content.

Shared field selects and typography-size selection use styled native select controls, with native arrow/selection/Escape behavior and coherent names. Text helper and error messages use per-instance IDs associated with the fields. Quiz choices expose pressed state.

## Deferred cases

At task 16, author/run keyboard and screen-reader coverage: initial/return focus, Tab/Shift+Tab loops, topmost Escape, rapid reopening and removed triggers, nested mobile-preview → gallery and crop/navigation overlays, body scroll restoration, background touch/reading isolation, native selects on desktop/mobile, field labels/error announcements, crop arrows/zoom/cancellation, gallery arrows/drag/buttons, all three openers with session storage blocked/seen/bypass/reduced motion, zoom/theme inheritance and narrow-screen dialog scrolling. Perform applicable UI-skill detector/screenshots/manual QA only then. No such checks were run during implementation.

Task 14 removes the unreachable calculator/quiz modules; active Radix overlay consumers remain. See [cleanup decisions](cleanup-decisions.md).

Task 16: TextInput/TextArea names now reference only their visible label span; helper/error text remains aria-describedby rather than changing the field name when validation appears. Audio file fields use unique labels/error descriptions; image/audio remove and private-save retry controls retain 44px targets. The editor grid uses a bounded mobile track so focusable modal/action controls remain inside the visible viewport.
