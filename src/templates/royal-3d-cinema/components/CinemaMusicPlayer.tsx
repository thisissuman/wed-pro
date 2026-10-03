"use client";

import {
  useCallback,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Music2, Pause, Play } from "lucide-react";
import type { MusicData } from "@/types/wedding.types";

export interface CinemaMusicPlayerHandle {
  playFromGesture: () => void;
}

interface CinemaMusicPlayerProps {
  music: MusicData;
  suppressed?: boolean;
}

function isAllowedAudioSource(source: string | undefined) {
  const value = source?.trim();
  if (!value) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export const CinemaMusicPlayer = forwardRef<
  CinemaMusicPlayerHandle,
  CinemaMusicPlayerProps
>(function CinemaMusicPlayer({ music, suppressed = false }, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeWhenVisibleRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const source = isAllowedAudioSource(music.url) ? music.url?.trim() : undefined;

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || suppressed || !source) return;
    audio.volume = 0.55;
    audio.muted = false;
    void audio.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, [source, suppressed]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      playFromGesture: play,
    }),
    [play],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    setPlaying(false);
  }, [source]);

  useEffect(() => {
    if (suppressed) pause();
  }, [pause, suppressed]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.visibilityState === "hidden") {
        resumeWhenVisibleRef.current = !audio.paused;
        audio.pause();
        setPlaying(false);
      } else if (resumeWhenVisibleRef.current) {
        resumeWhenVisibleRef.current = false;
        play();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [play]);

  if (suppressed || !source) return null;

  return (
    <div className="cinema-music">
      <audio
        ref={audioRef}
        src={source}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="cinema-music__meta" aria-hidden="true">
        <Music2 size={14} />
        <span>{music.title || "Wedding music"}</span>
      </div>
      <button
        type="button"
        className="cinema-music__button"
        onClick={playing ? pause : play}
        aria-label={playing ? "Pause wedding music" : "Play wedding music"}
        aria-pressed={playing}
      >
        {playing ? (
          <Pause aria-hidden="true" size={20} />
        ) : (
          <Play aria-hidden="true" size={20} />
        )}
      </button>
    </div>
  );
});
