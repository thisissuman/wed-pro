// The root boundary installs this dispatcher before Next's passive router
// listener. An editor mounted later supplies only its current guarded handler.
let activeGuard: ((event: PopStateEvent) => void) | null = null;
export function dispatchEditorHistory(event: PopStateEvent) { activeGuard?.(event); }
export function registerEditorHistoryGuard(handler: (event: PopStateEvent) => void) {
  activeGuard = handler;
  return () => { if (activeGuard === handler) activeGuard = null; };
}
