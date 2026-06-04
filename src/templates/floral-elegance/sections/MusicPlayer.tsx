"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Pause, Play } from "lucide-react";
import type { MusicPlayerContract } from "@/templates/shared/sections/types";

function isLikelyAudioUrl(url: string): boolean {
  try {
    const pathname = new URL(url, "https://wed-pro.local").pathname.toLowerCase();
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
  invitationId?: string;
  suppressed?: boolean;
}

function MusicPlayerInner({
  music,
  embedded = false,
  suppressed = false,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const syncPlayingState = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(!audio.paused && !audio.ended && !audio.muted);
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
    const onVolumeChange = () => syncPlayingState();

    audio.addEventListener("play", onPlay);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("volumechange", onVolumeChange);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("volumechange", onVolumeChange);
    };
  }, [music.url, syncPlayingState]);

  useEffect(() => {
    if (!music.url || loadFailed || suppressed) return;

    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;
    let cleanupInteraction: (() => void) | null = null;

    const armUnmuteOnInteraction = () => {
      const unmute = () => {
        const a = audioRef.current;
        if (!a) return;
        a.muted = false;
        if (a.paused) {
          void a.play().catch(() => {});
        }
        cleanupInteraction?.();
        cleanupInteraction = null;
      };
      const opts: AddEventListenerOptions = { once: true, capture: true };
      window.addEventListener("pointerdown", unmute, opts);
      window.addEventListener("keydown", unmute, opts);
      window.addEventListener("touchstart", unmute, opts);
      window.addEventListener("scroll", unmute, { ...opts, passive: true });
      cleanupInteraction = () => {
        window.removeEventListener("pointerdown", unmute, opts);
        window.removeEventListener("keydown", unmute, opts);
        window.removeEventListener("touchstart", unmute, opts);
        window.removeEventListener("scroll", unmute, opts);
      };
    };

    const tryAutoplay = async () => {
      if (embedded) {
        try {
          audio.muted = true;
          await audio.play();
          if (!cancelled) syncPlayingState();
        } catch {
          if (!cancelled) setIsPlaying(false);
        }
        return;
      }

      try {
        audio.muted = false;
        await audio.play();
        if (!cancelled) syncPlayingState();
      } catch {
        if (cancelled) return;
        try {
          audio.muted = true;
          await audio.play();
          if (cancelled) return;
          syncPlayingState();
          armUnmuteOnInteraction();
        } catch {
          if (!cancelled) setIsPlaying(false);
        }
      }
    };

    void tryAutoplay();

    return () => {
      cancelled = true;
      cleanupInteraction?.();
    };
  }, [embedded, music.url, loadFailed, suppressed, syncPlayingState]);

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
        className={`${positionClass} flex h-12 w-12 items-center justify-center rounded-full border border-[var(--template-primary)]/20 bg-[var(--template-surface)]/85 text-[var(--template-primary)] shadow-[0_8px_24px_rgba(0,0,0,0.15)] backdrop-blur-md transition hover:border-[var(--template-primary)]/45 hover:bg-[var(--template-surface)] active:scale-95 cursor-pointer`}
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
