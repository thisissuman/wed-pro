/** Explicit public asset namespaces/files, not an extension-based route bypass.
 * Keep src/proxy.ts's literal matcher aligned with this list.
 */
const PUBLIC_ASSET_PREFIXES = ["/media/", "/tap-to-open/", "/_next/static/", "/_next/image/"];
const PUBLIC_ASSET_PATHS = new Set([
  "/_next/static", "/_next/image", "/favicon.ico",
  "/window.svg", "/globe.svg", "/next.svg", "/vercel.svg", "/file.svg",
]);

export function isPublicStaticAsset(pathname: string): boolean {
  return PUBLIC_ASSET_PATHS.has(pathname)
    || PUBLIC_ASSET_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

export function isProtectedApplicationPath(pathname: string): boolean {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}
