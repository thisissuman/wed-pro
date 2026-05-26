"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

interface ReorderControlsProps {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  className?: string;
}

export function ReorderControls({
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  className,
}: ReorderControlsProps) {
  return (
    <div className={className ?? "flex items-center gap-1"}>
      <button
        type="button"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        aria-label="Move up"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-champagne-gold/15 text-champagne-gold transition hover:bg-champagne-gold/10 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
      >
        <ArrowUp size={16} />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        aria-label="Move down"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-champagne-gold/15 text-champagne-gold transition hover:bg-champagne-gold/10 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
      >
        <ArrowDown size={16} />
      </button>
    </div>
  );
}
