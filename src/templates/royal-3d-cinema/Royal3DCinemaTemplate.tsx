"use client";
/* eslint-disable @next/next/no-img-element -- customer media and fixed cinematic frames must load without image transformation */

import { useRef } from "react";
import { isValidDisplayUrl } from "@/lib/media-url";
import { resolveMusicPlayback } from "@/lib/default-music";
import { withEssentialSections } from "@/lib/invitations";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
import { TemplateThemeProvider } from "@/templates/shared/theme/ThemeProvider";
import type { TemplateProps } from "@/templates/types";
import { royalCinemaAssets } from "./assets";
import { AdaptiveFrameSequence } from "./components/AdaptiveFrameSequence";
import {
  type CinemaMusicPlayerHandle,
  CinemaMusicPlayer,
} from "./components/CinemaMusicPlayer";
import { CinematicFilmBand } from "./components/CinematicFilmBand";
import {
  CinemaCountdown,
  CinemaCouple,
  CinemaEvents,
  CinemaFinale,
  CinemaGallery,
  CinemaRsvp,
  CinemaStory,
  CinemaVenue,
} from "./components/CinemaSections";
import { RoyalSealOpener } from "./components/RoyalSealOpener";
import { ScratchBlessing } from "./components/ScratchBlessing";
import { royalCinemaTheme } from "./theme";
import {
  formatWeddingDate,
  getCoupleInitials,
} from "./utils";
import "./royal-3d-cinema.css";

export function Royal3DCinemaTemplate({
  data,
  isPreview = false,
  bypassOpener = false,
  suppressMusicPlayer = false,
}: TemplateProps) {
  const sections = withEssentialSections(data.sections);
  const music = resolveMusicPlayback(data.music);
  const musicRef = useRef<CinemaMusicPlayerHandle>(null);
  const initials = getCoupleInitials(data.couple);
  const coupleNames = `${data.couple.groom.name} & ${data.couple.bride.name}`;
  const timezone = data.countdown.timezone || "Asia/Kolkata";
  const heroPhoto = isValidDisplayUrl(data.hero.backgroundMedia)
    ? data.hero.backgroundMedia?.trim()
    : null;

  return (
    <TemplateThemeProvider
      defaultTheme={royalCinemaTheme}
      theme={data.theme}
      typographyScale={data.typography?.scale ?? "default"}
      className="royal-cinema"
    >
      <RoyalSealOpener
        slug={data.slug}
        initials={initials}
        coupleNames={coupleNames}
        bypass={bypassOpener}
        onOpenFromGesture={() => musicRef.current?.playFromGesture()}
      />

      <main>
        {sections.showHero !== false && (
          <AdaptiveFrameSequence
            id={PREVIEW_SECTION_IDS.hero}
            manifest={royalCinemaAssets.hero}
            ariaLabel="Cinematic wedding introduction"
            isPreview={isPreview}
            priority
            screens={4.6}
            mobileScreens={3.35}
            className="cinema-hero"
          >
            <div className="cinema-hero__overlay">
              {heroPhoto && (
                <div className="cinema-hero__portrait">
                  <img
                    src={heroPhoto}
                    alt={`Portrait of ${coupleNames}`}
                  />
                </div>
              )}
              <p className="cinema-eyebrow">
                {data.hero.overlayText || "Save the Date"}
              </p>
              <p className="cinema-hero__monogram" aria-hidden="true">
                {initials}
              </p>
              <h1>
                <span>{data.couple.groom.name}</span>
                <small>&amp;</small>
                <span>{data.couple.bride.name}</span>
              </h1>
              {data.hero.subtitle && (
                <p className="cinema-hero__subtitle">{data.hero.subtitle}</p>
              )}
              <time className="cinema-hero__date">
                {formatWeddingDate(
                  data.couple.weddingDate || data.countdown.targetDate,
                  timezone,
                )}
              </time>
              {data.weddingHashtag && (
                <p className="cinema-hero__hashtag">{data.weddingHashtag}</p>
              )}
            </div>
          </AdaptiveFrameSequence>
        )}

        {sections.showCountdown !== false && (
          <CinemaCountdown countdown={data.countdown} />
        )}

        {sections.showCouple !== false && (
          <CinemaCouple couple={data.couple} />
        )}

        {sections.showEvents !== false && (
          <CinemaEvents events={data.events} />
        )}

        <CinematicFilmBand
          {...royalCinemaAssets.films[0]}
          title="Celebrations in Motion"
          eyebrow="The first chapter"
        />

        {sections.showBlessing !== false && (
          <ScratchBlessing blessing={data.blessing} />
        )}

        <AdaptiveFrameSequence
          manifest={royalCinemaAssets.sacred}
          ariaLabel="Sacred wedding rituals in motion"
          isPreview={isPreview}
          screens={3.4}
          mobileScreens={2.8}
          className="cinema-sacred"
          mediaClassName="cinema-sacred__media"
        >
          <div className="cinema-sacred__composition">
            <div className="cinema-sacred__stage" data-sacred-stage>
              <img
                src={royalCinemaAssets.decor.arch}
                alt=""
                aria-hidden="true"
                className="cinema-sacred__arch"
              />
              <img
                src={royalCinemaAssets.decor.elephant}
                alt=""
                aria-hidden="true"
                className="cinema-sacred__prop cinema-sacred__prop--left"
              />
              <img
                src={royalCinemaAssets.decor.elephant}
                alt=""
                aria-hidden="true"
                className="cinema-sacred__prop cinema-sacred__prop--right"
              />
            </div>
            <p className="cinema-sacred__caption">
              The sacred rituals unfold
            </p>
          </div>
        </AdaptiveFrameSequence>

        {sections.showStory !== false && <CinemaStory story={data.story} />}

        {sections.showGallery !== false && (
          <CinemaGallery gallery={data.gallery} />
        )}

        {sections.showVenue !== false && <CinemaVenue venue={data.venue} />}

        {sections.showRSVP !== false && <CinemaRsvp rsvp={data.rsvp} />}

        <CinematicFilmBand
          {...royalCinemaAssets.films[2]}
          title="And So the Journey Begins"
          eyebrow="The final chapter"
          portrait
        />

        {sections.showThankYou !== false && (
          <CinemaFinale
            thankYou={data.thankYou}
            couple={data.couple}
            hashtag={data.weddingHashtag}
          />
        )}
      </main>

      <CinemaMusicPlayer
        ref={musicRef}
        music={music}
        suppressed={bypassOpener || suppressMusicPlayer}
      />
    </TemplateThemeProvider>
  );
}
