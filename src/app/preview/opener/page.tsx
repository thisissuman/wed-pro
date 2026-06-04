"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { InvitationOpener } from "@/components/invitation-opener";
import type { OpenerVariant } from "@/components/invitation-opener";
import { Check, RotateCcw, Sliders, Eye } from "lucide-react";

// Presets for gorgeous Indian wedding color schemes
const COLOR_PRESETS = [
  { name: "Royal Crimson & Gold", primary: "#D4AF37", secondary: "#58111A" },
  { name: "Emerald Fort & Ivory", primary: "#D4AF37", secondary: "#0B2E24" },
  { name: "Palace Navy & Rose", primary: "#F3C68F", secondary: "#0F1A30" },
  { name: "Saffron & Terracotta", primary: "#FFE088", secondary: "#91381E" },
  { name: "Luxury Charcoal & Gold", primary: "#E9C349", secondary: "#131313" },
];

const VARIANTS_LIST: { id: OpenerVariant; label: string; desc: string }[] = [
  { id: "royal-door", label: "Royal Doors", desc: "Ornate 3D double doors swinging inwards" },
  { id: "palace-gate", label: "Palace Gate", desc: "Detailed metal gates swinging with spring bounce" },
  { id: "curtain-reveal", label: "Curtain Reveal", desc: "Luxurious velvet drapery sliding open" },
  { id: "mandap-opening", label: "Mandap Opening", desc: "Hanging marigold garlands lifting upward" },
  { id: "invitation-flap", label: "Invitation Flap", desc: "Top envelope flap folding up, followed by card pull" },
  { id: "floral-reveal", label: "Floral Wreath", desc: "Concentric floral vectors scaling and fading out" },
  { id: "namaste-opening", label: "Namaste Opening", desc: "Traditional prayer hands splitting horizontally" },
  { id: "luxury-minimal", label: "Luxury Minimal", desc: "Vertically parting sleek gold-bordered panels" },
];

