"use client";
/* eslint-disable @next/next/no-img-element -- film posters are validated local media and must not be transformed */

import { useEffect, useRef, useState } from "react";
import { Film } from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface CinematicFilmBandProps {
  src: string;
  poster: string;
  title: string;
  eyebrow?: string;
  portrait?: boolean;
}

export function CinematicFilmBand({
  src,
  poster,
  title,
  eyebrow = "A glimpse of forever",
  portrait = false,
}: CinematicFilmBandProps) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const nearObserver = new IntersectionObserver(
      ([entry]) => setNearViewport(entry.isIntersecting),
      { rootMargin: "600px 0px" },
    );
    const playbackObserver = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.42 },
    );
    nearObserver.observe(element);
    playbackObserver.observe(element);
    return () => {
      nearObserver.disconnect();
      playbackObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    if (visible && document.visibilityState === "visible") {
      void video.play().catch(() => {
        // The poster remains visible if inline muted playback is unavailable.
      });
    } else {
      video.pause();
    }
  }, [reducedMotion, visible]);

  useEffect(() => {
    const onVisibility = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.visibilityState === "hidden") {
        video.pause();
      } else if (visible && !reducedMotion) {
        void video.play().catch(() => undefined);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, [reducedMotion, visible]);

  return (
    <section
      ref={containerRef}
      className={`cinema-film-band ${portrait ? "cinema-film-band--portrait" : ""}`}
      aria-label={title}
    >
      <div className="cinema-film-band__media">
        {nearViewport && !reducedMotion ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={poster}
            aria-label={title}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <img src={poster} alt="" aria-hidden="true" loading="lazy" />
        )}
        <div className="cinema-film-band__shade" aria-hidden="true" />
        <div className="cinema-film-band__caption">
          <Film aria-hidden="true" size={18} />
          <p>{eyebrow}</p>
          <h2>{title}</h2>
        </div>
      </div>
    </section>
  );
}
