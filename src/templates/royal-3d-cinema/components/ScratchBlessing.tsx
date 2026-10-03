"use client";
/* eslint-disable @next/next/no-img-element -- decorative template props are immutable local media */

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Sparkles } from "lucide-react";
import type { BlessingData } from "@/types/wedding.types";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
import { royalCinemaAssets } from "../assets";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface ScratchBlessingProps {
  blessing: BlessingData;
}

export function ScratchBlessing({ blessing }: ScratchBlessingProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const pointRef = useRef<{ x: number; y: number } | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const drawRafRef = useRef<number | null>(null);
  const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastSampleRef = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const reducedMotion = useReducedMotion();

  const reveal = useCallback(() => setRevealed(true), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const shell = shellRef.current;
    if (!canvas || !shell) return;

    if (reducedMotion) return;

    const renderCover = () => {
      const rect = shell.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const context = canvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (!context) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, rect.width, rect.height);

      const foil = context.createLinearGradient(
        0,
        0,
        rect.width,
        rect.height,
      );
      foil.addColorStop(0, "#6f4610");
      foil.addColorStop(0.18, "#d5a640");
      foil.addColorStop(0.38, "#fff0a8");
      foil.addColorStop(0.57, "#ad741e");
      foil.addColorStop(0.76, "#f5cf69");
      foil.addColorStop(1, "#70440d");
      context.fillStyle = foil;
      context.fillRect(0, 0, rect.width, rect.height);

      const sheen = context.createRadialGradient(
        rect.width * 0.32,
        rect.height * 0.18,
        0,
        rect.width * 0.32,
        rect.height * 0.18,
        rect.width * 0.9,
      );
      sheen.addColorStop(0, "rgba(255, 251, 207, 0.76)");
      sheen.addColorStop(0.4, "rgba(255, 223, 135, 0.12)");
      sheen.addColorStop(1, "rgba(73, 35, 4, 0.34)");
      context.fillStyle = sheen;
      context.fillRect(0, 0, rect.width, rect.height);

      context.save();
      context.globalAlpha = 0.22;
      context.strokeStyle = "#fff7cc";
      context.lineWidth = 1;
      const lineGap = Math.max(18, rect.width / 18);
      for (
        let offset = -rect.height;
        offset < rect.width + rect.height;
        offset += lineGap
      ) {
        context.beginPath();
        context.moveTo(offset, 0);
        context.lineTo(offset - rect.height, rect.height);
        context.stroke();
      }
      context.restore();

      context.save();
      context.fillStyle = "rgba(75, 38, 6, 0.72)";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `700 ${Math.max(12, rect.width * 0.035)}px system-ui, sans-serif`;
      context.fillText(
        "SCRATCH TO REVEAL",
        rect.width / 2,
        rect.height / 2,
      );
      context.restore();
    };

    renderCover();
    const resizeObserver = new ResizeObserver(renderCover);
    resizeObserver.observe(shell);
    return () => {
      resizeObserver.disconnect();
      if (drawRafRef.current !== null) {
        window.cancelAnimationFrame(drawRafRef.current);
      }
    };
  }, [reducedMotion]);

  const getPoint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const sampleClearedArea = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    const now = performance.now();
    if (now - lastSampleRef.current < 280) return;
    lastSampleRef.current = now;

    const sampleCanvas =
      sampleCanvasRef.current ?? document.createElement("canvas");
    sampleCanvasRef.current = sampleCanvas;
    sampleCanvas.width = 48;
    sampleCanvas.height = 64;
    const sampleContext = sampleCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!sampleContext) return;
    sampleContext.clearRect(0, 0, 48, 64);
    sampleContext.drawImage(canvas, 0, 0, 48, 64);
    const pixels = sampleContext.getImageData(0, 0, 48, 64).data;
    let checked = 0;
    let clear = 0;
    for (let index = 3; index < pixels.length; index += 4) {
      checked += 1;
      if (pixels[index] < 40) clear += 1;
    }
    if (checked > 0 && clear / checked > 0.48) {
      reveal();
    }
  }, [reveal]);

  const scratch = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || revealed) return;
    const point = getPoint(event);
    if (!point) return;
    pointRef.current = point;
    if (drawRafRef.current !== null) return;

    drawRafRef.current = window.requestAnimationFrame(() => {
      drawRafRef.current = null;
      const canvas = canvasRef.current;
      const nextPoint = pointRef.current;
      if (!canvas || !nextPoint) return;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      const dpr = canvas.width / canvas.getBoundingClientRect().width;
      const previousPoint = lastPointRef.current ?? nextPoint;
      context.save();
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.lineWidth = 56;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.moveTo(previousPoint.x, previousPoint.y);
      context.lineTo(nextPoint.x, nextPoint.y);
      context.stroke();
      context.restore();
      lastPointRef.current = nextPoint;
      sampleClearedArea();
    });
  };

  return (
    <section
      id={PREVIEW_SECTION_IDS.blessing}
      className="cinema-paper-section cinema-blessing"
    >
      <div className="cinema-section-heading">
        <h2>Scratch to reveal</h2>
        <p>Gently uncover a message from the family.</p>
      </div>

      <div className="cinema-scratch-stage">
        <img
          src={royalCinemaAssets.decor.diya}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="cinema-scratch-stage__diya cinema-scratch-stage__diya--left"
        />
        <div
          ref={shellRef}
          className="cinema-scratch"
          data-revealed={revealed || reducedMotion || undefined}
        >
          <div className="cinema-scratch__message" aria-live="polite">
            <Sparkles aria-hidden="true" />
            <blockquote>{blessing.message}</blockquote>
            {blessing.from && <p>{blessing.from}</p>}
          </div>
          {!reducedMotion && (
            <canvas
              ref={canvasRef}
              className="cinema-scratch__canvas"
              aria-hidden="true"
              onPointerDown={(event) => {
                drawingRef.current = true;
                lastPointRef.current = getPoint(event);
                event.currentTarget.setPointerCapture(event.pointerId);
                scratch(event);
              }}
              onPointerMove={scratch}
              onPointerUp={(event) => {
                drawingRef.current = false;
                lastPointRef.current = null;
                event.currentTarget.releasePointerCapture(event.pointerId);
                sampleClearedArea();
              }}
              onPointerCancel={() => {
                drawingRef.current = false;
                lastPointRef.current = null;
              }}
            />
          )}
        </div>
        <img
          src={royalCinemaAssets.decor.diya}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="cinema-scratch-stage__diya cinema-scratch-stage__diya--right"
        />
      </div>

      {!revealed && !reducedMotion && (
        <button type="button" onClick={reveal} className="cinema-button">
          Reveal without scratching
        </button>
      )}
    </section>
  );
}
