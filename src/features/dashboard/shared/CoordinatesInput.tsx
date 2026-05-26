"use client";

import type { Coordinates } from "@/lib/maps";

interface CoordinatesInputProps {
  value: Coordinates | undefined;
  onChange: (value: Coordinates | undefined) => void;
  helperText?: string;
}

function parseNumber(input: string): number | null {
  if (input.trim() === "") return null;
  const parsed = Number(input);
  return Number.isFinite(parsed) ? parsed : null;
}

export function CoordinatesInput({ value, onChange, helperText }: CoordinatesInputProps) {
  const lat = value?.lat ?? "";
  const lng = value?.lng ?? "";

  const update = (next: { lat?: number | null; lng?: number | null }) => {
    const nextLat = next.lat !== undefined ? next.lat : (value?.lat ?? null);
    const nextLng = next.lng !== undefined ? next.lng : (value?.lng ?? null);

    if (nextLat === null || nextLng === null) {
      onChange(undefined);
      return;
    }
    onChange({ lat: nextLat, lng: nextLng });
  };

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
        Coordinates
      </span>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-[0.14em] text-on-surface-variant/50">
            Latitude
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={lat}
            onChange={(event) => update({ lat: parseNumber(event.target.value) })}
            placeholder="26.8553"
            className="w-full rounded-xl border border-[var(--editor-field-border)] bg-[var(--editor-field-bg)] px-4 py-3 text-sm text-[var(--editor-field-text)] outline-none transition focus:border-champagne-gold/60"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-[0.14em] text-on-surface-variant/50">
            Longitude
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={lng}
            onChange={(event) => update({ lng: parseNumber(event.target.value) })}
            placeholder="75.8513"
            className="w-full rounded-xl border border-[var(--editor-field-border)] bg-[var(--editor-field-bg)] px-4 py-3 text-sm text-[var(--editor-field-text)] outline-none transition focus:border-champagne-gold/60"
          />
        </label>
      </div>
      {helperText && (
        <p className="text-[11px] leading-relaxed text-on-surface-variant/50">{helperText}</p>
      )}
    </div>
  );
}
