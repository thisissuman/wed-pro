import "server-only";
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { UPLOAD_POLICY, isUploadResourceType, type UploadResourceType } from "@/lib/cloudinary-upload-policy";

export interface UploadTicket { ownerId: string; invitationId: string; resourceType: UploadResourceType; publicId: string; expiresAt: number }
export function getUploadConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const imagePreset = process.env.CLOUDINARY_IMAGE_UPLOAD_PRESET;
  const audioPreset = process.env.CLOUDINARY_AUDIO_UPLOAD_PRESET;
  const folderMode = process.env.CLOUDINARY_FOLDER_MODE;
  if (!cloudName || !/^[a-zA-Z0-9_-]+$/.test(cloudName) || !apiKey || !apiSecret || !imagePreset || !audioPreset || (folderMode !== "fixed" && folderMode !== "dynamic")) return null;
  return { cloudName, apiKey, apiSecret, imagePreset, audioPreset, folderMode };
}
export function issueUpload(config: NonNullable<ReturnType<typeof getUploadConfig>>, ownerId: string, invitationId: string, slot: string, resourceType: UploadResourceType) {
  const folder = `wed-pro/owners/${ownerId}/invitations/${invitationId}/${slot}`;
  const assetId = randomUUID();
  const ticket: UploadTicket = { ownerId, invitationId, resourceType, publicId: `${folder}/${assetId}`, expiresAt: Date.now() + 60 * 60 * 1000 };
  const params: Record<string, string> = {
    timestamp: Math.floor(Date.now() / 1000).toString(),
    upload_preset: resourceType === "image" ? config.imagePreset : config.audioPreset,
    allowed_formats: UPLOAD_POLICY[resourceType].formats.join(","),
    public_id: config.folderMode === "fixed" ? assetId : ticket.publicId,
    overwrite: "false", type: "upload",
    ...(config.folderMode === "fixed" ? { folder } : { asset_folder: folder }),
  };
  const serialized = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join("&");
  const signature = createHash("sha256").update(serialized + config.apiSecret).digest("hex");
  const payload = Buffer.from(JSON.stringify(ticket)).toString("base64url");
  const mac = createHmac("sha256", config.apiSecret).update(`wed-pro-upload:${payload}`).digest("base64url");
  return { cloudName: config.cloudName, apiKey: config.apiKey, resourceType, params, signature, ticket: `${payload}.${mac}` };
}
export function readUploadTicket(token: unknown, secret: string): UploadTicket | null {
  if (typeof token !== "string" || token.length > 4096) return null;
  try {
    const [payload, provided, extra] = token.split(".");
    if (!payload || !provided || extra) return null;
    const expected = createHmac("sha256", secret).update(`wed-pro-upload:${payload}`).digest();
    const actual = Buffer.from(provided, "base64url");
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    const ticket = JSON.parse(Buffer.from(payload, "base64url").toString()) as UploadTicket;
    if (!ticket.ownerId || !ticket.invitationId || !ticket.publicId || !isUploadResourceType(ticket.resourceType) || !Number.isFinite(ticket.expiresAt) || ticket.expiresAt < Date.now()) return null;
    return ticket;
  } catch { return null; }
}
export { readUploadRequest } from "./upload-request";
