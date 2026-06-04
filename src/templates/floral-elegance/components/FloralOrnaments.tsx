import React from "react";
import { cn } from "@/lib/utils";

interface OrnamentProps {
  className?: string;
  color?: string;
}

export function FloralWreath({ className, color = "var(--template-primary)" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-40 h-40 opacity-40 select-none pointer-events-none", className)}
    >
      {/* Left branch */}
      <path d="M100 170 C60 170 30 130 30 90 C30 50 60 30 90 35" />
      {/* Left leaves */}
      <path d="M40 145 C35 140 25 142 30 152 C35 148 40 147 40 145 Z" fill={color} fillOpacity="0.1" />
      <path d="M30 115 C22 112 18 118 25 125 C30 120 31 118 30 115 Z" fill={color} fillOpacity="0.1" />
      <path d="M30 85 C23 80 22 88 28 93 C32 90 32 87 30 85 Z" fill={color} fillOpacity="0.1" />
      <path d="M42 58 C38 52 32 58 39 64 C43 61 43 59 42 58 Z" fill={color} fillOpacity="0.1" />
      <path d="M65 38 C62 30 54 34 60 42 C65 40 66 39 65 38 Z" fill={color} fillOpacity="0.1" />
      <path d="M88 32 C88 24 78 26 82 34 C86 34 88 33 88 32 Z" fill={color} fillOpacity="0.1" />

      {/* Right branch */}
      <path d="M100 170 C140 170 170 130 170 90 C170 50 140 30 110 35" />
      {/* Right leaves */}
      <path d="M160 145 C165 140 175 142 170 152 C165 148 160 147 160 145 Z" fill={color} fillOpacity="0.1" />
      <path d="M170 115 C178 112 182 118 175 125 C170 120 169 118 170 115 Z" fill={color} fillOpacity="0.1" />
      <path d="M170 85 C177 80 178 88 172 93 C168 90 168 87 170 85 Z" fill={color} fillOpacity="0.1" />
      <path d="M158 58 C162 52 168 58 161 64 C157 61 157 59 158 58 Z" fill={color} fillOpacity="0.1" />
      <path d="M135 38 C138 30 146 34 140 42 C135 40 134 39 135 38 Z" fill={color} fillOpacity="0.1" />
      <path d="M112 32 C112 24 122 26 118 34 C114 34 112 33 112 32 Z" fill={color} fillOpacity="0.1" />
      
      {/* Central flower bud at bottom */}
      <circle cx="100" cy="170" r="4" fill={color} />
      <path d="M96 166 C90 162 90 178 96 174 Z" fill={color} />
      <path d="M104 166 C110 162 110 178 104 174 Z" fill={color} />
    </svg>
  );
}

export function FloralDivider({ className, color = "var(--template-primary)" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 300 40"
      fill="none"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-64 h-8 opacity-45 select-none pointer-events-none", className)}
    >
      {/* Left side flourish */}
      <path d="M30 20 C60 20 80 15 110 20 C120 22 125 25 135 20" />
      <path d="M60 20 C65 15 75 17 70 23" fill={color} fillOpacity="0.15"/>
      <path d="M90 18 C95 12 105 14 100 20" fill={color} fillOpacity="0.15"/>

      {/* Right side flourish */}
      <path d="M270 20 C240 20 220 15 190 20 C180 22 175 25 165 20" />
      <path d="M240 20 C235 15 225 17 230 23" fill={color} fillOpacity="0.15"/>
      <path d="M210 18 C205 12 195 14 200 20" fill={color} fillOpacity="0.15"/>

      {/* Central Flower Bloom */}
      <circle cx="150" cy="20" r="5" fill={color} />
      <path d="M150 10 C146 15 142 15 145 20 C148 20 150 15 150 10 Z" fill={color} />
      <path d="M150 30 C154 25 158 25 155 20 C152 20 150 25 150 30 Z" fill={color} />
      <path d="M140 20 C145 16 145 12 150 15 C150 18 145 20 140 20 Z" fill={color} />
      <path d="M160 20 C155 24 155 28 150 25 C150 22 155 20 160 20 Z" fill={color} />
    </svg>
  );
}

export function CornerLeaves({ className, color = "var(--template-secondary)" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-24 h-24 opacity-35 select-none pointer-events-none", className)}
    >
      <path d="M5 5 C15 35 45 45 95 45" />
      <path d="M5 5 C35 15 45 45 45 95" />
      {/* Corner leaf overlays */}
      <path d="M20 15 C25 25 35 25 25 12 Z" fill={color} fillOpacity="0.1" />
      <path d="M15 20 C25 25 25 35 12 25 Z" fill={color} fillOpacity="0.1" />
      <path d="M40 30 C45 42 55 42 45 27 Z" fill={color} fillOpacity="0.1" />
      <path d="M30 40 C42 45 42 55 27 45 Z" fill={color} fillOpacity="0.1" />
      <path d="M65 40 C72 50 82 48 72 38 Z" fill={color} fillOpacity="0.1" />
      <path d="M40 65 C50 72 48 82 38 72 Z" fill={color} fillOpacity="0.1" />
    </svg>
  );
}

export function BananaLeaf({ className, color = "var(--template-secondary)" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("opacity-25 select-none pointer-events-none", className)}
    >
      {/* Main Stem (Midrib) */}
      <path d="M60 10 C60 10 60 190 60 190" strokeWidth="2.5" />
      
      {/* Left Side Blades */}
      <path d="M60 25 C45 35 25 55 15 80" />
      <path d="M60 45 C40 55 20 75 10 105" />
      <path d="M60 65 C38 75 18 100 8 130" />
      <path d="M60 85 C35 100 15 125 5 155" />
      <path d="M60 105 C38 120 18 145 8 175" />
      <path d="M60 125 C40 140 20 165 10 190" />
      <path d="M60 145 C45 158 25 180 15 195" />

      {/* Right Side Blades */}
      <path d="M60 25 C75 35 95 55 105 80" />
      <path d="M60 45 C80 55 100 75 110 105" />
      <path d="M60 65 C82 75 102 100 112 130" />
      <path d="M60 85 C85 100 105 125 115 155" />
      <path d="M60 105 C82 120 102 145 112 175" />
      <path d="M60 125 C80 140 100 165 110 190" />
      <path d="M60 145 C75 158 95 180 105 195" />

      {/* Leaf Outline / Edge splits typical of banana leaves */}
      <path d="M60 10 C45 25 35 45 30 70 M25 80 C20 95 15 115 15 140 M18 150 C20 170 30 185 60 190" />
      <path d="M60 10 C75 25 85 45 90 70 M95 80 C100 95 105 115 105 140 M102 150 C100 170 90 185 60 190" />
    </svg>
  );
}

