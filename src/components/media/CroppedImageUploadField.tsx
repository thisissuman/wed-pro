"use client";

import { ImageIcon, Loader2, Upload } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Dialog } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { uploadToCloudinary } from "@/lib/cloudinary-upload-client";
import { getCroppedImageBlob, maxLongEdgeForAspect } from "@/lib/crop-image";
import { isCloudinaryConfigured } from "@/lib/media-url";
import { usePublishFieldError } from "@/features/invitations/PublishValidationContext";
import { cn } from "@/lib/utils";

interface CroppedImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  helperText?: string;
  validationPath?: string;
  aspect?: number;
}

export function CroppedImageUploadField({
  label,
  value,
  onChange,
  folder,
  helperText,
  validationPath,
  aspect = 1,
}: CroppedImageUploadFieldProps) {
  const fieldId = useId();
  const uploadController = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; uploadController.current?.abort(); }; }, []);
  const validationError = usePublishFieldError(validationPath);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const configured = isCloudinaryConfigured();

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleFilePick = (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be under 8 MB.");
      return;
    }
    if (uploadController.current) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(file.type)) { setError("Use JPG, PNG, WebP, or a browser-decodable HEIC photo."); return; }
    setError(null);
    const reader = new FileReader();
    reader.onerror = () => { if (mounted.current) setError("Could not read this photo. Try JPG or WebP."); };
    reader.onload = () => {
      if (!mounted.current) return;
      setCroppedAreaPixels(null);
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels || uploadController.current) return;
    const controller = new AbortController();
    uploadController.current = controller;
    setError(null);

    setIsUploading(true);
    setUploadProgress(15);

    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels, {
        maxLongEdge: maxLongEdgeForAspect(aspect),
        signal: controller.signal,
      });
      if (!mounted.current || controller.signal.aborted) return;
      setUploadProgress(45);

      const secureUrl = await uploadToCloudinary(blob, {
        folder,
        signal: controller.signal,
        fileName: "photo.jpg",
        onProgress: percent => { if (mounted.current && !controller.signal.aborted) setUploadProgress(45 + Math.round(percent * 0.55)); },
      });
      if (!mounted.current || controller.signal.aborted) return;
      setUploadProgress(100);
      onChange(secureUrl);
      setDialogOpen(false);
      setImageSrc(null);
    } catch (uploadError) {
      if (mounted.current) setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      uploadController.current = null;
      if (mounted.current) { setIsUploading(false); setUploadProgress(0); }
    }
  };

  if (!configured) {
    return (
      <p className="text-[11px] text-on-surface-variant/60">
        Cloudinary not configured. Add credentials to enable photo upload.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <span id={fieldId} className="block text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
        {label}
      </span>

      <div className="flex items-start gap-3">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-champagne-gold/15 bg-[var(--editor-field-bg)]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-champagne-gold/30">
              <ImageIcon size={24} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            aria-labelledby={fieldId}
            aria-describedby={error || validationError || helperText ? fieldId + "-help" : undefined}
            tabIndex={-1}
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFilePick(file);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            ref={uploadButtonRef}
            aria-label={(value ? "Replace photo: " : "Upload photo: ") + label}
            aria-describedby={error || validationError || helperText ? fieldId + "-help" : undefined}
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-champagne-gold/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10 disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {value ? "Replace photo" : "Upload photo"}
          </button>
          {value && (
            <button
              type="button"
              disabled={isUploading}
              onClick={() => {
                setError(null);
                onChange("");
              }}
              className="min-h-11 min-w-11 w-fit text-[11px] font-semibold uppercase tracking-wider text-[#ffb4a8]"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {(error || validationError || helperText) && (
        <p id={fieldId + "-help"} role={error || validationError ? "alert" : undefined} className={cn("text-[11px] leading-relaxed", (error || validationError) ? "text-[#ffb4a8]" : "text-on-surface-variant/50")}>
          {error ?? validationError ?? helperText}
        </p>
      )}

      <Dialog returnFocusRef={uploadButtonRef} open={dialogOpen} onOpenChange={(open) => { if (!open) { uploadController.current?.abort(); setImageSrc(null); } setDialogOpen(open); }} title="Crop photo">
        <div className="flex flex-col gap-4 p-4">
          <div className="relative h-[min(50vh,320px)] w-full overflow-hidden rounded-xl bg-charcoal-black">
            {imageSrc && (
              <Cropper
                cropperProps={{ "aria-label": "Photo crop area. Use arrow keys to move the image." }}
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
              Zoom
            </span>
            <input
              data-dialog-initial-focus
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full accent-champagne-gold"
            />
          </label>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-center text-[11px] text-on-surface-variant/60">Uploading…</p>
            </div>
          )}

          {error && <p role="alert" className="text-sm text-error">{error}</p>}
          {isUploading && <button type="button" onClick={() => uploadController.current?.abort()} className="min-h-11 text-sm text-error">Cancel upload</button>}
          <button
            type="button"
            disabled={isUploading || !croppedAreaPixels}
            onClick={() => void handleUpload()}
            className="inline-flex min-h-11 items-center justify-center rounded-full gold-gradient px-6 text-sm font-semibold text-charcoal-black disabled:opacity-50"
          >
            {isUploading ? "Uploading…" : "Save crop"}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