export default function OpenerPreviewPage() {
  const [variant, setVariant] = useState<OpenerVariant>("royal-door");
  const [primaryColor, setPrimaryColor] = useState("#D4AF37");
  const [secondaryColor, setSecondaryColor] = useState("#58111A");
  const [sealType, setSealType] = useState<"wax-seal" | "gold-coin" | "none">("wax-seal");
  const [monogram, setMonogram] = useState("W");
  
  // Reset token to remount the opener component and trigger animation again
  const [resetKey, setResetKey] = useState(0);
  const [isOpenRevealed, setIsOpenRevealed] = useState(false);

  const resetOpener = () => {
    setResetKey((prev) => prev + 1);
    setIsOpenRevealed(false);
  };

  const selectPreset = (p: typeof COLOR_PRESETS[0]) => {
    setPrimaryColor(p.primary);
    setSecondaryColor(p.secondary);
    resetOpener();
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col md:flex-row">
      {/* 1. Control Panel - Left Side */}
      <div className="w-full md:w-[350px] p-6 bg-[#121212] border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between overflow-y-auto max-h-screen">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-500" />
            <h1 className="text-lg font-bold tracking-wider uppercase text-zinc-100">
              Opener Sandbox
            </h1>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Configure entrance styles, colors, and wax seal types. Tapping anywhere in the phone viewport will trigger the grand opening.
          </p>

          <hr className="border-zinc-800" />

          {/* 1a. Select Variant */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
              Opening Style
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {VARIANTS_LIST.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setVariant(v.id);
                    resetOpener();
                  }}
                  className={`w-full text-left p-2.5 rounded text-xs transition border flex items-center justify-between ${
                    variant === v.id
                      ? "bg-amber-500/10 border-amber-500 text-amber-400 font-semibold"
                      : "bg-[#18181b] border-transparent hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <div>
                    <div>{v.label}</div>
                    <div className="text-[10px] opacity-60 font-normal mt-0.5">{v.desc}</div>
                  </div>
                  {variant === v.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* 1b. Seal Type Selection */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
              Locking Seal Target
            </label>
            <div className="flex gap-1.5">
              {(["wax-seal", "gold-coin", "none"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setSealType(t);
                    resetOpener();
                  }}
                  className={`flex-1 py-2 rounded text-xs border capitalize transition ${
                    sealType === t
                      ? "bg-amber-500/10 border-amber-500 text-amber-400 font-semibold"
                      : "bg-[#18181b] border-transparent hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {t.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* 1c. Monogram Input */}
          {sealType !== "none" && (
            <div className="space-y-2">
              <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider block">
                Seal Monogram / Initial
              </label>
              <input
                type="text"
                maxLength={2}
                value={monogram}
                onChange={(e) => {
                  setMonogram(e.target.value);
                  resetOpener();
                }}
                className="w-full bg-[#18181b] border border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-amber-500 font-serif text-center text-lg text-amber-400 tracking-widest"
                placeholder="❦"
              />
              <span className="text-[10px] text-zinc-500">
                Enter 1-2 characters (e.g. initial letter W, symbol like ❦, or initials A&A)
              </span>
            </div>
          )}

          {/* 1d. Color Presets */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
              Indian Color Themes
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {COLOR_PRESETS.map((p, idx) => {
                const isActive = primaryColor === p.primary && secondaryColor === p.secondary;
                return (
                  <button
                    key={idx}
                    onClick={() => selectPreset(p)}
                    className={`w-full p-2 rounded text-xs text-left transition flex items-center gap-2.5 border ${
                      isActive ? "border-amber-500/50 bg-[#1e1c18]" : "border-zinc-800 bg-[#161618] hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.secondary }} />
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: p.primary, borderColor: "rgba(255,255,255,0.2)" }} />
                    </div>
                    <span className="flex-1 text-zinc-300 font-medium">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1e. Direct Color Inputs */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-zinc-400 font-semibold">Primary (Gold)</label>
              <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded border border-zinc-800">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => {
                    setPrimaryColor(e.target.value);
                    resetOpener();
                  }}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-[10px] font-mono text-zinc-300 uppercase">{primaryColor}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-zinc-400 font-semibold">Secondary (Base)</label>
              <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded border border-zinc-800">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => {
                    setSecondaryColor(e.target.value);
                    resetOpener();
                  }}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-[10px] font-mono text-zinc-300 uppercase">{secondaryColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 pt-4 border-t border-zinc-800 space-y-2">
          <button
            onClick={resetOpener}
            className="w-full py-2.5 px-4 rounded bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reload Opener
          </button>
          
          <div className="text-[10px] text-center text-zinc-500">
            {isOpenRevealed ? "✓ Invitation Opened" : "⏳ Click viewport to test open"}
          </div>
        </div>
      </div>

      {/* 2. Live Preview Area - Right Side */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 bg-[#0e0e10]">
        {/* Device Frame Wrapper to simulate mobile viewport */}
        <div className="relative w-full max-w-[390px] h-[780px] bg-[#16161a] rounded-[42px] border-[12px] border-zinc-800 shadow-[0_24px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
          {/* Top Notch Area */}
          <div className="absolute top-0 inset-x-0 h-6 bg-zinc-800 z-50 flex justify-center items-start">
            <div className="w-36 h-4 bg-black rounded-b-xl" />
          </div>
          
          <div className="flex-1 relative w-full h-full overflow-hidden">
            {/* The Opener Component wrapper */}
            <InvitationOpener
              key={resetKey}
              variant={variant}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              sealType={sealType}
              monogram={monogram}
              slug="preview-opener"
              isPreviewMode={true} // Forces opener to display ignoring sessionStorage
              onComplete={() => setIsOpenRevealed(true)}
            >
              {/* Revealed Invitation Content */}
              <div className="w-full h-full bg-[#1b1918] text-[#fbf6ef] flex flex-col justify-between p-8 text-center relative selection:bg-amber-500/20 overflow-y-auto">
                <div className="absolute inset-0 bg-[radial-gradient(#d4af3715_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

                {/* Header */}
                <div className="pt-6 flex flex-col items-center">
                  <div className="w-6 h-6 border border-amber-500/40 rounded-full flex items-center justify-center text-[10px] text-amber-500 mb-2">✦</div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-amber-500/70 font-semibold">
                    Shubh Vivah
                  </span>
                </div>

                {/* Main Hero Card */}
                <div className="my-auto space-y-6">
                  <p className="font-[family-name:var(--font-heading)] text-xl italic text-amber-400">
                    Together with our families
                  </p>
                  
                  <div className="space-y-1">
                    <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold tracking-wide">
                      Aditya
                    </h2>
                    <p className="text-amber-500 text-2xl font-serif">&</p>
                    <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold tracking-wide">
                      Anjali
                    </h2>
                  </div>

                  <p className="text-xs max-w-xs mx-auto text-zinc-300 leading-relaxed font-light">
                    Request the pleasure of your company on the auspicious occasion of our wedding ceremony.
                  </p>
                </div>

                {/* Date / Footer Info */}
                <div className="pb-6 border-t border-amber-500/10 pt-4 flex flex-col items-center gap-1.5">
                  <p className="font-serif text-sm text-zinc-200 tracking-wide">
                    DECEMBER 12, 2026
                  </p>
                  <p className="text-[9px] tracking-widest text-amber-500/80 uppercase font-semibold">
                    UDAIPUR PALACE • RAJASTHAN
                  </p>
                </div>
              </div>
            </InvitationOpener>
          </div>
        </div>

        {/* Back-to-Sandbox overlay indicator if the doors are already opened */}
        {isOpenRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-10 bg-black/80 px-4 py-2 rounded-full border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2 backdrop-blur-md shadow-lg"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Opened! Click <b>Reload Opener</b> in the left panel to test again.</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
