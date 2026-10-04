import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUploadConfig, readUploadRequest, readUploadTicket } from "@/lib/cloudinary-upload-server";
import { UPLOAD_POLICY } from "@/lib/cloudinary-upload-policy";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await readUploadRequest(request);
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Sign in again before attaching this upload." }, { status: 401 });
    const config = getUploadConfig();
    if (!config) return NextResponse.json({ error: "Signed upload configuration is incomplete." }, { status: 503 });
    const ticket = readUploadTicket(body.ticket, config.apiSecret);
    if (!ticket || ticket.ownerId !== user.id) return NextResponse.json({ error: "Upload authorization expired or is invalid. Please upload again." }, { status: 403 });
    const { data: invitation } = await supabase.from("invitations").select("id").eq("id", ticket.invitationId).eq("user_id", user.id).single();
    if (!invitation) return NextResponse.json({ error: "This invitation is not available." }, { status: 403 });
    const metadataUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/resources/${ticket.resourceType}/upload/${encodeURIComponent(ticket.publicId)}?media_metadata=true`;
    const response = await fetch(metadataUrl, { headers: { Authorization: `Basic ${Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString("base64")}` }, cache: "no-store", signal: AbortSignal.timeout(15_000) });
    if (!response.ok) return NextResponse.json({ error: "Could not confirm the uploaded asset. Existing media is unchanged; please try again." }, { status: 502 });
    const asset = await response.json() as { public_id?: string; resource_type?: string; type?: string; format?: string; bytes?: number; secure_url?: string; video?: { codec?: string }; audio?: unknown };
    const policy = UPLOAD_POLICY[ticket.resourceType];
    if (asset.public_id !== ticket.publicId || asset.resource_type !== ticket.resourceType || asset.type !== "upload" || typeof asset.bytes !== "number" || asset.bytes <= 0 || asset.bytes > policy.maxBytes ||
        !policy.formats.some(format => format === asset.format) || (ticket.resourceType === "video" && asset.video?.codec)) {
      return NextResponse.json({ error: "The uploaded asset exceeds the size limit or is not a supported photo/audio file. Existing media is unchanged." }, { status: 400 });
    }
    const url = asset.secure_url ? new URL(asset.secure_url) : null;
    if (!url || url.protocol !== "https:" || url.hostname !== "res.cloudinary.com" || !url.pathname.startsWith(`/${config.cloudName}/${ticket.resourceType}/upload/`)) return NextResponse.json({ error: "Cloudinary returned an unexpected delivery URL." }, { status: 502 });
    return NextResponse.json({ secure_url: url.href }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not confirm the upload. Existing media is unchanged; please retry." }, { status: 502 });
  }
}
