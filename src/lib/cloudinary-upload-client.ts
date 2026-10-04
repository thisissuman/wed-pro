import { isAllowedUploadFile, type UploadResourceType } from "@/lib/cloudinary-upload-policy";

interface UploadAuthorization { cloudName: string; apiKey: string; resourceType: UploadResourceType; params: Record<string, string>; signature: string; ticket: string }
/** Only metadata traverses Next.js; bytes go directly to Cloudinary. */
export async function uploadToCloudinary(file: Blob, options: {
  folder?: string; resourceType?: UploadResourceType; fileName?: string;
  onProgress?: (percent: number) => void; signal?: AbortSignal;
} = {}): Promise<string> {
  const resourceType = options.resourceType ?? "image";
  const fileName = options.fileName ?? "upload.jpg";
  if (!isAllowedUploadFile(file.size, file.type, fileName, resourceType)) throw new Error("Use a supported photo up to 8 MB or audio file up to 12 MB.");
  const controller = new AbortController();
  const cancel = () => controller.abort();
  options.signal?.addEventListener("abort", cancel, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timer = setTimeout(cancel, 120_000);
  const jsonRequest = async (path: string, body: unknown) => {
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: controller.signal });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Could not finish the upload.");
    return data;
  };
  try {
    options.onProgress?.(0);
    const authorization = await jsonRequest("/api/cloudinary/upload", { folder: options.folder, resourceType, size: file.size, mimeType: file.type, fileName }) as UploadAuthorization;
    if (controller.signal.aborted) throw new DOMException("Upload cancelled", "AbortError");
    if (!/^[a-zA-Z0-9_-]+$/.test(authorization.cloudName) || authorization.resourceType !== resourceType) throw new Error("Invalid upload authorization.");
    const body = new FormData();
    body.append("file", file, fileName);
    body.append("api_key", authorization.apiKey);
    body.append("signature", authorization.signature);
    for (const [key, value] of Object.entries(authorization.params)) body.append(key, value);
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const abort = () => xhr.abort();
      const cleanup = () => controller.signal.removeEventListener("abort", abort);
      xhr.upload.addEventListener("progress", event => {
        if (event.lengthComputable) options.onProgress?.(Math.min(95, Math.round(event.loaded / event.total * 95)));
      });
      xhr.addEventListener("load", () => {
        cleanup();
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error("Cloudinary rejected the upload. Check its signed preset or retry with a supported file."));
      });
      xhr.addEventListener("error", () => { cleanup(); reject(new Error("Connection interrupted while uploading. Please try again.")); });
      xhr.addEventListener("timeout", () => { cleanup(); reject(new Error("Upload timed out. Please try again.")); });
      xhr.addEventListener("abort", () => { cleanup(); reject(new DOMException("Upload cancelled", "AbortError")); });
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${authorization.cloudName}/${resourceType}/upload`);
      xhr.timeout = 100_000;
      controller.signal.addEventListener("abort", abort, { once: true });
      if (controller.signal.aborted) { cleanup(); reject(new DOMException("Upload cancelled", "AbortError")); return; }
      xhr.send(body);
    });
    const result = await jsonRequest("/api/cloudinary/complete", { ticket: authorization.ticket }) as { secure_url?: string };
    if (!result.secure_url) throw new Error("Upload confirmation returned no URL.");
    options.onProgress?.(100);
    return result.secure_url;
  } catch (error) {
    if (controller.signal.aborted) throw new Error(options.signal?.aborted ? "Upload cancelled. Existing media is unchanged." : "Upload timed out. Existing media is unchanged; please try again.");
    throw error;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", cancel);
  }
}
