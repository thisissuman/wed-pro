import React from "react";

// Ornate Mughal/Rajput arch frame for Indian vibes
export const RoyalArchSVG: React.FC<{ primaryColor: string }> = ({ primaryColor }) => (
  <svg
    viewBox="0 0 400 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-20 md:opacity-30 z-0"
    preserveAspectRatio="none"
  >
    <path
      d="M200 40 C140 40, 100 80, 100 130 C100 150, 90 170, 70 180 C40 195, 20 220, 20 270 L20 600 L380 600 L380 270 C380 220, 360 195, 330 180 C310 170, 300 150, 300 130 C300 80, 260 40, 200 40 Z"
      stroke={primaryColor}
      strokeWidth="2"
      strokeDasharray="4 4"
    />
    <path
      d="M200 60 C150 60, 115 95, 115 140 C115 165, 105 185, 85 195 C60 210, 40 230, 40 275 L40 580 L360 580 L360 275 C360 230, 340 210, 315 195 C295 185, 285 165, 285 140 C285 95, 250 60, 200 60 Z"
      stroke={primaryColor}
      strokeWidth="1.5"
    />
    {/* Decorative corner motifs */}
    <path d="M40 275 L60 275 L50 290 Z" fill={primaryColor} />
    <path d="M360 275 L340 275 L350 290 Z" fill={primaryColor} />
  </svg>
);

// Realistic 3D Melted Wax Seal
export const WaxSealSVG: React.FC<{ primaryColor: string; secondaryColor: string; monogram?: string; className?: string }> = ({
  primaryColor,
  secondaryColor,
  monogram = "W",
  className = "",
}) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-24 h-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] select-none ${className}`}
  >
    <defs>
      {/* 3D highlights and shadows */}
      <radialGradient id="wax-base" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#ff4d6d" />
        <stop offset="50%" stopColor={secondaryColor} />
        <stop offset="100%" stopColor="#3d0007" />
      </radialGradient>
      <linearGradient id="gold-monogram" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE5A3" />
        <stop offset="50%" stopColor={primaryColor} />
        <stop offset="100%" stopColor="#996515" />
      </linearGradient>
      <filter id="bevel-emboss" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
        <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1.2" specularExponent="15" lightingColor="#ffccd5" result="light">
          <fePointLight x="-20" y="-20" z="40" />
        </feSpecularLighting>
        <feComposite in="light" in2="SourceAlpha" operator="in" result="specular" />
        <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
      </filter>
    </defs>
    
    {/* Organic melted outer shape */}
    <path
      d="M 50 8 C 65 6, 76 13, 85 22 C 94 31, 95 44, 91 58 C 87 72, 83 85, 71 91 C 59 97, 44 94, 30 90 C 16 86, 6 74, 8 59 C 10 44, 7 30, 18 19 C 29 8, 35 10, 50 8 Z"
      fill="url(#wax-base)"
      filter="url(#bevel-emboss)"
    />
    
    {/* Inner circular stamp ridge */}
    <path
      d="M 50 18 C 68 18, 82 32, 82 50 C 82 68, 68 82, 50 82 C 32 82, 18 68, 18 50 C 18 32, 32 18, 50 18 Z"
      stroke="#ffffff"
      strokeWidth="1"
      strokeOpacity="0.15"
      fill="none"
    />
    
    {/* Inner flat stamp depression */}
    <circle cx="50" cy="50" r="28" fill={secondaryColor} opacity="0.4" />
    
    {/* Gold monogram character stamped in the middle */}
    <text
      x="50"
      y="58"
      textAnchor="middle"
      fill="url(#gold-monogram)"
      fontFamily="Georgia, serif"
      fontSize="26"
      fontWeight="bold"
      letterSpacing="-0.05em"
      style={{
        textShadow: "0px -1px 1px rgba(0,0,0,0.5), 0px 1px 1px rgba(255,255,255,0.3)",
      }}
    >
      {monogram}
    </text>
  </svg>
);

// Metallic Gold Royal Coin Medallion
export const RoyalCoinSVG: React.FC<{ primaryColor: string; secondaryColor: string; monogram?: string; className?: string }> = ({
  monogram = "❦",
  className = "",
}) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-24 h-24 drop-shadow-[0_10px_20px_rgba(0,0,0,0.65)] select-none ${className}`}
  >
    <defs>
      <linearGradient id="gold-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF4D4" />
        <stop offset="25%" stopColor="#E9C349" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="75%" stopColor="#A8801C" />
        <stop offset="100%" stopColor="#FFF4D4" />
      </linearGradient>
      <linearGradient id="gold-inner" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#FFE088" />
        <stop offset="50%" stopColor="#C99B27" />
        <stop offset="100%" stopColor="#553E0B" />
      </linearGradient>
    </defs>
    
    {/* Outer brass ring */}
    <circle cx="50" cy="50" r="46" fill="url(#gold-metallic)" />
    
    {/* Ridged border tick marks */}
    {Array.from({ length: 48 }).map((_, i) => {
      const angle = (i * 7.5 * Math.PI) / 180;
      const x1 = 50 + 42 * Math.cos(angle);
      const y1 = 50 + 42 * Math.sin(angle);
      const x2 = 50 + 45 * Math.cos(angle);
      const y2 = 50 + 45 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#73530F" strokeWidth="1" opacity="0.6" />;
    })}

    {/* Inner dark rim */}
    <circle cx="50" cy="50" r="39" fill="#131313" stroke="url(#gold-metallic)" strokeWidth="1" />
    
    {/* Core medallion face */}
    <circle cx="50" cy="50" r="34" fill="url(#gold-inner)" />
    <circle cx="50" cy="50" r="31" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />

    {/* Stamped letter/motif */}
    <text
      x="50"
      y="57"
      textAnchor="middle"
      fill="#131313"
      fontFamily="Georgia, serif"
      fontSize="22"
      fontWeight="bold"
      opacity="0.85"
      style={{
        textShadow: "0.5px 0.5px 0px rgba(255,255,255,0.4)",
      }}
    >
      {monogram}
    </text>
  </svg>
);

