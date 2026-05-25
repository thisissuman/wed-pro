"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const REVEAL_THRESHOLD = 0.42;

interface ScratchRevealProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

/**
 * Touch-friendly scratch overlay to reveal hidden content (e.g. wedding date).
 */
export function ScratchReveal({
  children,
  label = "Scratch to reveal the date",
  className = "",
}: ScratchRevealProps) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(reducedMotion);
  const drawingRef = useRef(false);

  const resizeCanvas = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "rgba(26, 15, 15, 0.92)";
    ctx.fillRect(0, 0, rect.width, rect.height);

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "rgba(212, 175, 55, 0.35)");
    gradient.addColorStop(1, "rgba(139, 90, 43, 0.25)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = "rgba(212, 175, 55, 0.9)";
    ctx.font = "600 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, rect.width / 2, rect.height / 2);
  }, [label]);

  useEffect(() => {
    if (reducedMotion || revealed) return;
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [reducedMotion, revealed, resizeCanvas]);

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || revealed) return;

      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const sample = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let cleared = 0;
      const step = 8 * dpr;
      for (let i = 3; i < sample.data.length; i += 4 * step) {
        if (sample.data[i] === 0) cleared += 1;
      }
      const total = sample.data.length / (4 * step);
      if (cleared / total >= REVEAL_THRESHOLD) {
        setRevealed(true);
      }
    },
    [revealed]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (revealed) return;
    drawingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawingRef.current || revealed) return;
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerUp = () => {
    drawingRef.current = false;
  };

  if (reducedMotion || revealed) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative z-0">{children}</div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 touch-none cursor-pointer rounded-sm"
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
    </div>
  );
}
