import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCloudName, getUploadPreset } from "@/lib/media-url";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = getCloudName();
  const uploadPreset = getUploadPreset();

  if (!cloudName || !uploadPreset) {
    return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder");
  const resourceTypeRaw = formData.get("resourceType");
  const resourceType =
    resourceTypeRaw === "video" ? "video" : "image";

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const maxBytes = resourceType === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error:
          resourceType === "video"
            ? "File too large (max 12 MB)"
            : "File too large (max 8 MB)",
      },
      { status: 400 }
    );
  }

  const uploadBody = new FormData();
  uploadBody.append("file", file);
  uploadBody.append("upload_preset", uploadPreset);
  if (typeof folder === "string" && folder.trim()) {
    uploadBody.append("folder", folder.trim());
  }

  const endpoint =
    resourceType === "video"
      ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
      : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const cloudinaryRes = await fetch(endpoint, { method: "POST", body: uploadBody });

  const payload = (await cloudinaryRes.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };

  if (!cloudinaryRes.ok || !payload.secure_url) {
    return NextResponse.json(
      { error: payload.error?.message ?? "Upload failed" },
      { status: cloudinaryRes.status || 500 }
    );
  }

  return NextResponse.json({ secure_url: payload.secure_url });
}
