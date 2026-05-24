"use client";

import type { ChangeEvent } from "react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  inputMode?: "text" | "tel" | "email" | "url" | "numeric" | "decimal";
  helperText?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  inputMode,
  helperText,
}: TextInputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
        {label}
      </span>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        className="w-full rounded-xl border border-champagne-gold/15 bg-charcoal-black/50 px-4 py-3 text-sm text-ivory outline-none transition focus:border-champagne-gold/60"
      />
      {helperText && (
        <span className="block text-[11px] leading-relaxed text-on-surface-variant/50">
          {helperText}
        </span>
      )}
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  helperText?: string;
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  helperText,
}: TextAreaProps) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        className="w-full resize-none rounded-xl border border-champagne-gold/15 bg-charcoal-black/50 px-4 py-3 text-sm leading-relaxed text-ivory outline-none transition focus:border-champagne-gold/60"
      />
      {helperText && (
        <span className="block text-[11px] leading-relaxed text-on-surface-variant/50">
          {helperText}
        </span>
      )}
    </label>
  );
}

interface SelectInputProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}

export function SelectInput<T extends string>({
  label,
  value,
  onChange,
  options,
}: SelectInputProps<T>) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="w-full rounded-xl border border-champagne-gold/15 bg-charcoal-black/50 px-4 py-3 text-sm text-ivory outline-none transition focus:border-champagne-gold/60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
