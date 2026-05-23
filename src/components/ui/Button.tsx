import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "gold-gradient text-deep-maroon font-semibold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]",
  ghost:
    "border border-champagne-gold/30 text-champagne-gold hover:bg-champagne-gold/5",
};

export function Button({
  variant = "primary",
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "px-6 py-3 rounded-full",
        "font-[family-name:var(--font-body)] text-sm font-medium tracking-wide",
        "transition-all duration-200 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-champagne-gold/50",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
