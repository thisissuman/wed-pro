import { getTemplate } from "@/templates/registry";

/** Illustrative uses of available designs, not customer quotes or reviews. */
export const invitationExamples = [
  {
    id: "royal-example",
    title: "A celebration with family",
    description: "Gather your wedding events, venue directions, and a WhatsApp RSVP destination in one invitation.",
    templateName: getTemplate("royal")!.name,
  },
  {
    id: "floral-example",
    title: "A story with a personal touch",
    description: "Pair your wedding details with optional photos, your story, and music guests can choose to play.",
    templateName: getTemplate("floral-elegance")!.name,
  },
  {
    id: "cinema-example",
    title: "An invitation with a grand entrance",
    description: "Set the scene with a cinematic opener, wedding films, and your own celebration details.",
    templateName: getTemplate("royal-3d-cinema")!.name,
  },
];
