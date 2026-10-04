export const UPLOAD_POLICY = {
  image: { maxBytes: 8 * 1024 * 1024, formats: ["jpg", "jpeg", "png", "webp", "heic"], mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"] },
  video: { maxBytes: 12 * 1024 * 1024, formats: ["mp3", "m4a", "wav", "aac", "ogg"], mimeTypes: ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/m4a", "audio/x-m4a", "audio/wav", "audio/x-wav", "audio/aac", "audio/ogg"] },
} as const;
export type UploadResourceType = keyof typeof UPLOAD_POLICY;
export function isUploadResourceType(value: unknown): value is UploadResourceType { return value === "image" || value === "video"; }
export function isAllowedUploadFile(size: number, mimeType: string, fileName: string, resourceType: UploadResourceType) {
  const policy = UPLOAD_POLICY[resourceType];
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  return Number.isSafeInteger(size) && size > 0 && size <= policy.maxBytes &&
    (policy.mimeTypes.some(type => type === mimeType) || (!mimeType && policy.formats.some(format => format === extension)));
}
