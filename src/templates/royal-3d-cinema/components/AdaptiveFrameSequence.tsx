"use client";
/* eslint-disable @next/next/no-img-element -- sequence posters must stay byte-identical to the validated frame assets */

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FastForward } from "lucide-react";
import type { FrameSequenceManifest } from "../assets";
import { useReducedMotion } from "../hooks/useReducedMotion";

type ScrollRoot = Window | HTMLElement;
type DrawableImage = ImageBitmap | HTMLImageElement;

interface CachedFrame {
  image: DrawableImage;
  index: number;
  tier: "low" | "high";
  lastUsed: number;
}

interface AdaptiveFrameSequenceProps {
  manifest: FrameSequenceManifest;
  ariaLabel: string;
  id?: string;
  children: ReactNode;
  isPreview?: boolean;
  priority?: boolean;
  screens?: number;
  mobileScreens?: number;
  className?: string;
  mediaClassName?: string;
}

interface ExtendedNavigator extends Navigator {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
  deviceMemory?: number;
}

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function getScrollRoot(element: HTMLElement): ScrollRoot {
  let parent = element.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    if (
      /(auto|scroll|overlay)/.test(style.overflowY) &&
      parent.scrollHeight > parent.clientHeight
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window;
}

function getViewport(root: ScrollRoot) {
  if (root === window) {
    return { top: 0, height: window.innerHeight };
  }
  const element = root as HTMLElement;
  const rect = element.getBoundingClientRect();
  return { top: rect.top, height: element.clientHeight };
}

function shouldUseHighTier(isPreview: boolean) {
  const navigatorWithHints = navigator as ExtendedNavigator;
  const connection = navigatorWithHints.connection;
  return (
    !isPreview &&
    window.matchMedia("(min-width: 1024px)").matches &&
    !window.matchMedia("(pointer: coarse)").matches &&
    !connection?.saveData &&
    !["slow-2g", "2g"].includes(connection?.effectiveType ?? "") &&
    (navigatorWithHints.deviceMemory ?? 8) >= 4
  );
}

function releaseImage(image: DrawableImage) {
  if ("close" in image && typeof image.close === "function") {
    image.close();
  } else if (image instanceof HTMLImageElement) {
    image.src = TRANSPARENT_PIXEL;
  }
}

async function decodeImage(url: string, signal: AbortSignal) {
  const response = await fetch(url, {
    cache: "force-cache",
    signal,
  });
  if (!response.ok) {
    throw new Error(`Frame request failed with ${response.status}`);
  }
  const blob = await response.blob();

  if ("createImageBitmap" in window) {
    return window.createImageBitmap(blob);
  }

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(blob);
    image.decoding = "async";
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Frame decode failed"));
    };
    signal.addEventListener(
      "abort",
      () => {
        URL.revokeObjectURL(objectUrl);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
    image.src = objectUrl;
  });
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: DrawableImage,
  width: number,
  height: number,
  alpha = 1,
) {
  const sourceWidth = image.width;
  const sourceHeight = image.height;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  context.save();
  context.globalAlpha = alpha;
  context.drawImage(
    image,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
  context.restore();
}

export function AdaptiveFrameSequence({
  manifest,
  ariaLabel,
  id,
  children,
  isPreview = false,
  priority = false,
  screens = 4.4,
  mobileScreens,
  className = "",
  mediaClassName = "",
}: AdaptiveFrameSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<ScrollRoot | null>(null);
  const cacheRef = useRef(new Map<string, CachedFrame>());
  const pendingRef = useRef(new Map<string, Promise<void>>());
  const abortControllersRef = useRef(new Set<AbortController>());
  const failedRef = useRef(new Set<string>());
  const progressRef = useRef(0);
  const frameRef = useRef(1);
  const directionRef = useRef(1);
  const activeRef = useRef(false);
  const visibleRef = useRef(true);
  const viewportRef = useRef({ width: 0, height: 0, dpr: 1 });
  const drawRafRef = useRef<number | null>(null);
  const loadRafRef = useRef<number | null>(null);
  const highTimerRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const [sequenceFailed, setSequenceFailed] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [resolvedScreens, setResolvedScreens] = useState(screens);

  const evictCache = useCallback((limit: number) => {
    const cache = cacheRef.current;
    if (cache.size <= limit) return;
    const protectedIndexes = new Set([
      frameRef.current - 1,
      frameRef.current,
      frameRef.current + 1,
    ]);
    const candidates = [...cache.entries()]
      .filter(([, frame]) => !protectedIndexes.has(frame.index))
      .sort((a, b) => a[1].lastUsed - b[1].lastUsed);

    for (const [key, frame] of candidates) {
      if (cache.size <= limit) break;
      releaseImage(frame.image);
      cache.delete(key);
    }
  }, []);

  const requestDraw = useCallback(() => {
    if (
      drawRafRef.current !== null ||
      !activeRef.current ||
      !visibleRef.current
    ) {
      return;
    }

    drawRafRef.current = window.requestAnimationFrame(() => {
      drawRafRef.current = null;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d", { alpha: true });
      if (!context) return;

      const { width, height, dpr } = viewportRef.current;
      if (!width || !height) return;

      const targetWidth = Math.round(width * dpr);
      const targetHeight = Math.round(height * dpr);
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      const exact = progressRef.current * (manifest.count - 1) + 1;
      const lower = Math.floor(exact);
      const upper = Math.min(manifest.count, Math.ceil(exact));
      const blend = exact - lower;
      const cache = cacheRef.current;

      const findFrame = (index: number) =>
        cache.get(`high:${index}`) ??
        cache.get(`low:${index}`) ??
        [...cache.values()]
          .filter((entry) => entry.tier === "low")
          .sort(
            (a, b) =>
              Math.abs(a.index - index) - Math.abs(b.index - index),
          )[0];

      const first = findFrame(lower);
      const second = upper === lower ? undefined : findFrame(upper);
      if (first) {
        first.lastUsed = performance.now();
        drawCover(context, first.image, width, height);
      }
      if (second && second.index !== first?.index) {
        second.lastUsed = performance.now();
        drawCover(context, second.image, width, height, blend);
      }
    });
  }, [manifest.count]);

  const loadFrame = useCallback(
    (
      tier: "low" | "high",
      index: number,
      onLoaded?: () => void,
    ): Promise<void> => {
      const clampedIndex = Math.max(1, Math.min(manifest.count, index));
      const key = `${tier}:${clampedIndex}`;
      const cache = cacheRef.current;
      if (cache.has(key) || failedRef.current.has(key)) {
        return Promise.resolve();
      }
      const pending = pendingRef.current.get(key);
      if (pending) return pending;

      const source =
        tier === "high" ? manifest.high?.(clampedIndex) : manifest.low(clampedIndex);
      if (!source) return Promise.resolve();

      const controller = new AbortController();
      abortControllersRef.current.add(controller);
      const request = decodeImage(source, controller.signal)
        .then((image) => {
          cache.set(key, {
            image,
            index: clampedIndex,
            tier,
            lastUsed: performance.now(),
          });
          evictCache(
            window.matchMedia("(min-width: 768px)").matches ? 30 : 18,
          );
          onLoaded?.();
          requestDraw();
        })
        .catch((error: unknown) => {
          if (
            !(error instanceof DOMException && error.name === "AbortError")
          ) {
            failedRef.current.add(key);
            const lowFailureCount = [...failedRef.current].filter((failedKey) =>
              failedKey.startsWith("low:"),
            ).length;
            if (tier === "low" && lowFailureCount >= 8) {
              setSequenceFailed(true);
            }
          }
        })
        .finally(() => {
          pendingRef.current.delete(key);
          abortControllersRef.current.delete(controller);
        });

      pendingRef.current.set(key, request);
      return request;
    },
    [evictCache, manifest, requestDraw],
  );

  const loadWindow = useCallback(() => {
    if (!activeRef.current || !visibleRef.current || reducedMotion) return;
    const current = frameRef.current;
    const direction = directionRef.current;
    const indexes: number[] = [current];
    for (
      let distance = 1;
      indexes.length < 12 && distance < manifest.count;
      distance += 1
    ) {
      const ahead = current + direction * distance;
      const behind = current - direction * distance;
      if (ahead >= 1 && ahead <= manifest.count) indexes.push(ahead);
      if (
        indexes.length < 12 &&
        behind >= 1 &&
        behind <= manifest.count
      ) {
        indexes.push(behind);
      }
    }

    for (const index of indexes) {
      void loadFrame("low", index);
    }

    const desktop = window.matchMedia("(min-width: 768px)").matches;
    evictCache(desktop ? 30 : 18);

    if (
      manifest.high &&
      shouldUseHighTier(isPreview) &&
      progressRef.current > 0.01
    ) {
      if (highTimerRef.current !== null) {
        window.clearTimeout(highTimerRef.current);
      }
      highTimerRef.current = window.setTimeout(() => {
        void loadFrame("high", frameRef.current);
      }, 220);
    }
  }, [
    evictCache,
    isPreview,
    loadFrame,
    manifest.count,
    manifest.high,
    reducedMotion,
  ]);

  const updateProgress = useCallback(() => {
    loadRafRef.current = null;
    const section = sectionRef.current;
    if (!section || !activeRef.current) return;
    const root = rootRef.current;
    if (!root) return;
    const viewport = getViewport(root);
    const rect = section.getBoundingClientRect();
    const travel = Math.max(section.offsetHeight - viewport.height, 1);
    const nextProgress = clamp((viewport.top - rect.top) / travel);
    const nextFrame = Math.round(nextProgress * (manifest.count - 1)) + 1;
    directionRef.current = nextFrame >= frameRef.current ? 1 : -1;
    progressRef.current = nextProgress;
    frameRef.current = nextFrame;
    requestDraw();
    loadWindow();
  }, [loadWindow, manifest.count, requestDraw]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const root = getScrollRoot(section);
    rootRef.current = root;
    const abortControllers = abortControllersRef.current;
    const cache = cacheRef.current;
    const pending = pendingRef.current;

    const updateViewport = () => {
      const viewport = getViewport(root);
      const mediaRect = mediaRef.current?.getBoundingClientRect();
      const rootWidth =
        root === window
          ? window.innerWidth
          : (root as HTMLElement).clientWidth;
      const nextScreens =
        rootWidth <= 700 ? (mobileScreens ?? screens) : screens;
      setViewportHeight(viewport.height);
      setResolvedScreens(nextScreens);
      viewportRef.current = {
        width: mediaRect?.width || rootWidth,
        height: mediaRect?.height || viewport.height,
        dpr: Math.min(window.devicePixelRatio || 1, 1.75),
      };
      requestDraw();
      updateProgress();
    };

    const queueProgressUpdate = () => {
      if (loadRafRef.current === null) {
        loadRafRef.current = window.requestAnimationFrame(updateProgress);
      }
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          updateViewport();
          loadWindow();
        }
      },
      {
        root: root === window ? null : (root as HTMLElement),
        rootMargin: "75% 0px",
      },
    );
    intersectionObserver.observe(section);

    const resizeObserver =
      root !== window && "ResizeObserver" in window
        ? new ResizeObserver(updateViewport)
        : null;
    if (resizeObserver && root instanceof HTMLElement) {
      resizeObserver.observe(root);
    }

    const visibilityListener = () => {
      visibleRef.current = document.visibilityState === "visible";
      if (visibleRef.current) {
        queueProgressUpdate();
        loadWindow();
      }
    };

    root.addEventListener("scroll", queueProgressUpdate, { passive: true });
    window.addEventListener("resize", updateViewport, { passive: true });
    window.addEventListener("orientationchange", updateViewport, {
      passive: true,
    });
    document.addEventListener("visibilitychange", visibilityListener);
    updateViewport();

    return () => {
      intersectionObserver.disconnect();
      resizeObserver?.disconnect();
      root.removeEventListener("scroll", queueProgressUpdate);
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
      document.removeEventListener("visibilitychange", visibilityListener);
      if (drawRafRef.current !== null) {
        window.cancelAnimationFrame(drawRafRef.current);
      }
      if (loadRafRef.current !== null) {
        window.cancelAnimationFrame(loadRafRef.current);
      }
      if (highTimerRef.current !== null) {
        window.clearTimeout(highTimerRef.current);
      }
      for (const controller of abortControllers) {
        controller.abort();
      }
      for (const entry of cache.values()) {
        releaseImage(entry.image);
      }
      cache.clear();
      pending.clear();
    };
  }, [
    loadWindow,
    mobileScreens,
    reducedMotion,
    requestDraw,
    screens,
    updateProgress,
  ]);

  const skipAnimation = () => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const sectionStyle = {
    "--cinema-sequence-height": viewportHeight
      ? `${Math.round(viewportHeight * resolvedScreens)}px`
      : `${resolvedScreens * 100}vh`,
    "--cinema-viewport-height": viewportHeight
      ? `${Math.round(viewportHeight)}px`
      : "100svh",
  } as CSSProperties;

  if (reducedMotion) {
    return (
      <section
        ref={sectionRef}
        id={id}
        aria-label={ariaLabel}
        className={`cinema-sequence cinema-sequence--static ${className}`}
      >
        <div
          ref={mediaRef}
          className={`cinema-sequence__media ${mediaClassName}`}
        >
          <img
            src={manifest.poster}
            alt=""
            aria-hidden="true"
            className="cinema-sequence__poster"
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
          />
          <div className="cinema-sequence__shade" aria-hidden="true" />
        </div>
        <div className="cinema-sequence__content">{children}</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={ariaLabel}
      data-frame-sequence={manifest.count}
      data-sequence-failed={sequenceFailed || undefined}
      className={`cinema-sequence ${className}`}
      style={sectionStyle}
    >
      <div className="cinema-sequence__sticky">
        <div
          ref={mediaRef}
          className={`cinema-sequence__media ${mediaClassName}`}
        >
          <img
            src={manifest.poster}
            alt=""
            aria-hidden="true"
            className="cinema-sequence__poster"
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
          />
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="cinema-sequence__canvas"
          />
          <div className="cinema-sequence__shade" aria-hidden="true" />
        </div>
        <button
          type="button"
          onClick={skipAnimation}
          className="cinema-skip"
          aria-label={`Skip ${ariaLabel}`}
        >
          <FastForward aria-hidden="true" size={16} />
          <span>Skip animation</span>
        </button>
        <div className="cinema-sequence__content">{children}</div>
      </div>
    </section>
  );
}
