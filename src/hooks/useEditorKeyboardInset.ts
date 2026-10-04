"use client";

import { useEffect, useState } from "react";

/** Keep the mobile action bar above the software keyboard where VisualViewport is available. */
export function useEditorKeyboardInset() {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const focused = document.activeElement;
        const editing = focused instanceof HTMLElement && focused.closest(".editor-workspace") &&
          focused.matches("input, textarea, select, [contenteditable='true']");
        const covered = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
        const next = editing && covered > 150 ? covered : 0;
        setInset(next);
        if (next && focused instanceof HTMLElement) focused.scrollIntoView({ block: "nearest", behavior: "instant" });
      });
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, []);
  return inset;
}
