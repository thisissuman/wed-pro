"use client";

import { withEssentialSections } from "@/lib/invitations";
import type { TemplateProps } from "@/templates/types";
import { HeroSection } from "./sections/HeroSection";
import { CoupleSection } from "./sections/CoupleSection";
import { CountdownSection } from "./sections/CountdownSection";
import { BlessingSection } from "./sections/BlessingSection";
import { EventsSection } from "./sections/EventsSection";
import { StorySection } from "./sections/StorySection";
import { GallerySection } from "./sections/GallerySection";
import { VenueSection } from "./sections/VenueSection";
import { RSVPSection } from "./sections/RSVPSection";
import { ThankYouSection } from "./sections/ThankYouSection";
import { MusicPlayer } from "./sections/MusicPlayer";
import { InvitationOpener } from "@/components/invitation-opener";
import { LoveShowerBackground } from "./components/LoveShowerBackground";
import { SparkleOverlay } from "./components/SparkleOverlay";
import { resolveMusicPlayback } from "@/lib/default-music";
import { TemplateThemeProvider } from "../shared/theme/ThemeProvider";
import { royalTheme } from "./theme";

/**
 * Royal Template — Main Orchestrator
 *
 * Composes all sections in the cinematic storytelling flow:
 *   Hero → Couple → Countdown → Blessing → Events → Story → Gallery → Venue → RSVP → ThankYou
 *
 * This component is a pure presentation layer.
 * It receives WeddingData and passes the relevant slices to each section.
 * It contains ZERO business logic, auth logic, or database access.
 *
 * Sections are conditionally rendered based on SectionVisibility.
 */
export function RoyalTemplate({ data, isPreview, bypassOpener, suppressMusicPlayer }: TemplateProps) {
  const sections = withEssentialSections(data.sections);
  const music = resolveMusicPlayback(data.music);

  const primaryColor = data.theme?.primaryColor || royalTheme.colors.primary;
  const secondaryColor = data.theme?.secondaryColor || royalTheme.colors.secondary;

  return (
    <TemplateThemeProvider
      defaultTheme={royalTheme}
      theme={data.theme}
      typographyScale={data.typography?.scale ?? "default"}
      className="relative min-h-screen bg-[var(--template-background)] text-[var(--template-text)] selection:bg-champagne-gold/30 overflow-x-hidden"
    >
      <InvitationOpener
        variant="royal-door"
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        slug={data.slug}
        sealType="wax-seal"
        monogram="❦"
        isPreviewMode={isPreview}
        bypassOpener={bypassOpener}
      >
        <LoveShowerBackground embedded={isPreview} />
        <SparkleOverlay embedded={isPreview} />
        <div className="relative z-[2]">
        {/* 1. Hero — Emotional anchor with couple names and date */}
        {sections.showHero !== false && (
          <HeroSection
            couple={data.couple}
            countdown={data.countdown}
            hero={data.hero}
            weddingHashtag={data.weddingHashtag}
          />
        )}

        {/* 2. Couple — Bride & Groom reveal */}
        {sections.showCouple !== false && (
          <CoupleSection couple={data.couple} />
        )}

        {/* 3. Countdown — Live timer */}
        {sections.showCountdown !== false && (
          <CountdownSection countdown={data.countdown} />
        )}

        {/* 4. Blessing — Family message */}
        {sections.showBlessing !== false && (
          <BlessingSection blessing={data.blessing} />
        )}

        {/* 5. Events — Mehendi, Sangeet, Haldi, Wedding, Reception */}
        {sections.showEvents !== false && (
          <EventsSection events={data.events} />
        )}

        {/* 6. Story — Love timeline */}
        {sections.showStory !== false && (
          <StorySection story={data.story} />
        )}

        {/* 7. Gallery — Photo grid */}
        {sections.showGallery !== false && (
          <GallerySection gallery={data.gallery} />
        )}

        {/* 8. Venue — Location with map */}
        {sections.showVenue !== false && (
          <VenueSection venue={data.venue} />
        )}

        {/* 9. RSVP — Confirm attendance */}
        {sections.showRSVP !== false && (
          <RSVPSection rsvp={data.rsvp} />
        )}

        {/* 10. Thank You — Emotional closure */}
        {sections.showThankYou !== false && (
          <ThankYouSection thankYou={data.thankYou} couple={data.couple} />
        )}
        </div>
      </InvitationOpener>

      {/* Floating music player (tap-to-play) */}
      <MusicPlayer
        music={music}
        embedded={isPreview}
        invitationId={data.id}
        suppressed={suppressMusicPlayer}
      />
    </TemplateThemeProvider>
  );
}
