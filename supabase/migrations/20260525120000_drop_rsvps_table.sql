-- Remove in-app RSVP storage; confirmations happen via WhatsApp / external links only.

drop policy if exists "Anyone can submit RSVP for published invitations" on public.rsvps;
drop policy if exists "Authenticated can submit RSVP for published invitations" on public.rsvps;
drop policy if exists "Owners can view RSVPs for their invitations" on public.rsvps;
drop policy if exists "Owners can delete RSVPs for their invitations" on public.rsvps;

drop table if exists public.rsvps;
