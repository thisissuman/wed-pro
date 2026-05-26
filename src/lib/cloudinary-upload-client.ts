/** Client-side authenticated upload to `/api/cloudinary/upload` with progress. */
export async function uploadToCloudinary(
  file: Blob,
  options: {
    folder?: string;
    resourceType?: "image" | "video";
    fileName?: string;
    onProgress?: (percent: number) => void;
  } = {}
): Promise<string> {
  const body = new FormData();
  body.append("file", file, options.fileName ?? "upload");
  if (options.folder) body.append("folder", options.folder);
  if (options.resourceType && options.resourceType !== "image") {
    body.append("resourceType", options.resourceType);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && options.onProgress) {
        options.onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });
    xhr.addEventListener("load", () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        try {
          const err = JSON.parse(xhr.responseText) as { error?: string };
          reject(new Error(err.error ?? "Upload failed"));
        } catch {
          reject(new Error("Upload failed"));
        }
        return;
      }
      const data = JSON.parse(xhr.responseText) as { secure_url: string };
      resolve(data.secure_url);
    });
    xhr.addEventListener("error", () => reject(new Error("Upload failed")));
    xhr.open("POST", "/api/cloudinary/upload");
    xhr.send(body);
  });
}
