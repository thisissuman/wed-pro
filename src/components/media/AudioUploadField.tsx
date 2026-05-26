"use client";

import { Loader2, Music, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { uploadToCloudinary } from "@/lib/cloudinary-upload-client";
import { isCloudinaryConfigured } from "@/lib/media-url";
import { cn } from "@/lib/utils";

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/m4a",
  "audio/wav",
  "audio/aac",
  "audio/ogg",
];

interface AudioUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  helperText?: string;
}

export function AudioUploadField({
  label,
  value,
  onChange,
  folder,
  helperText,
}: AudioUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const configured = isCloudinaryConfigured();

  const handleFile = async (file: File) => {
    if (file.size > MAX_BYTES) {
      setError("Audio must be under 12 MB.");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(mp3|m4a|wav|aac|ogg)$/i)) {
      setError("Use MP3, M4A, WAV, AAC, or OGG.");
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const secureUrl = await uploadToCloudinary(file, {
        folder,
        resourceType: "video",
        fileName: file.name,
        onProgress: setUploadProgress,
      });
      setUploadProgress(100);
      onChange(secureUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!configured) {
    return (
      <p className="text-[11px] text-on-surface-variant/60">
        Cloudinary not configured. Add credentials to enable music upload.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
        {label}
      </span>

      <div className="flex items-start gap-3">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border border-champagne-gold/15 bg-[var(--editor-field-bg)] text-champagne-gold/40">
          <Music size={28} />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="audio/mpeg,audio/mp4,audio/wav,audio/aac,audio/ogg,.mp3,.m4a,.wav,.aac,.ogg"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-champagne-gold/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10 disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {value ? "Replace music" : "Upload music"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => {
                setError(null);
                onChange("");
              }}
              className="w-fit text-[11px] font-semibold uppercase tracking-wider text-[#ffb4a8]"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-center text-[11px] text-on-surface-variant/60">Uploading…</p>
        </div>
      )}

      {(error || helperText) && (
        <p className={cn("text-[11px] leading-relaxed", error ? "text-[#ffb4a8]" : "text-on-surface-variant/50")}>
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
