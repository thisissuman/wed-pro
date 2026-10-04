"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { useAuth } from "@/components/providers/AuthProvider";
import { useInvitationEditorStore } from "@/stores/invitation-editor-store";
import { normalizeInvitationRow } from "@/lib/invitations";
import { readRecovery, writeRecovery, removeRecovery, type RecoveryCopy } from "@/lib/invitation-recovery";
import type { WeddingData } from "@/types/wedding.types";
import { registerEditorHistoryGuard } from "@/lib/editor-history";

interface Props {
  initialData: WeddingData;
  flush: () => Promise<boolean>;
  discard: () => Promise<boolean>;
  busy: boolean;
}
const needsProtection = () => {
  const state = useInvitationEditorStore.getState();
  return state.editVersion !== state.savedEditVersion || state.saveState === "error" || state.saveState === "saving";
};

export function EditorNavigationGuard({ initialData, flush, discard, busy }: Props) {
  const router = useRouter();
  const actionBusy = useRef(busy);
  useEffect(() => { actionBusy.current = busy; }, [busy]);
  const { user } = useAuth();
  const [destination, setDestination] = useState<{ url: string; replace: boolean } | null>(null);
  const [recovery, setRecovery] = useState<RecoveryCopy | null>(null);
  const recovering = useRef(false);
  const allowed = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);
  const [error, setError] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  useEffect(() => {
    const owner = initialData.meta.userId;
    if (!owner || user?.id !== owner) return;
    const copy = readRecovery(owner, initialData.id);
    let active = true;
    if (copy) {
      recovering.current = true;
      queueMicrotask(() => { if (active) setRecovery(copy); });
    }
    const unsubscribe = useInvitationEditorStore.subscribe((state) => {
      if (!state.draft || state.draft.id !== initialData.id || recovering.current || allowed.current) return;
      if (needsProtection()) {
        if (!writeRecovery(state.draft)) setStorageWarning(true);
      } else removeRecovery(owner, initialData.id);
    });
    return () => { active = false; unsubscribe(); };
  }, [initialData, user?.id]);

  useEffect(() => {
    const currentUrl = window.location.href;
    const currentHistoryState = window.history.state;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (allowed.current || (!needsProtection() && !actionBusy.current)) return;
      const draft = useInvitationEditorStore.getState().draft;
      if (draft && user?.id === draft.meta.userId) writeRecovery(draft);
      event.preventDefault();
      event.returnValue = "";
    };
    const click = (event: MouseEvent) => {
      if (allowed.current || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (!needsProtection() && !actionBusy.current)) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.download || (anchor.target && anchor.target !== "_self")) return;
      const target = new URL(anchor.href, currentUrl);
      if (!/^https?:$/.test(target.protocol) || target.href === currentUrl ||
          (target.origin === location.origin && target.pathname === location.pathname && target.search === location.search)) return;
      event.preventDefault();
      event.stopPropagation();
      setError("");
      setDestination({ url: target.href, replace: false });
    };
    const pop = (event: PopStateEvent) => {
      if (allowed.current || (!needsProtection() && !actionBusy.current) || window.location.href === currentUrl) return;
      const target = window.location.href;
      // Keep the current React tree while the owner chooses. Preserve Next's
      // history state rather than replacing it with a custom router sentinel.
      event.stopImmediatePropagation();
      window.history.pushState(currentHistoryState, "", currentUrl);
      setError("");
      setDestination({ url: target, replace: true });
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", click, true);
    const unregisterHistory = registerEditorHistoryGuard(pop);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", click, true);
      unregisterHistory();
    };
  }, [initialData.id, user?.id]);

  const leave = async (save: boolean) => {
    if (!destination || busy || leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    setError("");
    try {
      const success = await (save ? flush() : discard());
      if (!alive.current) return;
      if (!success || (save && needsProtection())) {
        setError(useInvitationEditorStore.getState().saveMessage || "Could not finish saving. Your edits remain here; retry or cancel.");
        return;
      }
      if (initialData.meta.userId) removeRecovery(initialData.meta.userId, initialData.id);
      allowed.current = true;
      const target = new URL(destination.url);
      if (target.origin !== location.origin) window.location.assign(target.href);
      else {
        const href = `${target.pathname}${target.search}${target.hash}`;
        if (destination.replace) router.replace(href); else router.push(href);
      }
    } catch (cause) {
      if (alive.current) setError(cause instanceof Error ? cause.message : "Could not leave safely. Please retry.");
    } finally {
      leavingRef.current = false;
      if (alive.current) setLeaving(false);
    }
  };

  const restore = () => {
    if (!recovery) return;
    // Explicitly adopt recovered fields onto the current server identity and
    // revision. A stale copy never restores old status/link/publication metadata.
    const content = normalizeInvitationRow({ id: initialData.id, user_id: initialData.meta.userId!,
      slug: initialData.slug, template_id: initialData.templateId, status: initialData.status,
      content: recovery.content, created_at: initialData.meta.createdAt!, updated_at: initialData.meta.updatedAt!,
      published_at: initialData.meta.publishedAt ?? null, first_published_at: initialData.meta.firstPublishedAt ?? null,
      draft_revision: initialData.meta.draftRevision ?? 0 });
    recovering.current = false;
    useInvitationEditorStore.getState().updateDraft(() => content);
    setRecovery(null);
  };
  const discardRecovery = () => {
    if (initialData.meta.userId) removeRecovery(initialData.meta.userId, initialData.id);
    recovering.current = false;
    setRecovery(null);
  };

  return <>
    {storageWarning && <p role="alert" className="mb-4 text-sm text-error">Browser recovery storage is unavailable. Keep this tab open until private saving succeeds, or copy your edits before reloading.</p>}
    <Dialog open={Boolean(recovery)} onOpenChange={(open) => { if (!open) discardRecovery(); }} title="Recover private edits?">
      <div className="space-y-4 overflow-y-auto p-5 text-sm text-on-surface">
        <p>This browser has an unsaved copy for this invitation. Restore it as private edits, or keep the saved server version.</p>
        {recovery && recovery.revision !== (initialData.meta.draftRevision ?? 0) && <p className="text-error">The server revision changed. Restoring will use the recovered fields with the current revision; review them before publishing.</p>}
        <p className="text-on-surface-variant">A recovery copy never publishes automatically.</p>
        <button type="button" onClick={restore} className="min-h-11 rounded-full gold-gradient px-5 text-charcoal-black">Restore private edits</button>
        <button type="button" onClick={discardRecovery} className="ml-3 min-h-11 px-3">Keep server version</button>
      </div>
    </Dialog>
    <Dialog dismissible={!leaving && !busy} open={Boolean(destination)} onOpenChange={(open) => { if (!open && !leaving && !busy) setDestination(null); }} title="Save before leaving?">
      <div className="space-y-4 p-5 text-sm text-on-surface">
        <p>Save your private edits before leaving, discard unsent edits, or stay here. An already sent request may finish even if you discard.</p>
        {error && <p role="alert" className="text-error">{error}</p>}
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={leaving || busy} onClick={() => void leave(true)} className="min-h-11 rounded-full gold-gradient px-5 text-charcoal-black disabled:opacity-50">{leaving ? "Please wait…" : "Save and leave"}</button>
          <button type="button" disabled={leaving || busy} onClick={() => void leave(false)} className="min-h-11 rounded-full border border-error/30 px-5 disabled:opacity-50">Discard and leave</button>
          <button type="button" disabled={leaving || busy} data-dialog-initial-focus onClick={() => setDestination(null)} className="min-h-11 px-5 disabled:opacity-50">Cancel</button>
        </div>
      </div>
    </Dialog>
  </>;
}
