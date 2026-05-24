"use client";

import { ImageIcon, Loader2, Upload, X } from "lucide-react";
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
  /** Compact mode renders a smaller preview suitable for list items. */
  compact?: boolean;
}

/**
 * Cloudinary-backed image field with a manual URL fallback.
 *
 * Uses an unsigned upload preset for the MVP — folder + size limits should
 * be configured on the preset in the Cloudinary dashboard.
 */
export function CloudinaryUploadField({
  label,
  value,
  onChange,
  folder,
  helperText,
  compact = false,
}: CloudinaryUploadFieldProps) {
  const [error, setError] = useState<string | null>(null);
  const configured = isCloudinaryConfigured();
  const cloudName = getCloudName();
  const uploadPreset = getUploadPreset();

  const handleManualUrl = (raw: string) => {
    const result = validateMediaUrl(raw);
    if (!result.ok) {
      setError(result.error ?? "Invalid image URL.");
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

        <div className="flex flex-1 flex-col gap-2">
          {configured && cloudName && uploadPreset ? (
            <CldUploadWidget
              uploadPreset={uploadPreset}
              options={{
                cloudName,
                folder,
                sources: ["local", "camera", "url"],
                multiple: false,
                maxFileSize: 8_000_000,
                clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "heic"],
              }}
              onSuccess={(result) => {
                const info = result.info;
                if (info && typeof info === "object" && "secure_url" in info) {
                  const secureUrl = (info as { secure_url: string }).secure_url;
                  setError(null);
                  onChange(secureUrl);
                }
              }}
              onError={() => setError("Upload failed. Please try again.")}
            >
              {({ open, isLoading }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-champagne-gold/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:bg-champagne-gold/10 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  {value ? "Replace photo" : "Upload photo"}
                </button>
              )}
            </CldUploadWidget>
          ) : (
            <p className="text-[11px] leading-relaxed text-on-surface-variant/50">
              Cloudinary not configured. Paste an image URL below for now.
            </p>
          )}

          <div className="flex items-center gap-2">
            <input
              type="url"
              value={value}
              onChange={(event) => handleManualUrl(event.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="flex-1 rounded-xl border border-champagne-gold/15 bg-charcoal-black/50 px-3 py-2 text-xs text-ivory outline-none transition focus:border-champagne-gold/60"
            />
            {value && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  onChange("");
                }}
                aria-label="Remove photo"
                className="rounded-full border border-[#ffb4a8]/20 p-2 text-[#ffb4a8] transition hover:bg-[#ffb4a8]/10"
              >
                <X size={14} />
              </button>
            )}
          </div>
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
