"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  publishInvitation, saveInvitationDraft, unpublishInvitation,
  type PublishOutcome, type UnpublishOutcome,
} from "@/lib/publish";
import { useInvitationEditorStore } from "@/stores/invitation-editor-store";
import type { WeddingData } from "@/types/wedding.types";

interface WriteSession {
  id: string;
  active: boolean;
  revision: number;
  savedVersion: number;
  tail: Promise<void>;
  timer: ReturnType<typeof setTimeout> | null;
  action: "publish" | "unpublish" | "save" | null;
  /** A failed/uncertain write needs an explicit action, not a retry loop. */
  failed: boolean;
  discarding: boolean;
}

const inactiveMessage = "The editor changed. Open the invitation again to continue.";

/** One ordered pipeline per mounted invitation. Timers never capture old drafts. */
export function useInvitationPersistence(initialData: WeddingData, supabase: SupabaseClient | null) {
  const sessionRef = useRef<WriteSession | null>(null);
  const [actionState, setActionState] = useState<{ data: WeddingData; action: WriteSession["action"] } | null>(null);
  const action = actionState?.data === initialData ? actionState.action : null;
  const editVersion = useInvitationEditorStore((state) => state.editVersion);

  const isCurrent = useCallback((session: WriteSession) =>
    session.active && sessionRef.current === session &&
    useInvitationEditorStore.getState().draft?.id === session.id, []);

  useEffect(() => {
    const session: WriteSession = {
      id: initialData.id, active: true, revision: initialData.meta.draftRevision ?? 0,
      savedVersion: 0, tail: Promise.resolve(), timer: null, action: null, failed: false, discarding: false,
    };
    sessionRef.current = session;
    useInvitationEditorStore.getState().initialize(initialData);
    return () => {
      session.active = false;
      if (session.timer) clearTimeout(session.timer);
      // A dispatched transaction may finish, but no queued operation or response
      // may touch the next editor. Database revision guards reject stale tabs.
      if (sessionRef.current === session) sessionRef.current = null;
    };
  }, [initialData]);

  const enqueue = useCallback(<T,>(session: WriteSession, operation: () => Promise<T>): Promise<T> => {
    const run = session.tail.then(operation);
    session.tail = run.then(() => undefined, () => undefined);
    return run;
  }, []);

  const fail = useCallback((session: WriteSession, message: string) => {
    session.failed = true;
    if (isCurrent(session)) useInvitationEditorStore.getState().setSaveState("error", message);
  }, [isCurrent]);

  const flushLatest = useCallback(async (session: WriteSession) => {
    if (!supabase) throw new Error("The editor is not connected. Reload to continue.");
    while (isCurrent(session)) {
      if (session.discarding) return;
      const state = useInvitationEditorStore.getState();
      if (!state.draft || state.editVersion === session.savedVersion) return;
      const version = state.editVersion;
      state.setSaveState("saving", "Saving privately");
      const result = await saveInvitationDraft(supabase, state.draft, session.revision);
      if (!isCurrent(session)) throw new Error(inactiveMessage);
      if (!result.ok) throw new Error(result.message);
      session.revision = result.revision;
      session.savedVersion = version;
      session.failed = false;
      useInvitationEditorStore.getState().acknowledgeWrite(result.content, version);
      // Coalesce edits received during the request and drain before publication.
    }
    throw new Error(inactiveMessage);
  }, [isCurrent, supabase]);

  useEffect(() => {
    const session = sessionRef.current;
    if (!session || !isCurrent(session) || session.action || session.failed ||
        editVersion === session.savedVersion) return;
    if (session.timer) clearTimeout(session.timer);
    session.timer = setTimeout(() => {
      session.timer = null;
      void enqueue(session, async () => {
        if (!isCurrent(session) || session.action || session.failed || session.discarding) return;
        try { await flushLatest(session); }
        catch (error) { fail(session, error instanceof Error ? error.message : "Save failed. Please try again."); }
      });
    }, 900);
    return () => { if (session.timer) { clearTimeout(session.timer); session.timer = null; } };
  }, [editVersion, action, enqueue, fail, flushLatest, isCurrent]);

  const runAction = useCallback(async (kind: "publish" | "unpublish"): Promise<PublishOutcome | UnpublishOutcome> => {
    const session = sessionRef.current;
    if (!session || !isCurrent(session) || !supabase) return { ok: false, message: inactiveMessage };
    if (session.action) return { ok: false, message: "Please wait for the current action to finish." };
    // Synchronous guard handles duplicate taps before React rerenders.
    session.action = kind;
    session.failed = false;
    if (session.timer) { clearTimeout(session.timer); session.timer = null; }
    setActionState({ data: initialData, action: kind });
    return enqueue(session, async () => {
      try {
        if (!isCurrent(session)) throw new Error(inactiveMessage);
        await flushLatest(session);
        const state = useInvitationEditorStore.getState();
        if (!isCurrent(session) || !state.draft) throw new Error(inactiveMessage);
        const version = state.editVersion;
        state.setSaveState("saving", kind === "publish" ? "Publishing saved changes" : "Taking invitation offline");
        const result = kind === "publish"
          ? await publishInvitation(supabase, state.draft, session.revision)
          : await unpublishInvitation(supabase, state.draft, session.revision);
        if (!isCurrent(session)) throw new Error(inactiveMessage);
        if (!result.ok) {
          if ("issues" in result && result.issues?.length) {
            const latest = useInvitationEditorStore.getState();
            latest.setSaveState(latest.editVersion === session.savedVersion ? "saved" : "idle", latest.editVersion === session.savedVersion ? "Saved privately" : "Unsaved changes");
            return result;
          }
          throw new Error(result.message);
        }
        session.revision = result.revision;
        useInvitationEditorStore.getState().acknowledgeWrite(result.content, version);
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not finish the action. Please try again.";
        fail(session, message);
        return { ok: false as const, message };
      } finally {
        session.action = null;
        if (isCurrent(session)) {
          setActionState({ data: initialData, action: null });
          // Edits during publication remain private and get one follow-up save.
          // Do not let that failure conceal a successful publication result.
          if (!session.failed && useInvitationEditorStore.getState().editVersion !== session.savedVersion) {
            void enqueue(session, async () => {
              if (!isCurrent(session) || session.action || session.failed || session.discarding) return;
              try { await flushLatest(session); }
              catch (error) { fail(session, error instanceof Error ? error.message : "Save failed. Please try again."); }
            });
          }
        }
      }
    });
  }, [enqueue, fail, flushLatest, initialData, isCurrent, supabase]);

  const retrySave = useCallback(async (): Promise<boolean> => {
    const session = sessionRef.current;
    if (!session || !isCurrent(session) || session.action) return false;
    if (useInvitationEditorStore.getState().editVersion === session.savedVersion) {
      useInvitationEditorStore.getState().setSaveState("error", "Private edits are saved. Retry the publication action, or reload if its result is uncertain.");
      return false;
    }
    session.action = "save";
    session.failed = false;
    if (session.timer) { clearTimeout(session.timer); session.timer = null; }
    setActionState({ data: initialData, action: "save" });
    return enqueue(session, async () => {
      try {
        await flushLatest(session);
        return isCurrent(session);
      }
      catch (error) { fail(session, error instanceof Error ? error.message : "Save failed. Please try again."); return false; }
      finally {
        session.action = null;
        if (isCurrent(session)) setActionState({ data: initialData, action: null });
      }
    });
  }, [enqueue, fail, flushLatest, initialData, isCurrent]);

  const flushForNavigation = useCallback(async (): Promise<boolean> => {
    const session = sessionRef.current;
    if (!session || !isCurrent(session)) return false;
    await session.tail;
    if (!isCurrent(session)) return false;
    const state = useInvitationEditorStore.getState();
    if (state.editVersion === session.savedVersion) return state.saveState === "saved";
    return retrySave();
  }, [isCurrent, retrySave]);

  const discardPending = useCallback(async (): Promise<boolean> => {
    const session = sessionRef.current;
    if (!session || !isCurrent(session) || session.action) return false;
    // Only unsent edits can be discarded. Already dispatched saves may commit.
    session.failed = true;
    session.discarding = true;
    if (session.timer) { clearTimeout(session.timer); session.timer = null; }
    await session.tail;
    if (!isCurrent(session)) return false;
    session.active = false;
    return true;
  }, [isCurrent]);

  return {
    isRetryingSave: action === "save",
    isPublishing: action === "publish",
    isUnpublishing: action === "unpublish",
    publish: () => runAction("publish") as Promise<PublishOutcome>,
    unpublish: () => runAction("unpublish") as Promise<UnpublishOutcome>,
    retrySave, flushForNavigation, discardPending,
  };
}
