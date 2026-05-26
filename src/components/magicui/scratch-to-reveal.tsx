"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ScratchToRevealProps {
  children: React.ReactNode;
  width: number;
  height: number;
  minScratchPercentage?: number;
  className?: string;
  onComplete?: () => void;
  gradientColors?: [string, string, string];
}

export const ScratchToReveal: React.FC<ScratchToRevealProps> = ({
  width,
  height,
  minScratchPercentage = 50,
  onComplete,
  children,
  className,
  gradientColors = ["#A97CF8", "#F38CB8", "#FDCC92"],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const controls = useAnimation();

  const paintOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#1a1510";
    ctx.fillRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, gradientColors[0]);
    gradient.addColorStop(0.5, gradientColors[1]);
    gradient.addColorStop(1, gradientColors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, [gradientColors, height, width]);

  useEffect(() => {
    if (!isComplete) paintOverlay();
  }, [isComplete, paintOverlay]);

  const scratch = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || isComplete) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
    },
    [isComplete]
  );

  const checkCompletion = useCallback(() => {
    if (isComplete) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const totalPixels = pixels.length / 4;
    let clearPixels = 0;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) clearPixels += 1;
    }

    const sampledTotal = Math.ceil(totalPixels / 16);
    const percentage = (clearPixels / sampledTotal) * 100;

    if (percentage >= minScratchPercentage) {
      setIsComplete(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      void controls
        .start({
          scale: [1, 1.08, 1],
          rotate: [0, 4, -4, 0],
          transition: { duration: 0.55, ease: "easeOut" },
        })
        .then(() => onComplete?.());
    }
  }, [controls, isComplete, minScratchPercentage, onComplete]);

  useEffect(() => {
    if (!isScratching || isComplete) return;

    const onMouseMove = (event: MouseEvent) => {
      scratch(event.clientX, event.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) scratch(touch.clientX, touch.clientY);
    };

    const endScratch = () => {
      setIsScratching(false);
      checkCompletion();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endScratch);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", endScratch);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endScratch);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", endScratch);
    };
  }, [checkCompletion, isComplete, isScratching, scratch]);

  return (
    <motion.div
      className={cn("relative mx-auto flex select-none items-center justify-center", className)}
      style={{ width, height }}
      animate={controls}
    >
      <div className="relative z-0 flex h-full w-full items-center justify-center">{children}</div>
      {!isComplete && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0 z-10 touch-none"
          style={{ cursor: "grab" }}
          aria-label="Scratch to reveal"
          onMouseDown={() => setIsScratching(true)}
          onTouchStart={() => setIsScratching(true)}
        />
      )}
    </motion.div>
  );
};
