"use client";

import { create } from "zustand";
import type { WeddingData } from "@/types/wedding.types";

type SaveState = "idle" | "saving" | "saved" | "error";

interface InvitationEditorState {
  draft: WeddingData | null;
  saveState: SaveState;
  saveMessage: string;
  lastSavedAt: string | null;
  initialize: (draft: WeddingData) => void;
  updateDraft: (updater: (draft: WeddingData) => WeddingData) => void;
  replaceDraft: (draft: WeddingData) => void;
  setSaveState: (state: SaveState, message?: string) => void;
  setLastSavedAt: (value: string | null) => void;
}

export const useInvitationEditorStore = create<InvitationEditorState>((set) => ({
  draft: null,
  saveState: "idle",
  saveMessage: "",
  lastSavedAt: null,
  initialize: (draft) =>
    set({
      draft,
      saveState: "saved",
      saveMessage: "Loaded",
      lastSavedAt: draft.meta.updatedAt ?? null,
    }),
  updateDraft: (updater) =>
    set((state) => {
      if (!state.draft) {
        return state;
      }

      return {
        draft: updater(state.draft),
        saveState: "idle",
        saveMessage: "Unsaved changes",
      };
    }),
  replaceDraft: (draft) =>
    set({
      draft,
      saveState: "saved",
      saveMessage: "Saved",
      lastSavedAt: draft.meta.updatedAt ?? new Date().toISOString(),
    }),
  setSaveState: (saveState, saveMessage = "") => set({ saveState, saveMessage }),
  setLastSavedAt: (lastSavedAt) => set({ lastSavedAt }),
}));
