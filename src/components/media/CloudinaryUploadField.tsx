"use client";

import { ImageIcon, Loader2, Music, Upload, X } from "lucide-react";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import {
  getCloudName,
  getUploadPreset,
  isCloudinaryConfigured,
  validateMediaUrl,
} from "@/lib/media-url";

interface CloudinaryUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  helperText?: string;
  compact?: boolean;
  cropping?: boolean;
  croppingAspectRatio?: number;
  resourceType?: "image" | "video" | "raw";
  uploadLabel?: string;
  clientAllowedFormats?: string[];
}

export function CloudinaryUploadField({
  label,
  value,
  onChange,
  folder,
  helperText,
  compact = false,
  cropping = false,
  croppingAspectRatio = 1,
  resourceType = "image",
  uploadLabel,
  clientAllowedFormats,
}: CloudinaryUploadFieldProps) {
  const [error, setError] = useState<string | null>(null);
  const configured = isCloudinaryConfigured();
  const cloudName = getCloudName();
  const uploadPreset = getUploadPreset();

  const isAudio = resourceType === "video" || resourceType === "raw";
  const defaultFormats =
    clientAllowedFormats ??
    (isAudio
      ? ["mp3", "m4a", "wav", "aac", "ogg"]
      : ["jpg", "jpeg", "png", "webp", "heic"]);

  const buttonLabel =
    uploadLabel ??
    (isAudio
      ? value
        ? "Replace music"
        : "Upload music"
      : value
        ? "Replace photo"
        : "Upload photo");

  const handleManualUrl = (raw: string) => {
    const result = validateMediaUrl(raw);
    if (!result.ok) {
      setError(result.error ?? "Invalid URL.");
      onChange(raw);
      return;
    }
    setError(null);
    onChange(result.cleaned ?? "");
  };

  const previewSize = compact ? "h-16 w-16" : "h-28 w-28";

  return (
    <div className="space-y-2">
      <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
        {label}
      </span>

      <div className="flex items-start gap-3">
        {!isAudio && (
          <div
            className={`${previewSize} shrink-0 overflow-hidden rounded-xl border border-champagne-gold/15 bg-charcoal-black/40`}
          >
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt={label}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-champagne-gold/30">
                <ImageIcon size={compact ? 18 : 24} />
              </div>
            )}
          </div>
        )}

        {isAudio && value && (
          <div className="flex h-12 shrink-0 items-center gap-2 rounded-xl border border-champagne-gold/15 bg-charcoal-black/40 px-3">
            <Music size={18} className="text-champagne-gold" />
            <span className="max-w-[120px] truncate text-[10px] text-on-surface-variant">
              Track added
            </span>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-2">
          {configured && cloudName && uploadPreset ? (
            <CldUploadWidget
              uploadPreset={uploadPreset}
              options={{
                cloudName,
                folder,
                resourceType,
                sources: isAudio ? ["local", "url"] : ["local", "camera", "url"],
                multiple: false,
                maxFileSize: isAudio ? 12_000_000 : 8_000_000,
                clientAllowedFormats: defaultFormats,
                ...(cropping && resourceType === "image"
                  ? {
                      cropping: true,
                      croppingAspectRatio,
                      croppingDefaultSelectionRatio: 1,
                    }
                  : {}),
              }}
              onSuccess={(result) => {
                const info = result.info;
                if (info && typeof info === "object" && "secure_url" in info) {
                  const secureUrl = (info as { secure_url: string }).secure_url;
                  setError(null);
                  onChange(secureUrl);
                }
              }}
              onError={() =>
                setError(isAudio ? "Upload failed. Please try again." : "Upload failed. Please try again.")
              }
            >
              {({ open, isLoading }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  disabled={isLoading}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-champagne-gold/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  {buttonLabel}
                </button>
              )}
            </CldUploadWidget>
          ) : (
            <p className="text-[11px] leading-relaxed text-on-surface-variant/50">
              Cloudinary not configured. Paste a URL below for now.
            </p>
          )}

          {!configured && (
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={value}
                onChange={(event) => handleManualUrl(event.target.value)}
                placeholder="https://res.cloudinary.com/..."
                className="min-h-[44px] flex-1 rounded-xl border border-champagne-gold/15 bg-charcoal-black/50 px-3 py-2 text-xs text-ivory outline-none transition focus:border-champagne-gold/60"
              />
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    onChange("");
                  }}
                  aria-label={`Remove ${label}`}
                  className="min-h-[44px] min-w-[44px] rounded-full border border-[#ffb4a8]/20 p-2 text-[#ffb4a8] transition hover:bg-[#ffb4a8]/10"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {configured && value && (
            <button
              type="button"
              onClick={() => {
                setError(null);
                onChange("");
              }}
              className="w-fit text-[11px] font-semibold uppercase tracking-wider text-[#ffb4a8] transition hover:text-[#ffb4a8]/80"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {(error || helperText) && (
        <p
          className={`text-[11px] leading-relaxed ${
            error ? "text-[#ffb4a8]" : "text-on-surface-variant/50"
          }`}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
