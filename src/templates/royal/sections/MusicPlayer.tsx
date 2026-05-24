"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play } from "lucide-react";
import type { MusicData } from "@/types/wedding.types";

interface MusicPlayerProps {
  music: MusicData;
}

function isLikelyAudioUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return /\.(mp3|wav|ogg|m4a|aac|flac|webm)(\?|$)/i.test(pathname) || pathname.includes("/video/upload/");
  } catch {
    return false;
  }
}

/**
 * Royal Template — Music Player
 *
 * Floating tap-to-play audio control. Optional autoplay is attempted muted
 * (per browser policies); user can unmute by tapping the play button.
 */
export function MusicPlayer({ music }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!music.url || !music.autoplay || loadFailed) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    void audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  }, [music.autoplay, music.url, loadFailed]);

  if (!music.url || loadFailed || !isLikelyAudioUrl(music.url)) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.muted = false;
      void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio
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
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-champagne-gold/30 bg-charcoal-black/80 text-champagne-gold shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:border-champagne-gold/60 hover:bg-charcoal-black/90 active:scale-95"
      >
        {isPlaying ? (
          <Pause size={18} />
        ) : music.autoplay ? (
          <Music2 size={18} />
        ) : (
          <Play size={18} />
        )}
      </button>
    </>
  );
}
