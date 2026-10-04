/** Small same-origin JSON only; uploaded file bytes never pass through the app. */
export async function readUploadRequest(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new Error("Send upload metadata as JSON.");
  const origin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  // Next may construct an internal localhost URL. Host identifies the public
  // request authority; browsers cannot override Host on a cross-origin fetch.
  // Never accept an arbitrary forwarded host or merely matching a URL suffix.
  const host = request.headers.get("host");
  if (host) requestUrl.host = host;
  if (!origin || origin !== requestUrl.origin) throw new Error("Upload requests must come from this site.");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing upload metadata.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 8192) { await reader.cancel(); throw new Error("Upload metadata is too large."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid upload metadata.");
  return parsed as Record<string, unknown>;
}
