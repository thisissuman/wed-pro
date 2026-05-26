"use client";

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-champagne-gold/10 bg-[var(--editor-toggle-bg)] px-4 py-3 transition hover:border-champagne-gold/20">
      <span className="flex-1 space-y-1">
        <span className="block text-sm font-medium text-on-surface">{label}</span>
        {description && (
          <span className="block text-[11px] leading-relaxed text-on-surface-variant/60">
            {description}
          </span>
        )}
      </span>
      <span className="relative mt-0.5 inline-flex h-7 w-12 shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          className="block h-6 w-11 rounded-full bg-[var(--editor-toggle-track)] ring-1 ring-inset ring-champagne-gold/20 transition-colors peer-checked:bg-champagne-gold/70 peer-checked:ring-champagne-gold/60"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute left-0.5 inline-block h-5 w-5 translate-x-0 rounded-full bg-[var(--editor-knob)] shadow-md transition-transform duration-200 ease-out peer-checked:translate-x-5"
          aria-hidden="true"
        />
      </span>
    </label>
  );
}
