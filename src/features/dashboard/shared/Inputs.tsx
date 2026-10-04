"use client";

import { ChevronDown } from "lucide-react";
import type { ChangeEvent } from "react";
import { useId } from "react";
import { usePublishFieldError } from "@/features/invitations/PublishValidationContext";
import { cn } from "@/lib/utils";
import { sanitizePlainText, trimPlainTextField } from "@/lib/sanitize-text";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  inputMode?: "text" | "tel" | "email" | "url" | "numeric" | "decimal";
  helperText?: string;
  error?: string;
  validationPath?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  inputMode,
  helperText,
  error: explicitError,
  validationPath,
}: TextInputProps) {
  const fieldError = usePublishFieldError(validationPath);
  const error = fieldError || explicitError;
  const errorId = useId();
  return (
    <label className="block space-y-2">
      <span id={errorId + "-label"} className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
        {label}
      </span>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(sanitizePlainText(event.target.value))
        }
        onBlur={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(trimPlainTextField(event.target.value))
        }
        aria-labelledby={errorId + "-label"}
        aria-invalid={Boolean(error)}
        aria-describedby={error || helperText ? errorId : undefined}
        className={cn(
          "w-full rounded-xl border bg-[var(--editor-field-bg)] px-4 py-3 text-base sm:text-sm text-[var(--editor-field-text)] outline-none transition placeholder:text-[var(--editor-field-placeholder)] focus:border-champagne-gold/60",
          error ? "border-error/50" : "border-[var(--editor-field-border)]"
        )}
      />
      {error && (
        <span id={errorId} className="block break-words text-[11px] leading-relaxed text-error" role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={errorId} className="block break-words text-[11px] leading-relaxed text-on-surface-variant/50">
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
  error?: string;
  validationPath?: string;
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  helperText,
  error: explicitError,
  validationPath,
}: TextAreaProps) {
  const fieldError = usePublishFieldError(validationPath);
  const error = fieldError || explicitError;
  const errorId = useId();
  return (
    <label className="block space-y-2">
      <span id={errorId + "-label"} className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(sanitizePlainText(event.target.value))
        }
        onBlur={(event: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(trimPlainTextField(event.target.value))
        }
        aria-labelledby={errorId + "-label"}
        aria-invalid={Boolean(error)}
        aria-describedby={error || helperText ? errorId : undefined}
        className={cn(
          "w-full resize-none rounded-xl border bg-[var(--editor-field-bg)] px-4 py-3 text-base sm:text-sm leading-relaxed text-[var(--editor-field-text)] outline-none transition placeholder:text-[var(--editor-field-placeholder)] focus:border-champagne-gold/60",
          error ? "border-error/50" : "border-[var(--editor-field-border)]"
        )}
      />
      {error && (
        <span id={errorId} className="block break-words text-[11px] leading-relaxed text-error" role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={errorId} className="block break-words text-[11px] leading-relaxed text-on-surface-variant/50">
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
  const inputId = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60">{label}</label>
      <div className="relative">
        <select id={inputId} value={value} onChange={(event) => onChange(event.target.value as T)}
          className="min-h-11 w-full appearance-none rounded-xl border border-[var(--editor-field-border)] bg-[var(--editor-field-bg)] px-4 py-3 pr-10 text-base sm:text-sm text-[var(--editor-field-text)] outline-none focus:border-champagne-gold/60">
          {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <ChevronDown aria-hidden size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-champagne-gold/70" />
      </div>
    </div>
  );
}
