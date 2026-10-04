import type { WeddingData } from "@/types/wedding.types";

let recoveryOwner: string | null = null;
export function setRecoveryOwner(ownerId: string | null) { recoveryOwner = ownerId; }

const PREFIX = "wed-pro:recovery:v1:";
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
export interface RecoveryCopy { ownerId: string; invitationId: string; revision: number; savedAt: number; content: WeddingData }
const key = (ownerId: string, invitationId: string) => `${PREFIX}${ownerId}:${invitationId}`;

export function readRecovery(ownerId: string, invitationId: string): RecoveryCopy | null {
  try {
    const raw = localStorage.getItem(key(ownerId, invitationId));
    if (!raw) return null;
    const copy = JSON.parse(raw) as RecoveryCopy;
    if (copy.ownerId !== ownerId || copy.invitationId !== invitationId ||
        !Number.isFinite(copy.savedAt) || copy.savedAt > Date.now() || Date.now() - copy.savedAt > MAX_AGE ||
        !Number.isSafeInteger(copy.revision) || copy.revision < 0 ||
        copy.content?.id !== invitationId || copy.content?.meta?.userId !== ownerId ||
        !copy.content.couple?.bride || !copy.content.couple?.groom || !Array.isArray(copy.content.events)) {
      removeRecovery(ownerId, invitationId);
      return null;
    }
    return copy;
  } catch { return null; }
}
export function writeRecovery(content: WeddingData): boolean {
  const ownerId = content.meta.userId;
  if (!ownerId || recoveryOwner !== ownerId) return false;
  try {
    const copy: RecoveryCopy = { ownerId, invitationId: content.id,
      revision: content.meta.draftRevision ?? 0, savedAt: Date.now(), content };
    localStorage.setItem(key(ownerId, content.id), JSON.stringify(copy));
    return true;
  } catch { return false; }
}
export function removeRecovery(ownerId: string, invitationId: string) {
  try { localStorage.removeItem(key(ownerId, invitationId)); } catch { /* Storage may be unavailable. */ }
}
/** Sign-out/account changes remove private copies, including unopened invitations. */
export function clearRecoveryCopies() {
  try {
    for (const storageKey of Object.keys(localStorage)) {
      if (storageKey.startsWith(PREFIX)) localStorage.removeItem(storageKey);
    }
  } catch { /* Never prevent sign-out when browser storage is unavailable. */ }
}
