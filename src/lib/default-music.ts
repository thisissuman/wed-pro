import type { MusicData } from "@/types/wedding.types";

/** Bundled default when the couple has not uploaded their own track. */
export const DEFAULT_WEDDING_MUSIC_URL = "/media/default-pehla-nasha-piano.mp3";
export const DEFAULT_WEDDING_MUSIC_TITLE = "Pehla Nasha — Piano (Intro)";

export function resolveMusicPlayback(music: MusicData): MusicData {
  const customUrl = music.url?.trim();
  if (customUrl) {
    return {
      ...music,
      url: customUrl,
      title: music.title?.trim() || undefined,
    };
  }

  return {
    ...music,
    url: DEFAULT_WEDDING_MUSIC_URL,
    title: music.title?.trim() || DEFAULT_WEDDING_MUSIC_TITLE,
    // Default fallback track should always start automatically (muted by player logic).
    autoplay: true,
  };
}
