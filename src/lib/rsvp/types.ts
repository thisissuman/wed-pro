export type RsvpAttendance = "yes" | "no" | "maybe";

export interface RsvpSubmission {
  invitationId: string;
  name: string;
  attendance: RsvpAttendance;
  guestsCount: number;
  message?: string;
}

export interface RsvpRow {
  id: string;
  invitation_id: string;
  name: string;
  attendance: RsvpAttendance;
  guests_count: number;
  message: string | null;
  created_at: string;
}
