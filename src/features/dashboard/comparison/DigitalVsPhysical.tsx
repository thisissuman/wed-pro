"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Truck, Sparkles, ArrowRight } from "lucide-react";
import { SavingsCalculatorSheet } from "./SavingsCalculatorSheet";

export function DigitalVsPhysical() {
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  return (
    <section className="relative z-10 flex flex-col items-center justify-center">
      {/* Section Header */}
      <div className="max-w-[800px] w-full text-center mb-16 space-y-4">
        <p className="font-label-sm text-[12px] font-semibold text-champagne-gold uppercase tracking-widest">
          Why Go Digital?
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-headline-lg md:text-[48px] md:leading-[56px] text-on-surface font-semibold">
          Paper <span className="text-on-surface-variant italic font-light">vs</span>{" "}
          Digital Invitations
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-champagne-gold/50 to-transparent mx-auto mt-6 rounded-full"></div>
        <p className="font-[family-name:var(--font-body)] text-body-lg text-on-surface-variant/80 mt-6 max-w-2xl mx-auto">
          Discover the elegance of modern sharing. While paper holds tradition,
          digital brings your celebration to life with dynamic interaction.
        </p>
      </div>

      {/* Interactive Comparison Stack */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-[900px] w-full relative z-10"
      >
        <div className="overflow-hidden rounded-2xl border border-champagne-gold/20 bg-[#1A1A1A] shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] border-b border-champagne-gold/10">
            <div className="hidden md:flex p-6 items-center bg-surface-container-low font-[family-name:var(--font-body)] text-[12px] font-semibold text-on-surface-variant/50 uppercase tracking-[0.2em]">
              Feature
            </div>
            <div className="p-6 text-center bg-surface-container-lowest/30 border-l border-champagne-gold/5 font-[family-name:var(--font-heading)] text-xl text-on-surface-variant/80 uppercase tracking-widest font-semibold">
              Paper
            </div>
            <div className="p-6 text-center bg-champagne-gold/5 border-l border-champagne-gold/10 font-[family-name:var(--font-heading)] text-xl text-champagne-gold uppercase tracking-widest relative font-semibold">
              Digital
              <div className="absolute top-0 right-0 p-1 bg-champagne-gold/20 font-[family-name:var(--font-body)] text-[10px] text-champagne-gold px-2 font-bold uppercase tracking-wider">
                Best Value
              </div>
            </div>
          </div>

          {/* Row 1: Investment */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] border-b border-champagne-gold/5 group">
            <div className="p-6 md:p-8 flex items-center gap-3 bg-surface-container-low">
              <CreditCard className="text-champagne-gold" size={24} strokeWidth={1.5} />
              <span className="font-[family-name:var(--font-heading)] text-lg text-ivory font-medium">
                Investment
              </span>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center items-center border-l border-champagne-gold/5">
              <span className="font-[family-name:var(--font-body)] text-on-surface-variant/80">
                ₹5,000–₹50,000+
              </span>
              <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold text-on-surface-variant/40 mt-1 uppercase tracking-wider">
                + Shipping
              </span>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center items-center bg-champagne-gold/5 border-l border-champagne-gold/10">
              <span className="font-[family-name:var(--font-heading)] text-xl text-champagne-gold font-semibold">
                ₹1,499
              </span>
              <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold text-on-surface-variant/60 mt-1 uppercase tracking-wider">
                One-time Payment
              </span>
            </div>
          </div>

          {/* Row 2: Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] border-b border-champagne-gold/5 group">
            <div className="p-6 md:p-8 flex items-center gap-3 bg-surface-container-low">
              <Truck className="text-champagne-gold" size={24} strokeWidth={1.5} />
              <span className="font-[family-name:var(--font-heading)] text-lg text-ivory font-medium">
                Delivery
              </span>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center items-center border-l border-champagne-gold/5">
              <span className="font-[family-name:var(--font-body)] text-on-surface-variant/80">
                2–4 Weeks
              </span>
              <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold text-on-surface-variant/40 mt-1 uppercase tracking-wider">
                Subject to delays
              </span>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center items-center bg-champagne-gold/5 border-l border-champagne-gold/10">
              <span className="font-[family-name:var(--font-heading)] text-xl text-champagne-gold font-semibold">
                Instant
              </span>
              <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold text-on-surface-variant/60 mt-1 uppercase tracking-wider">
                WhatsApp / Link
              </span>
            </div>
          </div>

          {/* Row 3: Experience */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] group">
            <div className="p-6 md:p-8 flex items-center gap-3 bg-surface-container-low">
              <Sparkles className="text-champagne-gold" size={24} strokeWidth={1.5} />
              <span className="font-[family-name:var(--font-heading)] text-lg text-ivory font-medium">
                Experience
              </span>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center items-center border-l border-champagne-gold/5">
              <span className="font-[family-name:var(--font-body)] text-on-surface-variant/80">
                Static & Final
              </span>
              <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold text-on-surface-variant/40 mt-1 uppercase tracking-wider">
                Errors mean reprints
              </span>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center items-center bg-champagne-gold/5 border-l border-champagne-gold/10">
              <span className="font-[family-name:var(--font-heading)] text-xl text-champagne-gold font-semibold">
                Interactive
              </span>
              <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold text-on-surface-variant/60 mt-1 uppercase tracking-wider">
                Editable & Live
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="mt-20 text-center space-y-8 max-w-lg"
      >
        <h2 className="font-[family-name:var(--font-heading)] text-headline-lg-mobile md:text-headline-lg text-ivory font-semibold">
          Ready to create magic?
        </h2>
        <button
          type="button"
          onClick={() => setCalculatorOpen(true)}
          className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-champagne-gold to-rose-gold text-charcoal-black font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="relative z-10">Start Designing Now</span>
          <ArrowRight
            size={18}
            strokeWidth={2.5}
            className="ml-2 relative z-10 transition-transform group-hover:translate-x-1"
          />
          <div className="absolute inset-0 rounded-full border-2 border-white/20 mix-blend-overlay pointer-events-none" />
        </button>
      </motion.div>

      <SavingsCalculatorSheet
        open={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />
    </section>
  );
}
