"use client";

import { useLayoutEffect } from "react";
import { dispatchEditorHistory } from "@/lib/editor-history";

/** Register before Next's router listener, including client-side editor entry. */
export function EditorHistoryBoundary() {
  useLayoutEffect(() => {
    window.addEventListener("popstate", dispatchEditorHistory, true);
    return () => window.removeEventListener("popstate", dispatchEditorHistory, true);
  }, []);
  return null;
}
