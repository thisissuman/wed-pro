import type { WeddingData } from "@/types/wedding.types";

export type DraftUpdater = (updater: (current: WeddingData) => WeddingData) => void;

export interface PanelProps {
  draft: WeddingData;
  update: DraftUpdater;
  /** When true, render fields only (accordion supplies the chrome). */
  bare?: boolean;
}
