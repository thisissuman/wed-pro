"use client";

import { Check, ChevronDown } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((option) => option.value === value);
  const labelId = useId();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="flex flex-col gap-2">
      <span id={labelId} className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
        {label}
      </span>
      <button
        type="button"
        aria-labelledby={labelId}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-champagne-gold/15 bg-charcoal-black/50 px-4 py-3 text-left text-sm text-ivory outline-none transition focus:border-champagne-gold/60"
      >
        <span>{selected?.label ?? "Select"}</span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-champagne-gold/70 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div
          role="listbox"
          aria-labelledby={labelId}
          className="overflow-hidden rounded-xl border border-champagne-gold/15 bg-surface-container shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition",
                  isSelected
                    ? "bg-champagne-gold/15 text-champagne-gold"
                    : "text-on-surface-variant hover:bg-champagne-gold/10 hover:text-ivory"
                )}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={14} className="text-champagne-gold" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
