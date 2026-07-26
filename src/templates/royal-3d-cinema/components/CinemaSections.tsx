"use client";
/* eslint-disable @next/next/no-img-element -- arbitrary validated customer URLs and editorial crops cannot use a fixed Next image host list */

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  ExternalLink,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Quote,
  Shirt,
} from "lucide-react";
import { isValidDisplayUrl } from "@/lib/media-url";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";
import type {
  CountdownData,
  CoupleData,
  GalleryData,
  PersonData,
  RSVPData,
  StoryData,
  ThankYouData,
  VenueData,
  WeddingEvent,
} from "@/types/wedding.types";
import { royalCinemaAssets } from "../assets";
import {
  formatWeddingDate,
  getStructuredParentLine,
  safeExternalUrl,
} from "../utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="cinema-section-heading">
      {eyebrow && <p className="cinema-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const timestamp = new Date(targetDate).getTime();
  const difference = Number.isFinite(timestamp)
    ? Math.max(0, timestamp - Date.now())
    : 0;
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    complete: difference === 0,
  };
}

export function CinemaCountdown({
  countdown,
}: {
  countdown: CountdownData;
}) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTime(getTimeLeft(countdown.targetDate));
    const mountTimer = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(mountTimer);
      window.clearInterval(interval);
    };
  }, [countdown.targetDate]);

  const currentTime = time ?? {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    complete: false,
  };

  const units = [
    ["Days", currentTime.days],
    ["Hours", currentTime.hours],
    ["Minutes", currentTime.minutes],
    ["Seconds", currentTime.seconds],
  ] as const;

  return (
    <section
      id={PREVIEW_SECTION_IDS.countdown}
      className="cinema-countdown cinema-paper-section"
    >
      <SectionHeading
        title={countdown.label || "Counting Down to Forever"}
        description={formatWeddingDate(
          countdown.targetDate,
          countdown.timezone,
          { weekday: "long", day: "numeric", month: "long", year: "numeric" },
        )}
      />
      <p className="sr-only">
        {currentTime.complete
          ? "The wedding celebration has begun."
          : `Wedding countdown: ${currentTime.days} days, ${currentTime.hours} hours and ${currentTime.minutes} minutes.`}
      </p>
      <div className="cinema-countdown__grid" aria-hidden="true">
        {units.map(([label, value]) => (
          <div key={label} className="cinema-countdown__unit">
            <span className="cinema-countdown__number">
              {time ? String(value).padStart(2, "0") : "--"}
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>
      {currentTime.complete && (
        <p className="cinema-countdown__complete">The celebration has begun</p>
      )}
    </section>
  );
}

interface PersonCardProps {
  person: PersonData;
  side: "bride" | "groom";
  parentLine?: string;
  grandparents?: string;
  showGrandparents: boolean;
}

function PersonCard({
  person,
  side,
  parentLine,
  grandparents,
  showGrandparents,
}: PersonCardProps) {
  const photo = isValidDisplayUrl(person.photo) ? person.photo?.trim() : null;
  const initial = person.name.trim().charAt(0).toUpperCase() || "V";

  return (
    <article className="cinema-person-card">
      <div className="cinema-person-card__portrait">
        {photo ? (
          <img
            src={photo}
            alt={`Portrait of ${person.name}`}
            loading="lazy"
          />
        ) : (
          <div
            className="cinema-person-card__fallback"
            aria-label={`No portrait provided for ${person.name}`}
          >
            <img src={royalCinemaAssets.decor.arch} alt="" aria-hidden="true" />
            <span>{initial}</span>
          </div>
        )}
      </div>
      {person.heroText && (
        <p className="cinema-person-card__role">{person.heroText}</p>
      )}
      <h3>
        {person.title && <small>{person.title}</small>}
        {person.name}
      </h3>
      {parentLine && <p className="cinema-person-card__parents">{parentLine}</p>}
      {showGrandparents && grandparents && (
        <p className="cinema-person-card__grandparents">
          {side === "bride" ? "Granddaughter" : "Grandson"} of {grandparents}
        </p>
      )}
      {person.bio && <p className="cinema-person-card__bio">{person.bio}</p>}
    </article>
  );
}

export function CinemaCouple({ couple }: { couple: CoupleData }) {
  const family = couple.family;
  const showGrandparents = family?.includeGrandparents ?? false;
  const people = [
    {
      side: "groom" as const,
      person: couple.groom,
      parentLine:
        getStructuredParentLine(
          "groom",
          family?.groom.fatherName,
          family?.groom.motherName,
        ) || couple.groom.parentNames,
      grandparents: family?.groom.grandparentsNames,
    },
    {
      side: "bride" as const,
      person: couple.bride,
      parentLine:
        getStructuredParentLine(
          "bride",
          family?.bride.fatherName,
          family?.bride.motherName,
        ) || couple.bride.parentNames,
      grandparents: family?.bride.grandparentsNames,
    },
  ];
  if (family?.displayOrder === "bride-first") people.reverse();

  return (
    <section
      id={PREVIEW_SECTION_IDS.couple}
      className="cinema-paper-section cinema-couple"
    >
      <SectionHeading
        title="Meet the Couple"
        description="Two families, two journeys, and one beautiful beginning."
      />
      <div className="cinema-couple__grid">
        {people.map((entry) => (
          <PersonCard
            key={entry.side}
            {...entry}
            showGrandparents={showGrandparents}
          />
        ))}
      </div>
    </section>
  );
}

export function CinemaEvents({ events }: { events: WeddingEvent[] }) {
  return (
    <section
      id={PREVIEW_SECTION_IDS.events}
      className="cinema-paper-section cinema-events"
    >
      <SectionHeading
        eyebrow="The celebration programme"
        title="Wedding Festivities"
        description="Every gathering, in the order chosen by the couple."
      />
      {events.length > 0 ? (
        <div className="cinema-events__list">
          {events.map((event, index) => {
            const background = isValidDisplayUrl(event.backgroundImage)
              ? event.backgroundImage?.trim()
              : null;
            const mapUrl = safeExternalUrl(event.googleMapLink);
            return (
              <article key={event.id || `${event.title}-${index}`} className="cinema-event-card">
                {background && (
                  <img
                    src={background}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="cinema-event-card__background"
                  />
                )}
                <div className="cinema-event-card__body">
                  <div className="cinema-event-card__number">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="cinema-event-card__type">{event.type}</p>
                    <h3>{event.title}</h3>
                    {event.description && <p>{event.description}</p>}
                    <dl className="cinema-event-card__details">
                      <div>
                        <CalendarDays aria-hidden="true" />
                        <dt>Date</dt>
                        <dd>{formatWeddingDate(event.date)}</dd>
                      </div>
                      <div>
                        <Clock3 aria-hidden="true" />
                        <dt>Time</dt>
                        <dd>{event.time || "To be announced"}</dd>
                      </div>
                      <div>
                        <MapPin aria-hidden="true" />
                        <dt>Venue</dt>
                        <dd>
                          {event.venue}
                          {event.address && <span>{event.address}</span>}
                        </dd>
                      </div>
                      {event.dressCode && (
                        <div>
                          <Shirt aria-hidden="true" />
                          <dt>Dress code</dt>
                          <dd>{event.dressCode}</dd>
                        </div>
                      )}
                    </dl>
                    {mapUrl && (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cinema-text-link"
                      >
                        <Navigation aria-hidden="true" size={17} />
                        View directions
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="cinema-empty">Celebration details will be shared soon.</p>
      )}
    </section>
  );
}

export function CinemaStory({ story }: { story: StoryData }) {
  const milestones = story.timeline.filter(
    (item) => item.title.trim() || item.description.trim(),
  );
  if (milestones.length === 0) return null;

  return (
    <section
      id={PREVIEW_SECTION_IDS.story}
      className="cinema-paper-section cinema-story"
    >
      <SectionHeading title={story.heading || "Our Story"} />
      {story.quote && (
        <blockquote className="cinema-story__quote">
          <Quote aria-hidden="true" />
          {story.quote}
        </blockquote>
      )}
      <ol className="cinema-story__timeline">
        {milestones.map((milestone, index) => {
          const photo = isValidDisplayUrl(milestone.photo)
            ? milestone.photo?.trim()
            : null;
          return (
            <li key={milestone.id || `${milestone.title}-${index}`}>
              <span className="cinema-story__marker" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <article>
                {photo && (
                  <img
                    src={photo}
                    alt={`Memory from ${milestone.title}`}
                    loading="lazy"
                  />
                )}
                {milestone.date && <time>{milestone.date}</time>}
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function CinemaGallery({ gallery }: { gallery: GalleryData }) {
  const images = useMemo(
    () =>
      gallery.images
        .slice()
        .sort((a, b) => a.order - b.order)
        .filter((image) => isValidDisplayUrl(image.url)),
    [gallery.images],
  );

  return (
    <section
      id={PREVIEW_SECTION_IDS.gallery}
      className="cinema-paper-section cinema-gallery"
    >
      <SectionHeading title={gallery.heading || "Our Gallery"} />
      {images.length > 0 ? (
        <div className="cinema-gallery__grid">
          {images.map((image, index) => (
            <figure key={image.id || `${image.url}-${index}`}>
              <img
                src={image.url}
                alt={image.alt || image.caption || `Wedding memory ${index + 1}`}
                loading="lazy"
              />
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          ))}
        </div>
      ) : (
        <p className="cinema-empty">Photographs will be added soon.</p>
      )}
    </section>
  );
}

export function CinemaVenue({ venue }: { venue: VenueData }) {
  const artwork = isValidDisplayUrl(venue.backgroundImage)
    ? venue.backgroundImage?.trim()
    : royalCinemaAssets.stills.venue;
  const mapUrl = safeExternalUrl(venue.googleMapLink);

  return (
    <section
      id={PREVIEW_SECTION_IDS.venue}
      className="cinema-paper-section cinema-venue"
    >
      <div className="cinema-venue__art">
        <img src={artwork} alt={`Artwork for ${venue.name}`} loading="lazy" />
      </div>
      <div className="cinema-venue__copy">
        <p className="cinema-eyebrow">The gathering place</p>
        <h2>{venue.name || "Venue to be announced"}</h2>
        {venue.address && (
          <p className="cinema-venue__address">
            <MapPin aria-hidden="true" />
            {venue.address}
          </p>
        )}
        {venue.description && <p>{venue.description}</p>}
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cinema-button"
          >
            <Navigation aria-hidden="true" size={17} />
            Open map
          </a>
        )}
      </div>
    </section>
  );
}

function getRsvpDestination(rsvp: RSVPData) {
  if (rsvp.type === "whatsapp") {
    const number = rsvp.whatsappNumber?.replace(/\D/g, "") ?? "";
    if (number.length < 8 || number.length > 15) return null;
    return {
      href: `https://wa.me/${number}?text=${encodeURIComponent(
        rsvp.message || "We would love to attend your wedding celebration!",
      )}`,
      icon: "whatsapp" as const,
    };
  }
  const href = safeExternalUrl(rsvp.formUrl);
  return href ? { href, icon: "external" as const } : null;
}

export function CinemaRsvp({ rsvp }: { rsvp: RSVPData }) {
  const destination = getRsvpDestination(rsvp);
  return (
    <section
      id={PREVIEW_SECTION_IDS.rsvp}
      className="cinema-paper-section cinema-rsvp"
    >
      <img
        src={royalCinemaAssets.decor.lotus}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <SectionHeading
        title="RSVP"
        description="Kindly let the couple know if you can join the celebration."
      />
      {destination ? (
        <a
          href={destination.href}
          target="_blank"
          rel="noopener noreferrer"
          className="cinema-button"
        >
          {destination.icon === "whatsapp" ? (
            <MessageCircle aria-hidden="true" size={18} />
          ) : (
            <ExternalLink aria-hidden="true" size={18} />
          )}
          {rsvp.buttonText ||
            (destination.icon === "whatsapp"
              ? "Confirm via WhatsApp"
              : "Confirm attendance")}
        </a>
      ) : (
        <p className="cinema-empty">
          RSVP contact details will be shared soon.
        </p>
      )}
    </section>
  );
}

interface CinemaFinaleProps {
  thankYou: ThankYouData;
  couple: CoupleData;
  hashtag?: string;
}

export function CinemaFinale({
  thankYou,
  couple,
  hashtag,
}: CinemaFinaleProps) {
  return (
    <footer className="cinema-finale" data-testid="royal-cinema-finale">
      <img
        src={royalCinemaAssets.decor.elephant}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="cinema-finale__elephant cinema-finale__elephant--left"
      />
      <img
        src={royalCinemaAssets.decor.elephant}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="cinema-finale__elephant cinema-finale__elephant--right"
      />
      <Heart aria-hidden="true" className="cinema-finale__heart" />
      <p className="cinema-eyebrow">With gratitude</p>
      <h2>Thank You</h2>
      <p>{thankYou.message}</p>
      <p className="cinema-finale__names">
        {couple.groom.name} <span>&amp;</span> {couple.bride.name}
      </p>
      {hashtag && <p className="cinema-finale__hashtag">{hashtag}</p>}
    </footer>
  );
}
