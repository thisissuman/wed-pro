"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Leaf, X } from "lucide-react";
import { useRouter } from "next/navigation";

const DIGITAL_PRICE = 0;

interface SavingsCalculatorSheetProps {
  open: boolean;
  onClose: () => void;
}

export function SavingsCalculatorSheet({ open, onClose }: SavingsCalculatorSheetProps) {
  const router = useRouter();
  const [guests, setGuests] = useState(150);
  const [cardCost, setCardCost] = useState(35);
  const [postage, setPostage] = useState(12);

  const { physicalTotal, savings, co2Kg } = useMemo(() => {
    const physical = guests * (cardCost + postage);
    const saved = Math.max(0, physical - DIGITAL_PRICE);
    const co2 = guests * 0.02;
    return { physicalTotal: physical, savings: saved, co2Kg: co2 };
  }, [guests, cardCost, postage]);

  const handleStart = () => {
    onClose();
    router.push("/template");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close calculator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-charcoal-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="savings-calculator-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col border-l border-champagne-gold/20 bg-surface-container shadow-[0_0_80px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-champagne-gold/10 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold/70">
                  Value Preview
                </p>
                <h2
                  id="savings-calculator-title"
                  className="font-heading text-xl text-ivory"
                >
                  Cost & Carbon Savings
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full border border-champagne-gold/20 p-2 text-on-surface-variant transition hover:bg-champagne-gold/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Guest count ({guests})
                </span>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full accent-champagne-gold"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Avg. printed card (₹)
                </span>
                <input
                  type="number"
                  min={10}
                  max={200}
                  value={cardCost}
                  onChange={(e) => setCardCost(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-champagne-gold/15 bg-charcoal-black/40 px-4 py-3 text-sm text-ivory outline-none focus:border-champagne-gold/50"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Postage per card (₹)
                </span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={postage}
                  onChange={(e) => setPostage(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-champagne-gold/15 bg-charcoal-black/40 px-4 py-3 text-sm text-ivory outline-none focus:border-champagne-gold/50"
                />
              </label>

              <div className="space-y-3 rounded-2xl border border-champagne-gold/15 bg-champagne-gold/5 p-5">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Traditional (cards + postage)</span>
                  <span className="font-semibold text-ivory">
                    ₹{physicalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Vivaha digital invite (beta)</span>
                  <span className="font-semibold text-champagne-gold">
                    Free
                  </span>
                </div>
                <div className="border-t border-champagne-gold/15 pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-ivory">You save</span>
                  <span className="text-lg font-bold text-champagne-gold">
                    ₹{savings.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="flex items-center gap-2 text-[11px] text-on-surface-variant/70">
                  <Leaf size={14} className="text-champagne-gold shrink-0" />
                  Approx. {co2Kg.toFixed(1)} kg less paper waste (illustrative estimate).
                </p>
              </div>
            </div>

            <div className="border-t border-champagne-gold/10 p-6">
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full gold-gradient px-6 py-4 text-sm font-semibold uppercase tracking-wider text-charcoal-black transition hover:scale-[1.01] active:scale-[0.98]"
              >
                Start Designing
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
