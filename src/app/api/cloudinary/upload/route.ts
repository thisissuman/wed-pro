import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAllowedUploadFile, isUploadResourceType } from "@/lib/cloudinary-upload-policy";
import { getUploadConfig, issueUpload, readUploadRequest } from "@/lib/cloudinary-upload-server";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await readUploadRequest(request);
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Sign in to upload media." }, { status: 401 });
    const match = typeof body.folder === "string" ? /^wed-pro\/([0-9a-f-]{36})\/(hero|music|gallery|couple\/bride|couple\/groom)$/.exec(body.folder) : null;
    if (!match || !isUploadResourceType(body.resourceType) || typeof body.size !== "number" || typeof body.mimeType !== "string" || typeof body.fileName !== "string" ||
        !isAllowedUploadFile(body.size, body.mimeType, body.fileName, body.resourceType) ||
        ((match[2] === "music") !== (body.resourceType === "video"))) {
      return NextResponse.json({ error: "Use a supported image up to 8 MB or audio file up to 12 MB in its matching editor field." }, { status: 400 });
    }
    const { data: invitation, error } = await supabase.from("invitations").select("id").eq("id", match[1]).eq("user_id", user.id).single();
    if (error || !invitation) return NextResponse.json({ error: "This invitation is not available for uploads." }, { status: 403 });
    const config = getUploadConfig();
    if (!config) return NextResponse.json({ error: "Signed Cloudinary uploads need server credentials, signed image/audio presets, and folder-mode configuration. See docs/cloudinary-uploads.md." }, { status: 503 });
    return NextResponse.json(issueUpload(config, user.id, invitation.id, match[2], body.resourceType), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not authorize this upload. Use the editor and try again." }, { status: 400 });
  }
}
