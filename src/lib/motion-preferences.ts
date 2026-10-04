/** Call at interaction time so changes to the OS preference are respected. */
export function getPreferredScrollBehavior(): ScrollBehavior {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "instant"
    : "smooth";
}
