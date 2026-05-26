"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { MusicPlayerContract } from "@/templates/shared/sections/types";

function isLikelyAudioUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return (
      /\.(mp3|wav|ogg|m4a|aac|flac|webm)(\?|$)/i.test(pathname) ||
      pathname.includes("/video/upload/") ||
      pathname.includes("/raw/upload/")
    );
  } catch {
    return false;
  }
}

interface MusicPlayerProps extends MusicPlayerContract {
  embedded?: boolean;
}

/**
 * Royal Template — Music Player
 *
 * Floating tap-to-play audio control. Optional autoplay is attempted muted
 * (per browser policies); user can unmute by tapping the play button.
 */
function MusicPlayerInner({ music, embedded = false }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [music.url]);

  useEffect(() => {
    if (!music.url || !music.autoplay || loadFailed) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    void audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, [music.autoplay, music.url, loadFailed]);

  if (!music.url || loadFailed || !isLikelyAudioUrl(music.url)) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.muted = false;
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  const positionClass = embedded
    ? "absolute bottom-5 right-5"
    : "fixed bottom-5 right-5";

  return (
    <>
      <audio
        key={music.url}
        ref={audioRef}
        src={music.url}
        loop
        preload="none"
        playsInline
        onError={() => {
          setLoadFailed(true);
          setIsPlaying(false);
        }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className={`${positionClass} z-40 flex h-12 w-12 items-center justify-center rounded-full border border-champagne-gold/30 bg-charcoal-black/80 text-champagne-gold shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:border-champagne-gold/60 hover:bg-charcoal-black/90 active:scale-95 md:backdrop-blur-md`}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
    </>
  );
}

export const MusicPlayer = memo(MusicPlayerInner);
