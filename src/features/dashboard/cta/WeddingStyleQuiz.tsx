"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";

type QuizStep = 0 | 1 | 2;

const COLOR_OPTIONS = [
  { id: "gold", label: "Champagne Gold & Maroon" },
  { id: "ivory", label: "Ivory & Rose" },
  { id: "emerald", label: "Emerald & Gold" },
];

const VIBE_OPTIONS = [
  { id: "royal", label: "Royal & Grand" },
  { id: "minimal", label: "Modern Minimal" },
  { id: "floral", label: "Romantic Floral" },
];

const SCALE_OPTIONS = [
  { id: "intimate", label: "Intimate (under 100 guests)" },
  { id: "classic", label: "Classic (100–300 guests)" },
  { id: "grand", label: "Grand celebration (300+)" },
];

function resolveTemplateId(): string {
  return "royal";
}

interface WeddingStyleQuizProps {
  open: boolean;
  onClose: () => void;
}

export function WeddingStyleQuiz({ open, onClose }: WeddingStyleQuizProps) {
  const router = useRouter();
  const [step, setStep] = useState<QuizStep>(0);
  const [color, setColor] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [scale, setScale] = useState<string | null>(null);

  const reset = () => {
    setStep(0);
    setColor(null);
    setVibe(null);
    setScale(null);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const finish = () => {
    const templateId = resolveTemplateId();
    sessionStorage.setItem("recommendedTemplate", templateId);
    handleClose();
    router.push(`/template?recommended=${templateId}`);
  };

  const canNext =
    (step === 0 && color) || (step === 1 && vibe) || (step === 2 && scale);

  const handleNext = () => {
    if (step < 2) {
      setStep((s) => (s + 1) as QuizStep);
      return;
    }
    finish();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-black/75 px-4 py-6 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-lg rounded-2xl border border-champagne-gold/20 bg-surface-container p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close quiz"
          className="absolute right-4 top-4 rounded-full border border-champagne-gold/20 p-2 text-on-surface-variant hover:bg-champagne-gold/10"
        >
          <X size={16} />
        </button>

        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-champagne-gold/70">
          Step {step + 1} of 3
        </p>
        <h2 className="mt-2 font-heading text-2xl text-ivory">
          Find Your Wedding Aesthetic
        </h2>

        <div className="mt-6 min-h-[200px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="color"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-2"
              >
                <p className="mb-3 text-sm text-on-surface-variant">
                  Which palette speaks to your celebration?
                </p>
                {COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setColor(opt.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      color === opt.id
                        ? "border-champagne-gold bg-champagne-gold/15 text-ivory"
                        : "border-champagne-gold/15 text-on-surface-variant hover:border-champagne-gold/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="vibe"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-2"
              >
                <p className="mb-3 text-sm text-on-surface-variant">
                  What feeling should guests experience?
                </p>
                {VIBE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setVibe(opt.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      vibe === opt.id
                        ? "border-champagne-gold bg-champagne-gold/15 text-ivory"
                        : "border-champagne-gold/15 text-on-surface-variant hover:border-champagne-gold/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="scale"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-2"
              >
                <p className="mb-3 text-sm text-on-surface-variant">
                  How grand is your celebration?
                </p>
                {SCALE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setScale(opt.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      scale === opt.id
                        ? "border-champagne-gold bg-champagne-gold/15 text-ivory"
                        : "border-champagne-gold/15 text-on-surface-variant hover:border-champagne-gold/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          disabled={!canNext}
          onClick={handleNext}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full gold-gradient px-6 py-4 text-sm font-semibold text-charcoal-black transition disabled:opacity-50"
        >
          {step < 2 ? "Continue" : "See My Template"}
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
