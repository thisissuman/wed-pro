import type { WeddingData } from "@/types/wedding.types";

/**
 * Sample wedding data for development and template previews.
 * Represents a realistic Indian wedding: Rahul & Ananya.
 *
 * This mock data populates:
 * - template previews
 * - editor development
 * - component testing
 */
export const sampleWeddingData: WeddingData = {
  id: "sample-001",
  slug: "rahul-weds-ananya",
  templateId: "royal",
  status: "draft",

  /* ── Couple ── */
  couple: {
    bride: {
      name: "Ananya Sharma",
      title: "Smt.",
      parentNames: "Daughter of Mr. Rajesh & Mrs. Sunita Sharma",
      bio: "A dreamer with a love for art, chai, and long evening walks.",
      heroText: "The Bride",
    },
    groom: {
      name: "Rahul Mehta",
      title: "Shri",
      parentNames: "Son of Mr. Vikram & Mrs. Priya Mehta",
      bio: "An engineer by day, poet by night, and a hopeless romantic always.",
      heroText: "The Groom",
    },
    weddingDate: "2026-02-13",
  },

  /* ── Hero ── */
  hero: {
    subtitle: "Together with their families, request the honour of your presence",
    overlayText: "Save the Date",
    overlayOpacity: 0.6,
  },

  /* ── Story ── */
  story: {
    heading: "Our Love Story",
    quote: "Every love story is beautiful, but ours is our favourite.",
    timeline: [
      {
        id: "story-1",
        title: "First Meeting",
        date: "March 2021",
        description:
          "A chance encounter at a friend's Holi celebration. One conversation that turned into hours.",
      },
      {
        id: "story-2",
        title: "The First Date",
        date: "April 2021",
        description:
          "A quiet café, two nervous hearts, and a conversation that felt like it could last forever.",
      },
      {
        id: "story-3",
        title: "The Proposal",
        date: "December 2024",
        description:
          "Under a thousand fairy lights at her favourite rooftop, he asked the question that changed everything.",
      },
    ],
  },

  /* ── Events ── */
  events: [
    {
      id: "evt-mehendi",
      title: "Mehendi Ceremony",
      type: "mehendi",
      description:
        "An evening of intricate henna art, music, and celebration with close family and friends.",
      date: "2026-02-10",
      time: "4:00 PM",
      venue: "Sharma Residence",
      address: "12, Civil Lines, Jaipur, Rajasthan",
      googleMapLink: "https://maps.google.com/?q=Civil+Lines+Jaipur",
      dressCode: "Traditional / Ethnic Wear",
    },
    {
      id: "evt-sangeet",
      title: "Sangeet Night",
      type: "sangeet",
      description:
        "A night of dance, laughter, and unforgettable performances from both families.",
      date: "2026-02-11",
      time: "7:00 PM",
      venue: "The Royal Orchid Ballroom",
      address: "MI Road, Jaipur, Rajasthan",
      googleMapLink: "https://maps.google.com/?q=MI+Road+Jaipur",
      dressCode: "Cocktail / Indo-Western",
    },
    {
      id: "evt-haldi",
      title: "Haldi Ceremony",
      type: "haldi",
      description:
        "A joyful morning of turmeric, flowers, and blessings for the bride and groom.",
      date: "2026-02-12",
      time: "10:00 AM",
      venue: "Mehta Farmhouse",
      address: "Amer Road, Jaipur, Rajasthan",
      googleMapLink: "https://maps.google.com/?q=Amer+Road+Jaipur",
      dressCode: "Yellow / Traditional",
    },
    {
      id: "evt-wedding",
      title: "Wedding Ceremony",
      type: "wedding",
      description:
        "The sacred union of two souls, under a canopy of marigolds and starlight.",
      date: "2026-02-13",
      time: "7:30 PM",
      venue: "The Oberoi Rajvilas",
      address: "Goner Road, Jaipur, Rajasthan 302031",
      googleMapLink: "https://maps.google.com/?q=Oberoi+Rajvilas+Jaipur",
      dressCode: "Royal / Bridal Wear",
    },
    {
      id: "evt-reception",
      title: "Grand Reception",
      type: "reception",
      description:
        "An elegant evening of celebration, fine dining, and warm wishes from loved ones.",
      date: "2026-02-14",
      time: "7:00 PM",
      venue: "The Oberoi Rajvilas",
      address: "Goner Road, Jaipur, Rajasthan 302031",
      googleMapLink: "https://maps.google.com/?q=Oberoi+Rajvilas+Jaipur",
      dressCode: "Formal / Black Tie",
    },
  ],

  /* ── Gallery ── */
  gallery: {
    heading: "Our Gallery",
    images: [
      {
        id: "gal-1",
        url: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=800&q=80",
        caption: "Pre-wedding shoot",
        alt: "Couple during pre-wedding photoshoot",
        order: 1,
      },
      {
        id: "gal-2",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        caption: "Together forever",
        alt: "Couple holding hands",
        order: 2,
      },
      {
        id: "gal-3",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
        caption: "Our journey",
        alt: "Wedding ceremony moment",
        order: 3,
      },
      {
        id: "gal-4",
        url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
        caption: "Celebration of love",
        alt: "Wedding celebration festivities",
        order: 4,
      },
      {
        id: "gal-5",
        url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
        caption: "An evening to remember",
        alt: "Evening wedding ceremony",
        order: 5,
      },
      {
        id: "gal-6",
        url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
        caption: "Love in every glance",
        alt: "Couple gazing at each other",
        order: 6,
      },
    ],
  },

  /* ── Venue ── */
  venue: {
    name: "The Oberoi Rajvilas",
    address: "Goner Road, Jaipur, Rajasthan 302031, India",
    description:
      "A luxury heritage resort spread across 32 acres of lush gardens, with traditional Rajasthani architecture and royal grandeur.",
    googleMapLink: "https://maps.google.com/?q=Oberoi+Rajvilas+Jaipur",
    coordinates: {
      lat: 26.8553,
      lng: 75.8513,
    },
  },

  /* ── Countdown ── */
  countdown: {
    targetDate: "2026-02-13T19:30:00+05:30",
    timezone: "Asia/Kolkata",
    label: "Counting Down to Forever",
  },

  /* ── RSVP ── */
  rsvp: {
    type: "whatsapp",
    whatsappNumber: "+919876543210",
    message:
      "We are delighted to confirm our attendance at Rahul & Ananya's wedding celebration!",
    buttonText: "Confirm via WhatsApp",
  },

  /* ── Blessing ── */
  blessing: {
    message:
      "With the blessings of Lord Ganesha and our beloved families, we invite you to celebrate the sacred union of our children.",
    from: "The Sharma & Mehta Families",
  },

  /* ── Thank You ── */
  thankYou: {
    message:
      "Your presence is the greatest gift. Thank you for being part of our love story.",
  },

  /* ── Music ── */
  music: {
    autoplay: false,
    title: "Tum Hi Ho — Arijit Singh",
  },

  /* ── Theme ── */
  theme: {
    primaryColor: "#d4af37",
    secondaryColor: "#8f0f07",
    accentColor: "#f2ca50",
    backgroundColor: "#131313",
    textColor: "#e5e2e1",
    fontHeading: "Playfair Display",
    fontBody: "Inter",
    accentGradient: "linear-gradient(135deg, #d4af37, #f2ca50, #d4af37)",
    decorativeStyle: "royal",
    sectionSpacing: 1,
    mode: "dark",
  },

  /* ── SEO ── */
  seo: {
    pageTitle: "Rahul & Ananya — Wedding Invitation",
    metaDescription:
      "You are invited to celebrate the wedding of Rahul Mehta & Ananya Sharma on February 13, 2026 at The Oberoi Rajvilas, Jaipur.",
  },

  /* ── Section Visibility ── */
  sections: {
    showHero: true,
    showCouple: true,
    showCountdown: true,
    showBlessing: true,
    showEvents: true,
    showStory: true,
    showGallery: true,
    showVenue: true,
    showRSVP: true,
    showThankYou: true,
  },

  /* ── Meta ── */
  meta: {
    createdAt: "2026-01-15T10:00:00+05:30",
    updatedAt: "2026-01-20T14:30:00+05:30",
  },
};
