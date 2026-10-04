"use client";

import { create } from "zustand";
import type { WeddingData } from "@/types/wedding.types";

type SaveState = "idle" | "saving" | "saved" | "error";

interface InvitationEditorState {
  draft: WeddingData | null;
  /** Changes only for user edits, never for acknowledged server metadata. */
  editVersion: number;
  savedEditVersion: number;
  saveState: SaveState;
  saveMessage: string;
  lastSavedAt: string | null;
  initialize: (draft: WeddingData) => void;
  updateDraft: (updater: (draft: WeddingData) => WeddingData) => void;
  acknowledgeWrite: (content: WeddingData, savedVersion: number) => void;
  setSaveState: (state: SaveState, message?: string) => void;
}

export const useInvitationEditorStore = create<InvitationEditorState>((set) => ({
  draft: null,
  editVersion: 0,
  savedEditVersion: 0,
  saveState: "idle",
  saveMessage: "",
  lastSavedAt: null,
  initialize: (draft) => set({
    draft, editVersion: 0, savedEditVersion: 0, saveState: "saved", saveMessage: "Loaded",
    lastSavedAt: draft.meta.updatedAt ?? null,
  }),
  updateDraft: (updater) => set((state) => {
    if (!state.draft) return state;
    const next = updater(state.draft);
    if (JSON.stringify(next) === JSON.stringify(state.draft)) return state;
    return {
      // Local inputs cannot rename links or modify publication bookkeeping.
      draft: { ...next, id: state.draft.id, slug: state.draft.slug,
        status: state.draft.status, meta: state.draft.meta },
      editVersion: state.editVersion + 1,
      saveState: state.saveState === "error" ? "error" : "idle",
      saveMessage: state.saveState === "error" ? state.saveMessage : "Unsaved changes",
    };
  }),
  acknowledgeWrite: (content, savedVersion) => set((state) => {
    if (!state.draft || state.draft.id !== content.id) return state;
    const hasNewEdits = state.editVersion !== savedVersion;
    return {
      // Preserve newer fields while adopting authoritative revision/link/status.
      draft: hasNewEdits
        ? { ...state.draft, slug: content.slug, status: content.status, meta: content.meta }
        : content,
      savedEditVersion: savedVersion,
      lastSavedAt: content.meta.updatedAt ?? null,
      saveState: hasNewEdits ? "idle" : "saved",
      saveMessage: hasNewEdits ? "Unsaved changes" : "Saved privately",
    };
  }),
  setSaveState: (saveState, saveMessage = "") => set({ saveState, saveMessage }),
}));
