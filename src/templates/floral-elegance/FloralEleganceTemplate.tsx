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
import { resolveMusicPlayback } from "@/lib/default-music";
import { TemplateThemeProvider } from "../shared/theme/ThemeProvider";
import { floralTheme } from "./theme";
import { LeafShowerBackground } from "./components/LeafShowerBackground";

/**
 * Floral Elegance Template — Main Orchestrator
 *
 * Renders the full cinematic storytelling flow with custom botanical visuals
 * and the soft floral entrance reveal.
 */
export function FloralEleganceTemplate({ data, isPreview, suppressMusicPlayer }: TemplateProps) {
  const sections = withEssentialSections(data.sections);
  const music = resolveMusicPlayback(data.music);

  const primaryColor = data.theme?.primaryColor || floralTheme.colors.primary;
  const secondaryColor = data.theme?.secondaryColor || floralTheme.colors.secondary;

  return (
    <TemplateThemeProvider
      defaultTheme={floralTheme}
      theme={data.theme}
      typographyScale={data.typography?.scale ?? "default"}
      className="relative min-h-screen bg-[var(--template-background)] text-[var(--template-text)] selection:bg-[var(--template-primary)]/20 overflow-x-hidden"
    >
      {/* Dynamic font loading for Cormorant Garamond */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap" rel="stylesheet" />

      <InvitationOpener
        variant="floral-reveal"
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        slug={data.slug}
        sealType="wax-seal"
        monogram={data.couple ? data.couple.bride.name[0] : "❦"}
        isPreviewMode={isPreview}
      >

        <LeafShowerBackground embedded={isPreview} />
        <div className="relative z-10">

          {/* 1. Hero — Couple Names & Wedding Date */}
          {sections.showHero !== false && (
            <HeroSection
              couple={data.couple}
              countdown={data.countdown}
              hero={data.hero}
              weddingHashtag={data.weddingHashtag}
            />
          )}

          {/* 2. Couple — Bride & Groom Details */}
          {sections.showCouple !== false && (
            <CoupleSection couple={data.couple} />
          )}

          {/* 3. Countdown Timer */}
          {sections.showCountdown !== false && (
            <CountdownSection countdown={data.countdown} />
          )}

          {/* 4. Blessing Message */}
          {sections.showBlessing !== false && (
            <BlessingSection blessing={data.blessing} />
          )}

          {/* 5. Events List */}
          {sections.showEvents !== false && (
            <EventsSection events={data.events} />
          )}

          {/* 6. Love Story Timeline */}
          {sections.showStory !== false && (
            <StorySection story={data.story} />
          )}

          {/* 7. Photo Gallery */}
          {sections.showGallery !== false && (
            <GallerySection gallery={data.gallery} />
          )}

          {/* 8. Venue Address & Maps */}
          {sections.showVenue !== false && (
            <VenueSection venue={data.venue} />
          )}

          {/* 9. RSVP Form / Button */}
          {sections.showRSVP !== false && (
            <RSVPSection rsvp={data.rsvp} />
          )}

          {/* 10. Thank You Closure */}
          {sections.showThankYou !== false && (
            <ThankYouSection thankYou={data.thankYou} couple={data.couple} />
          )}
        </div>
      </InvitationOpener>

      {/* Floating Audio Playback Controls */}
      <MusicPlayer
        music={music}
        embedded={isPreview}
        invitationId={data.id}
        suppressed={suppressMusicPlayer}
      />
    </TemplateThemeProvider>
  );
}
export default FloralEleganceTemplate;
