# Beta invitation creation contract

Task 07 implemented; verification deferred to task 16.

The beta cap is **three total invitations per owner**, including drafts and published invitations. Count private working rows in `invitations`; public snapshot copies do not consume extra slots. Publishing, republishing, and unpublishing do not change the total. Accounts already at or above three keep every existing invitation and cannot create another until below three. An owner-chosen deletion releases a slot; this migration deletes nothing.

`create_invitation_draft(p_id, p_slug, p_template_id, p_content)` is the sole authenticated creation boundary. It infers ownership from `auth.uid()`, locks that owner's existing `profiles` row for the transaction, then counts and inserts under the REST transaction's READ COMMITTED isolation. Concurrent requests for different owners use different locks. Same-owner requests wait and count the previous committed insertion. Every caller, including direct REST/RPC clients, receives the same quota enforcement.

The RPC checks supported template IDs (including the existing garden-mandap → royal-3d-cinema remap), draft slug syntax, and document shape. Authoritative row metadata overrides client lifecycle fields using `invitation_document`. Authenticated users have no direct table or column INSERT grants or INSERT policy; anonymous users have no creation grant. Existing save/publish/unpublish RPCs only update owner rows and provide no insertion path. Database administrators/service-role credentials remain privileged and must stay server-only; any future administrative creation path must explicitly honor this cap.

A repeated owner-scoped request with the same ID returns its existing row, even when the account has since reached the cap. The template card retains that request ID after an uncertain response, prevents immediate duplicate clicks, times out waiting after 20 seconds, and retries random slug collisions at most three times. Quota errors carry detail `invitation_limit_reached` and open the existing limit dialog. The dialog explains that published invitations count too. Login and template selection remain unchanged.

## Pending rollout and verification

`20261004060253_atomic_invitation_quota.sql` is authored and unapplied. It follows the private snapshot and readiness migrations. Coordinate client/RPC rollout; older direct-insert clients will stop working. In the authorized final stage, reconcile actual grants (including column grants), inherited roles, old functions/views, triggers, profile creation, REST isolation, and schema-cache exposure. Do not grant direct INSERT back to work around deployment ordering.

Deferred: concurrent same-owner creation with 0/2/3 existing invitations; different owners; draft/published mixtures; accounts above cap; deletion racing creation; uncertain-response replay; slug collisions against RLS-hidden rows; anonymous/direct inserts and spoofed-owner documents; missing profiles; rollback/network timeout; all three templates and legacy mapping. Higher isolation may raise serialization errors and requires transaction retry, rather than bypassing the cap.
