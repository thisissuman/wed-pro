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
export function RoyalTemplate({ data, isPreview }: TemplateProps) {
  const sections = withEssentialSections(data.sections);

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-champagne-gold/30 overflow-x-hidden">
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
        <RSVPSection rsvp={data.rsvp} slug={data.slug} isPreview={isPreview} />
      )}

      {/* 10. Thank You — Emotional closure */}
      {sections.showThankYou !== false && (
        <ThankYouSection thankYou={data.thankYou} couple={data.couple} />
      )}

      {/* Floating music player (tap-to-play) */}
      <MusicPlayer music={data.music} />
    </div>
  );
}
