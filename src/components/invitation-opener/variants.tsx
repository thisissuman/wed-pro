"use client";

import React from "react";
import { motion } from "framer-motion";

const r = (n: number) => Math.round(n * 10000) / 10000;
import { durations, easings, springPresets } from "./animations";
import {
  RoyalArchSVG,
  MandalaSVG,
  PalaceGateFiligreeSVG,
  DoorKnockerSVG,
  NamasteSVG,
  MarigoldGarland,
  WaxSealSVG,
  RoyalCoinSVG,
} from "./styles";

export type OpenerVariant =
  | "royal-door"
  | "palace-gate"
  | "curtain-reveal"
  | "mandap-opening"
  | "invitation-flap"
  | "floral-reveal"
  | "namaste-opening"
  | "luxury-minimal";

interface VariantRendererProps {
  variant: OpenerVariant;
  primaryColor: string;
  secondaryColor: string;
  isOpening: boolean;
  onAnimationComplete: () => void;
  sealType?: "wax-seal" | "gold-coin" | "none";
  monogram?: string;
}

// Helper to render half a wax seal/coin on center-split panels
const RenderSealHalf: React.FC<{
  type: "wax-seal" | "gold-coin" | "none";
  side: "left" | "right";
  primaryColor: string;
  secondaryColor: string;
  monogram: string;
  isOpening: boolean;
}> = ({ type, side, primaryColor, secondaryColor, monogram, isOpening }) => {
  if (type === "none") return null;

  const SealComponent = type === "wax-seal" ? WaxSealSVG : RoyalCoinSVG;

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none ${
        side === "left" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
      }`}
      style={{
        clipPath: side === "left" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
      }}
    >
      {/* Subtle background glow ring before opening */}
      {!isOpening && (
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-25"
          style={{ border: `1.5px solid ${primaryColor}` }}
        />
      )}
      
      <SealComponent
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        monogram={monogram}
        className="w-20 h-20 md:w-24 md:h-24"
      />
    </div>
  );
};

export const VariantRenderer: React.FC<VariantRendererProps> = ({
  variant,
  primaryColor,
  secondaryColor,
  isOpening,
  onAnimationComplete,
  sealType = "wax-seal",
  monogram = "❦",
}) => {
  // Base background style (uses rich radial gradient mixed with dark tones for luxurious depth)
  const bgStyle: React.CSSProperties = {
    background: `radial-gradient(circle, ${secondaryColor}cc 0%, #0d0d0d 100%)`,
    backgroundColor: secondaryColor,
  };

  const goldStrokeStyle = { borderColor: primaryColor };

  // 1. ROYAL DOOR VARIANT (Grand 3D double doors)
  if (variant === "royal-door") {
    return (
      <div className="absolute inset-0 flex overflow-hidden z-0 [perspective:1400px]" style={{ backgroundColor: "#090909" }}>
        {/* Left Door */}
        <motion.div
          initial={{ rotateY: 0, x: 0 }}
          animate={isOpening ? { rotateY: -95, x: "-100%", opacity: 0 } : { rotateY: 0, x: 0 }}
          transition={{ duration: durations.gateOpen, ease: easings.luxury }}
          className="w-1/2 h-full relative [transform-origin:left_center] border-r border-amber-500/20 shadow-2xl flex items-center justify-end overflow-visible"
          style={bgStyle}
        >
          {/* Inner panel detailing */}
          <div className="absolute inset-4 md:inset-8 border border-double rounded-l-md pointer-events-none" style={{ ...goldStrokeStyle, borderWidth: "3px" }} />
          <div className="absolute inset-8 md:inset-16 border border-amber-500/10 rounded-l-sm pointer-events-none" />
          <RoyalArchSVG primaryColor={primaryColor} />
          <DoorKnockerSVG color={primaryColor} isLeft={true} />
          
          {/* Left half of the seal locking the doors */}
          <RenderSealHalf
            type={sealType}
            side="left"
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            monogram={monogram}
            isOpening={isOpening}
          />
        </motion.div>

        {/* Right Door */}
        <motion.div
          initial={{ rotateY: 0, x: 0 }}
          animate={isOpening ? { rotateY: 95, x: "100%", opacity: 0 } : { rotateY: 0, x: 0 }}
          transition={{ duration: durations.gateOpen, ease: easings.luxury }}
          onAnimationComplete={() => {
            if (isOpening) onAnimationComplete();
          }}
          className="w-1/2 h-full relative [transform-origin:right_center] border-l border-amber-500/20 shadow-2xl flex items-center justify-start overflow-visible"
          style={bgStyle}
        >
          {/* Inner panel detailing */}
          <div className="absolute inset-4 md:inset-8 border border-double rounded-r-md pointer-events-none" style={{ ...goldStrokeStyle, borderWidth: "3px" }} />
          <div className="absolute inset-8 md:inset-16 border border-amber-500/10 rounded-r-sm pointer-events-none" />
          <RoyalArchSVG primaryColor={primaryColor} />
          <DoorKnockerSVG color={primaryColor} isLeft={false} />

          {/* Right half of the seal locking the doors */}
          <RenderSealHalf
            type={sealType}
            side="right"
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            monogram={monogram}
            isOpening={isOpening}
          />
        </motion.div>
      </div>
    );
  }

  // 2. PALACE GATE VARIANT (Hinged metal security gates swinging open)
  if (variant === "palace-gate") {
    return (
      <div className="absolute inset-0 flex overflow-hidden z-0 [perspective:1200px]" style={bgStyle}>
        <div className="absolute inset-0 bg-black/55 z-0 pointer-events-none" />
        
        {/* Left Gate */}
        <motion.div
          initial={{ rotateY: 0, x: 0 }}
          animate={isOpening ? { rotateY: -105, x: "-100%", opacity: 0 } : { rotateY: 0, x: 0 }}
          transition={springPresets.heavyGate}
          className="w-1/2 h-full relative [transform-origin:left_center] border-r border-amber-500/30 flex items-center justify-end z-10 overflow-visible"
        >
          <PalaceGateFiligreeSVG color={primaryColor} />
          
          <RenderSealHalf
            type={sealType}
            side="left"
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            monogram={monogram}
            isOpening={isOpening}
          />
        </motion.div>

        {/* Right Gate */}
        <motion.div
          initial={{ rotateY: 0, x: 0 }}
          animate={isOpening ? { rotateY: 105, x: "100%", opacity: 0 } : { rotateY: 0, x: 0 }}
          transition={springPresets.heavyGate}
          onAnimationComplete={() => {
            if (isOpening) onAnimationComplete();
          }}
          className="w-1/2 h-full relative [transform-origin:right_center] border-l border-amber-500/30 flex items-center justify-start z-10 overflow-visible"
        >
          <PalaceGateFiligreeSVG color={primaryColor} />
          
          <RenderSealHalf
            type={sealType}
            side="right"
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            monogram={monogram}
            isOpening={isOpening}
          />
        </motion.div>
      </div>
    );
  }

  // 3. CURTAIN REVEAL VARIANT (Velvet silk drapery sliding apart)
  if (variant === "curtain-reveal") {
    return (
      <div className="absolute inset-0 flex overflow-hidden z-0 bg-[#090909]">
        {/* Left Curtain */}
        <motion.div
          initial={{ x: 0, scaleX: 1 }}
          animate={isOpening ? { x: "-105%", scaleX: 0.6, opacity: 0 } : { x: 0, scaleX: 1 }}
          transition={{ duration: durations.cinematic, ease: easings.drape }}
          className="w-1/2 h-full relative [transform-origin:left_center] border-r-2 flex items-center justify-end overflow-visible"
          style={{
            ...bgStyle,
            boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
            borderColor: primaryColor,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/35 mix-blend-multiply pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-2 opacity-80" style={{ backgroundColor: primaryColor }} />
          
          <RenderSealHalf
            type={sealType}
            side="left"
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            monogram={monogram}
            isOpening={isOpening}
          />
        </motion.div>

        {/* Right Curtain */}
        <motion.div
          initial={{ x: 0, scaleX: 1 }}
          animate={isOpening ? { x: "105%", scaleX: 0.6, opacity: 0 } : { x: 0, scaleX: 1 }}
          transition={{ duration: durations.cinematic, ease: easings.drape }}
          onAnimationComplete={() => {
            if (isOpening) onAnimationComplete();
          }}
          className="w-1/2 h-full relative [transform-origin:right_center] border-l-2 flex items-center justify-start overflow-visible"
          style={{
            ...bgStyle,
            boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
            borderColor: primaryColor,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-black/35 mix-blend-multiply pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-2 opacity-80" style={{ backgroundColor: primaryColor }} />
          
          <RenderSealHalf
            type={sealType}
            side="right"
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            monogram={monogram}
            isOpening={isOpening}
          />
        </motion.div>
      </div>
    );
  }

  // 4. MANDAP OPENING VARIANT (Hanging garlands and sheer backdrop lifting upwards)
  if (variant === "mandap-opening") {
    const FullSealComponent = sealType === "wax-seal" ? WaxSealSVG : RoyalCoinSVG;
    
    return (
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={isOpening ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: durations.cinematic, ease: easings.luxury, delay: 0.3 }}
        onAnimationComplete={() => {
          if (isOpening) onAnimationComplete();
        }}
        className="absolute inset-0 flex flex-col justify-between overflow-hidden z-0"
        style={bgStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-orange-500/10 pointer-events-none" />
        <div className="w-full h-8 border-b-4 opacity-75 z-20" style={{ backgroundColor: secondaryColor, borderColor: primaryColor }} />

        {/* Garland loops / strands hanging */}
        <div className="absolute inset-x-0 top-8 bottom-0 flex justify-around px-4 z-10 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 0 }}
              animate={isOpening ? { y: "-120%", opacity: 0 } : { y: 0 }}
              transition={{
                duration: durations.cinematic,
                ease: easings.luxury,
                delay: i * 0.08,
              }}
            >
              <MarigoldGarland color={primaryColor} height="85vh" />
            </motion.div>
          ))}
        </div>

        {/* Unsplit central seal that moves up with the panel */}
        {sealType !== "none" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center">
            {!isOpening && (
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ border: `2.5px solid ${primaryColor}` }}
              />
            )}
            <FullSealComponent
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              monogram={monogram}
              className="w-20 h-20 md:w-24 md:h-24"
            />
          </div>
        )}

        <RoyalArchSVG primaryColor={primaryColor} />
      </motion.div>
    );
  }

  // 5. INVITATION FLAP VARIANT (Envelope flap opening upwards with detailed wax seal)
  if (variant === "invitation-flap") {
    const FullSealComponent = sealType === "wax-seal" ? WaxSealSVG : RoyalCoinSVG;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0" style={bgStyle}>
        <motion.div
          animate={isOpening ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: durations.reveal, delay: 0.4 }}
          onAnimationComplete={() => {
            if (isOpening) onAnimationComplete();
          }}
          className="relative w-[90%] max-w-[420px] aspect-[4/3] rounded-lg shadow-2xl overflow-visible z-10 flex flex-col items-center justify-center [perspective:1000px]"
          style={{
            backgroundColor: secondaryColor,
            border: `1.5px solid ${primaryColor}40`,
          }}
        >
          {/* Top Flap (Trigonal flap rotating upwards) */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={isOpening ? { rotateX: -180 } : { rotateX: 0 }}
            transition={springPresets.flapUnlock}
            className="absolute top-0 inset-x-0 h-1/2 [transform-origin:top_center] rounded-t-lg z-20 overflow-visible"
            style={{
              backgroundColor: secondaryColor,
              borderBottom: `2px solid ${primaryColor}`,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          >
            {/* 3D Wax Seal locking the envelope tip */}
            {sealType !== "none" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 pointer-events-none">
                {!isOpening && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-25"
                    style={{ border: `1.5px solid ${primaryColor}` }}
                  />
                )}
                <FullSealComponent
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  monogram={monogram}
                  className="w-16 h-16 md:w-20 md:h-20"
                />
              </div>
            )}
          </motion.div>

          {/* Envelope Body / Lower Sleeve */}
          <div className="absolute bottom-0 inset-x-0 h-[65%] rounded-b-lg bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10">
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l" style={goldStrokeStyle} />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r" style={goldStrokeStyle} />
          </div>

          {/* Card sliding out */}
          <motion.div
            initial={{ y: 0, opacity: 0.9 }}
            animate={isOpening ? { y: "-60px", opacity: 0 } : { y: 0, opacity: 0.9 }}
            transition={{ duration: durations.reveal, ease: easings.luxury, delay: 0.2 }}
            className="w-[85%] h-[80%] rounded border bg-gradient-to-br from-[#ffffff] via-[#fffbf2] to-[#fff3d4] flex flex-col items-center justify-center p-4 text-center select-none"
            style={{ borderColor: primaryColor }}
          >
            <MandalaSVG color={primaryColor} className="w-16 h-16 opacity-30 mb-2" />
            <span className="font-[family-name:var(--font-heading)] text-lg tracking-[0.2em] uppercase text-slate-800 font-semibold">
              शुभ विवाह
            </span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // 6. FLORAL REVEAL VARIANT (Wreath scaling and bursting outwards with central seal)
  if (variant === "floral-reveal") {
    const FullSealComponent = sealType === "wax-seal" ? WaxSealSVG : RoyalCoinSVG;
    
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: durations.reveal, delay: 0.4 }}
        onAnimationComplete={() => {
          if (isOpening) onAnimationComplete();
        }}
        className="absolute inset-0 flex items-center justify-center overflow-hidden z-0"
        style={bgStyle}
      >
        <RoyalArchSVG primaryColor={primaryColor} />

        {/* Concentric scaling flower rings */}
        <div className="relative w-72 h-72 flex items-center justify-center pointer-events-none">
          {/* Inner Mandala */}
          <motion.div
            animate={isOpening ? { scale: 1.8, opacity: 0, rotate: 60 } : { scale: 1, opacity: 0.7, rotate: 0 }}
            transition={{ duration: durations.cinematic, ease: easings.luxury }}
            className="absolute"
          >
            <MandalaSVG color={primaryColor} className="w-48 h-48" />
          </motion.div>

          {/* Central 3D seal */}
          {sealType !== "none" && (
            <motion.div
              animate={isOpening ? { scale: 2.2, opacity: 0, rotate: -45 } : { scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: durations.cinematic, ease: easings.luxury }}
              className="absolute z-20"
            >
              <FullSealComponent
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                monogram={monogram}
                className="w-16 h-16 md:w-20 md:h-20"
              />
            </motion.div>
          )}

          {/* Outer floating petals/flowers */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const radius = 110;
            const x = r(radius * Math.cos(angle));
            const y = r(radius * Math.sin(angle));

            return (
              <motion.div
                key={i}
                initial={{ x, y, scale: 1, opacity: 0.8 }}
                animate={
                  isOpening
                    ? { x: x * 2.2, y: y * 2.2, scale: 1.8, opacity: 0, rotate: 90 }
                    : { x, y, scale: 1, opacity: 0.8 }
                }
                transition={{
                  duration: durations.cinematic,
                  ease: easings.luxury,
                  delay: i * 0.03,
                }}
                className="absolute w-8 h-8 rounded-full border border-orange-500 flex items-center justify-center bg-gradient-to-r from-amber-400 to-orange-500 shadow-md"
              >
                <div className="w-3 h-3 rounded-full bg-amber-200/50" />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // 7. NAMASTE OPENING VARIANT (Hands sliding apart)
  if (variant === "namaste-opening") {
    // Note: The Namaste hands are their own central icon and do not split with a seal.
    return (
      <div className="absolute inset-0 flex overflow-hidden z-0">
        {/* Left Half Background Panel */}
        <motion.div
          initial={{ x: 0 }}
          animate={isOpening ? { x: "-100%", opacity: 0 } : { x: 0 }}
          transition={{ duration: durations.cinematic, ease: easings.luxury }}
          className="w-1/2 h-full relative [transform-origin:right_center] flex items-center justify-end overflow-hidden border-r border-amber-500/10"
          style={bgStyle}
        >
          <RoyalArchSVG primaryColor={primaryColor} />
          {/* Left half of the Namaste hands outline */}
          <div className="w-16 h-40 absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden z-10">
            <NamasteSVG color={primaryColor} className="w-32 h-40 absolute left-0" />
          </div>
        </motion.div>

        {/* Right Half Background Panel */}
        <motion.div
          initial={{ x: 0 }}
          animate={isOpening ? { x: "100%", opacity: 0 } : { x: 0 }}
          transition={{ duration: durations.cinematic, ease: easings.luxury }}
          onAnimationComplete={() => {
            if (isOpening) onAnimationComplete();
          }}
          className="w-1/2 h-full relative [transform-origin:left_center] flex items-center justify-start overflow-hidden border-l border-amber-500/10"
          style={bgStyle}
        >
          <RoyalArchSVG primaryColor={primaryColor} />
          {/* Right half of the Namaste hands outline */}
          <div className="w-16 h-40 absolute left-0 top-1/2 -translate-y-1/2 overflow-hidden z-10">
            <NamasteSVG color={primaryColor} className="w-32 h-40 absolute right-0" />
          </div>
        </motion.div>
      </div>
    );
  }

  // 8. LUXURY MINIMAL VARIANT (Vertically splitting panels with minimal seal)
  if (variant === "luxury-minimal") {
    return (
      <div className="absolute inset-0 flex overflow-hidden z-0 bg-[#090909]">
        {/* Left Panel */}
        <motion.div
          initial={{ x: 0 }}
          animate={isOpening ? { x: "-100%", opacity: 0 } : { x: 0 }}
          transition={{ duration: durations.cinematic, ease: easings.luxury }}
          className="w-1/2 h-full relative border-r border-zinc-800 shadow-xl flex items-center justify-end overflow-visible"
          style={bgStyle}
        >
          <div className="absolute inset-6 md:inset-10 border border-r-0" style={goldStrokeStyle} />
          
          <RenderSealHalf
            type={sealType}
            side="left"
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            monogram={monogram}
            isOpening={isOpening}
          />
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ x: 0 }}
          animate={isOpening ? { x: "100%", opacity: 0 } : { x: 0 }}
          transition={{ duration: durations.cinematic, ease: easings.luxury }}
          onAnimationComplete={() => {
            if (isOpening) onAnimationComplete();
          }}
          className="w-1/2 h-full relative border-l border-zinc-800 shadow-xl flex items-center justify-start overflow-visible"
          style={bgStyle}
        >
          <div className="absolute inset-6 md:inset-10 border border-l-0" style={goldStrokeStyle} />
          
          <RenderSealHalf
            type={sealType}
            side="right"
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            monogram={monogram}
            isOpening={isOpening}
          />
        </motion.div>
      </div>
    );
  }

  return null;
};
