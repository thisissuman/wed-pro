const MEDIA_ROOT = "/media/royal-3d-cinema/v1";

export interface FrameSequenceManifest {
  count: number;
  low: (frame: number) => string;
  high?: (frame: number) => string;
  poster: string;
}

function numberedFrame(
  directory: string,
  prefix: "f" | "s",
  frame: number,
) {
  return `${MEDIA_ROOT}/${directory}/${prefix}_${String(frame).padStart(3, "0")}.webp`;
}

export const royalCinemaAssets = {
  root: MEDIA_ROOT,
  hero: {
    count: 181,
    low: (frame: number) => numberedFrame("frames/low", "f", frame),
    high: (frame: number) => numberedFrame("frames/high", "f", frame),
    poster: numberedFrame("frames/low", "f", 1),
  } satisfies FrameSequenceManifest,
  sacred: {
    count: 121,
    low: (frame: number) => numberedFrame("sacred", "s", frame),
    poster: `${MEDIA_ROOT}/stills/sanctum_start.webp`,
  } satisfies FrameSequenceManifest,
  decor: {
    arch: `${MEDIA_ROOT}/decor/arch.webp`,
    diya: `${MEDIA_ROOT}/decor/diya.webp`,
    elephant: `${MEDIA_ROOT}/decor/elephant.webp`,
    lotus: `${MEDIA_ROOT}/decor/lotus.webp`,
    toran: `${MEDIA_ROOT}/decor/toran.webp`,
    umbrella: `${MEDIA_ROOT}/decor/umbrella.webp`,
  },
  stills: {
    couple: `${MEDIA_ROOT}/stills/couple.webp`,
    ganesha: `${MEDIA_ROOT}/stills/ganesha.webp`,
    map: `${MEDIA_ROOT}/stills/map.webp`,
    sacredStart: `${MEDIA_ROOT}/stills/sanctum_start.webp`,
    scratchReveal: `${MEDIA_ROOT}/stills/scratch_reveal.webp`,
    varmala: `${MEDIA_ROOT}/stills/varmala.webp`,
    venue: `${MEDIA_ROOT}/stills/venue_art.webp`,
  },
  films: [
    {
      src: `${MEDIA_ROOT}/films/film1.mp4`,
      poster: `${MEDIA_ROOT}/posters/film1_poster.webp`,
    },
    {
      src: `${MEDIA_ROOT}/films/film2.mp4`,
      poster: `${MEDIA_ROOT}/posters/film2_poster.webp`,
    },
    {
      src: `${MEDIA_ROOT}/films/film3.mp4`,
      poster: `${MEDIA_ROOT}/posters/film3_poster.webp`,
    },
  ] as const,
} as const;

