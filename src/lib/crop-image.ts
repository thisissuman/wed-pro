export interface CropAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("Failed to load image")));
    image.crossOrigin = "anonymous";
    image.src = src;
  });
}

interface CropOutputOptions {
  /** Longest edge of the output image in pixels (preserves crop aspect ratio). */
  maxLongEdge?: number;
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

  const image = await loadImage(imageSrc);
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
    canvas.toBlob(
      (blob) => {
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