// Radial geometric mandala pattern
export const MandalaSVG: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="100" cy="100" r="90" stroke={color} strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
    <circle cx="100" cy="100" r="75" stroke={color} strokeWidth="1.5" opacity="0.6" />
    <circle cx="100" cy="100" r="50" stroke={color} strokeWidth="1" opacity="0.8" />
    <circle cx="100" cy="100" r="30" stroke={color} strokeWidth="2" />
    
    {/* Mandala Petals */}
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 100 + 30 * Math.cos(angle);
      const y1 = 100 + 30 * Math.sin(angle);
      const x2 = 100 + 75 * Math.cos(angle);
      const y2 = 100 + 75 * Math.sin(angle);
      const cx1 = 100 + 50 * Math.cos(angle - 0.2);
      const cy1 = 100 + 50 * Math.sin(angle - 0.2);
      const cx2 = 100 + 50 * Math.cos(angle + 0.2);
      const cy2 = 100 + 50 * Math.sin(angle + 0.2);
      
      return (
        <path
          key={i}
          d={`M ${x1} ${y1} Q ${cx1} ${cy1} ${x2} ${y2} Q ${cx2} ${cy2} ${x1} ${y1}`}
          stroke={color}
          strokeWidth="1"
          opacity="0.75"
        />
      );
    })}

    {/* Small outer dots */}
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      const x = 100 + 82 * Math.cos(angle);
      const y = 100 + 82 * Math.sin(angle);
      return <circle key={i} cx={x} cy={y} r="1.5" fill={color} opacity="0.7" />;
    })}
  </svg>
);

// Traditional Palace Gate Filigree
export const PalaceGateFiligreeSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg
    viewBox="0 0 200 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full object-cover opacity-80"
  >
    {/* Vertical bars */}
    {Array.from({ length: 6 }).map((_, i) => {
      const x = 20 + i * 32;
      return <line key={i} x1={x} y1="0" x2={x} y2="600" stroke={color} strokeWidth="1" opacity="0.3" />;
    })}
    
    {/* Ornate arch curves */}
    <path d="M 0 50 Q 100 20 200 50" stroke={color} strokeWidth="2" />
    <path d="M 0 100 Q 100 70 200 100" stroke={color} strokeWidth="1.5" />
    <path d="M 0 500 L 200 500" stroke={color} strokeWidth="2" />
    <path d="M 0 520 L 200 520" stroke={color} strokeWidth="1.5" />

    {/* Filigree scrolls */}
    {Array.from({ length: 5 }).map((_, rowIndex) => {
      const y = 150 + rowIndex * 80;
      return (
        <g key={rowIndex} opacity="0.7">
          {/* Heart shaped flourish */}
          <path
            d={`M 20 ${y} C 50 ${y-30}, 80 ${y-30}, 100 ${y} C 120 ${y-30}, 150 ${y-30}, 180 ${y}`}
            stroke={color}
            strokeWidth="1.5"
          />
          <path
            d={`M 20 ${y} C 50 ${y+30}, 80 ${y+30}, 100 ${y} C 120 ${y+30}, 150 ${y+30}, 180 ${y}`}
            stroke={color}
            strokeWidth="1.5"
          />
          {/* Center medallion */}
          <circle cx="100" cy={y} r="10" stroke={color} strokeWidth="1.5" fill="none" />
          <circle cx="100" cy={y} r="4" fill={color} />
        </g>
      );
    })}
  </svg>
);

