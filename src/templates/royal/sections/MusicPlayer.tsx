"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

function previewPlayKey(invitationId: string, url: string) {
  return `wed-pro-music-preview:${invitationId}:${url}`;
}

interface MusicPlayerProps extends MusicPlayerContract {
  embedded?: boolean;
  invitationId?: string;
  /** Hide and stop playback (e.g. during publish / share dialog). */
  suppressed?: boolean;
}

/**
 * Royal Template — Music Player
 *
 * Floating tap-to-play audio control. In editor preview, pins to the viewport
 * and attempts one muted play per new upload.
 */
function MusicPlayerInner({
  music,
  embedded = false,
  invitationId,
  suppressed = false,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const syncPlayingState = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(!audio.paused && !audio.ended);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!suppressed) return;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.muted = true;
    }
  }, [suppressed]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => syncPlayingState();
    const onPause = () => syncPlayingState();
    const onEnded = () => syncPlayingState();
    const onPlaying = () => syncPlayingState();

    audio.addEventListener("play", onPlay);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [music.url, syncPlayingState]);

  useEffect(() => {
    if (!music.url || loadFailed || suppressed) return;

    const audio = audioRef.current;
    if (!audio) return;

    if (embedded && invitationId) {
      const key = previewPlayKey(invitationId, music.url);
      if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(key)) {
        syncPlayingState();
        return;
      }
      audio.muted = true;
      void audio
        .play()
        .then(() => {
          sessionStorage.setItem(key, "1");
          syncPlayingState();
        })
        .catch(() => {
          setIsPlaying(false);
        });
      return;
    }

    if (music.autoplay) {
      audio.muted = true;
      void audio.play().then(syncPlayingState).catch(() => setIsPlaying(false));
    }
  }, [embedded, invitationId, music.autoplay, music.url, loadFailed, suppressed, syncPlayingState]);

  if (suppressed || !music.url || loadFailed || !isLikelyAudioUrl(music.url)) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused && audio.muted) {
      audio.muted = false;
      syncPlayingState();
      return;
    }

    if (audio.paused) {
      audio.muted = false;
      void audio
        .play()
        .then(syncPlayingState)
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      syncPlayingState();
    }
  };

  const positionClass = embedded
    ? "fixed bottom-[calc(var(--editor-bottom-bar-h,3.75rem)+1rem)] right-5 z-[60] md:bottom-5"
    : "fixed bottom-5 right-5 z-40";

  const player = (
    <>
      <audio
        key={music.url}
        ref={audioRef}
        src={music.url}
        loop
        preload="metadata"
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
        className={`${positionClass} flex h-12 w-12 items-center justify-center rounded-full border border-champagne-gold/30 bg-charcoal-black/80 text-champagne-gold shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:border-champagne-gold/60 hover:bg-charcoal-black/90 active:scale-95`}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
    </>
  );

  if (embedded && mounted) {
    return createPortal(player, document.body);
  }

  return player;
}

export const MusicPlayer = memo(MusicPlayerInner);
