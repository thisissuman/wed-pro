export interface CropAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string, signal?: AbortSignal): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const cleanup = () => { clearTimeout(timer); signal?.removeEventListener("abort", abort); image.onload = null; image.onerror = null; };
    const abort = () => { cleanup(); image.src = ""; reject(new Error("Photo processing cancelled.")); };
    const timer = setTimeout(() => { cleanup(); reject(new Error("Photo processing timed out. Try JPG or WebP.")); }, 30_000);
    image.onload = () => { cleanup(); resolve(image); };
    image.onerror = () => { cleanup(); reject(new Error("Could not decode this photo. Try JPG or WebP.")); };
    signal?.addEventListener("abort", abort, { once: true });
    if (signal?.aborted) { abort(); return; }
    image.crossOrigin = "anonymous";
    image.src = src;
  });
}

interface CropOutputOptions {
  /** Longest edge of the output image in pixels (preserves crop aspect ratio). */
  maxLongEdge?: number;
  signal?: AbortSignal;
}

/** Returns a JPEG blob of the cropped region, preserving the crop aspect ratio. */
export async function getCroppedImageBlob(
  imageSrc: string,
  pixelCrop: CropAreaPixels,
  options: CropOutputOptions = {}
): Promise<Blob> {
  const maxLongEdge = options.maxLongEdge ?? 1600;
  const cropAspect = pixelCrop.width / pixelCrop.height;

  let outWidth: number;
  let outHeight: number;

  if (cropAspect >= 1) {
    outWidth = Math.min(maxLongEdge, pixelCrop.width);
    outHeight = Math.round(outWidth / cropAspect);
  } else {
    outHeight = Math.min(maxLongEdge, pixelCrop.height);
    outWidth = Math.round(outHeight * cropAspect);
  }

  outWidth = Math.max(1, outWidth);
  outHeight = Math.max(1, outHeight);

  const image = await loadImage(imageSrc, options.signal);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  canvas.width = outWidth;
  canvas.height = outHeight;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outWidth,
    outHeight
  );

  return new Promise((resolve, reject) => {
    const cleanup = () => { clearTimeout(timer); options.signal?.removeEventListener("abort", abort); };
    const abort = () => { cleanup(); reject(new Error("Photo processing cancelled.")); };
    const timer = setTimeout(() => { cleanup(); reject(new Error("Photo export timed out. Try a smaller image.")); }, 30_000);
    options.signal?.addEventListener("abort", abort, { once: true });
    if (options.signal?.aborted) { abort(); return; }
    canvas.toBlob(
      (blob) => {
        cleanup();
        if (options.signal?.aborted) return;
        if (!blob) {
          reject(new Error("Failed to create image"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.92
    );
  });
}

/** Max long edge for canvas export based on intended crop aspect. */
export function maxLongEdgeForAspect(aspect: number): number {
  if (aspect < 0.7) return 1920;
  if (aspect > 0.95 && aspect < 1.05) return 800;
  return 1200;
}