// Brass door knocker / handle ring
export const DoorKnockerSVG: React.FC<{ color: string; isLeft: boolean }> = ({ color, isLeft }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-20 h-20 absolute top-1/2 -translate-y-1/2 ${isLeft ? "right-2" : "left-2"} z-20 opacity-20`}
  >
    {/* Ornate backplate */}
    <path
      d="M 50 10 C 65 10, 75 20, 75 35 C 75 45, 60 55, 50 70 C 40 55, 25 45, 25 35 C 25 20, 35 10, 50 10 Z"
      fill={color}
      opacity="0.15"
    />
    <path
      d="M 50 12 C 63 12, 73 21, 73 35 C 73 44, 59 53, 50 67 C 41 53, 27 44, 27 35 C 27 21, 37 12, 50 12 Z"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Central core node */}
    <circle cx="50" cy="35" r="12" fill={color} />
    <circle cx="50" cy="35" r="8" fill="#131313" stroke={color} strokeWidth="1" />
    
    {/* Ring knocker */}
    <circle
      cx="50"
      cy="58"
      r="22"
      stroke={color}
      strokeWidth="4.5"
      strokeLinecap="round"
      className="drop-shadow-md"
    />
    <circle cx="50" cy="58" r="16" stroke="#131313" strokeWidth="1" />
  </svg>
);

// Namaste Hand Gestures SVG Outline
export const NamasteSVG: React.FC<{ color: string; className?: string }> = ({ color, className }) => (
  <svg
    viewBox="0 0 100 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Elegant vector lines representing hands folded in prayer */}
    <path
      d="M 50 10 C 51.5 25, 63 45, 68 70 C 72 90, 70 105, 58 112 L 50 115 L 42 112 C 30 105, 28 90, 32 70 C 37 45, 48.5 25, 50 10 Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Thumb crease lines */}
    <path d="M 45 60 C 47 65, 47 75, 44 82" stroke={color} strokeWidth="1.5" opacity="0.8" />
    <path d="M 55 60 C 53 65, 53 75, 56 82" stroke={color} strokeWidth="1.5" opacity="0.8" />
    
    {/* Wrist bangles/kadas for traditional look */}
    <path d="M 33.5 98 C 39 96, 61 96, 66.5 98" stroke={color} strokeWidth="2" />
    <path d="M 35.5 103 C 41 101, 59 101, 64.5 103" stroke={color} strokeWidth="1.5" />
    <path d="M 37.5 108 C 43 106, 57 106, 62.5 108" stroke={color} strokeWidth="1" />
    
    {/* Lotus symbol below hands */}
    <path
      d="M 50 116 C 53 118, 56 118, 59 116 C 57 114, 53 114, 50 116 Z"
      fill={color}
    />
  </svg>
);

// Marigold Garlands Hanging SVG for Mandap Opening
export const MarigoldGarland: React.FC<{ color: string; height: string; delay?: number }> = ({
  height,
}) => {
  const flowerCount = 12;
  return (
    <div
      className="flex flex-col items-center select-none"
      style={{ height }}
    >
      {/* Golden/Brass thread */}
      <div className="w-[1.5px] bg-amber-400 opacity-60 flex-1 relative flex flex-col justify-between py-2">
        {Array.from({ length: flowerCount }).map((_, idx) => {
          // Alternating color marigolds (deep orange and bright yellow)
          const fill = idx % 2 === 0 ? "#FF8C00" : "#FFD700";
          return (
            <div
              key={idx}
              className="w-4 h-4 rounded-full border border-orange-700/30 flex items-center justify-center -translate-x-[7px] shadow-sm relative group"
              style={{
                backgroundColor: fill,
                boxShadow: `0 2px 5px ${idx % 2 === 0 ? "rgba(255,140,0,0.4)" : "rgba(255,215,0,0.4)"}`,
              }}
            >
              {/* Little green leaf separator on some */}
              {idx % 3 === 0 && (
                <div className="absolute -bottom-1 left-1.5 w-1 h-2 bg-emerald-700 rounded-full rotate-45" />
              )}
              {/* Flower inner petalling details */}
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
            </div>
          );
        })}
      </div>
      
      {/* Hanging brass bell at the bottom of the garland */}
      <svg
        viewBox="0 0 30 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-8 text-amber-500 drop-shadow"
      >
        <path
          d="M 15 5 C 10 5, 8 10, 8 16 C 8 22, 5 26, 4 28 L 26 28 C 25 26, 22 22, 22 16 C 22 10, 20 5, 15 5 Z"
          fill="currentColor"
          stroke="#D4AF37"
          strokeWidth="1"
        />
        <path d="M 4 28 C 4 30, 26 30, 26 28" stroke="#996515" strokeWidth="2" />
        {/* Clapper */}
        <circle cx="15" cy="33" r="3" fill="#D4AF37" />
      </svg>
    </div>
  );
};
