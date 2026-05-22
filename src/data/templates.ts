import type { Template } from "@/types";

export const templates: Template[] = [
  {
    id: "royal",
    name: "Royal Rajputana",
    description:
      "Majestic archways, rich maroons, and intricate gold foil detailing for a grand celebration.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8tY2hQv7YmfTpckOrgxMKUo5jIeUSU2s8cr8zHzRt1W3CZkuLR9FWAwiwmlI2rPBvjFtonHhWV4HXaJRm6cn3LJAX_qfGgu_nuJeZpFbwFnDvaWwyaJKh_wb0S_r5bB05fxT-S5ZAwI7upnBsUlB5nwJc5XZ_pyFZbHfceSsuk0wzQRNkpaKhyHiJbz0q7YUnMwr1PUlM8zuUR-P-eCW1i5hzmrislJnzFssn1Ne0K8CIn_0omLjG5iHfU8L1qFydqZaXUtpafQM",
    category: "royal",
    badge: "Bestseller",
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description:
      "Clean lines, profound dark spaces, and subtle rose gold typography for the contemporary couple.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpHmprxBhNbLq-snM0-B19i6dGQcRmeHqY98CwhLVZo3kWh_WPDQllO4m7mGvnOXj3SYH8iO3r4_vjoWLa24U4_LJomwxiW4CMUkVvm5OTYK0lfLB1tPi0xV4s1VNPRutzivjMpFP5MgVwiJS-WvORF7SeQUJAahrCKAAKBGTp7xU-lvRfp-ChDet7yy9mWkCsi2B1MjY2DmG8J88q5kZOHwwChib2UpW9lHuJ5Z08Co_AgsVqNxsCMzL9wA8fOsR0W2OYRoLytFY",
    category: "modern",
  },
  {
    id: "floral-fusion",
    name: "Floral Fusion",
    description:
      "Ethereal watercolor blooms layered over deep charcoal velvet textures.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDB-lFBzSjDDMv2bo8cb2zdebBF3NpGZj-rl52u0ICwZgz8ebTjd_3yuvXpdkd9JDzAXHmb1Pvd6iSfvNBZImOv9wdalFRle5KNGCCqtb-NKPT7Oj9rWCf25J900Y9SgpuR1kPnhKHRLvbRTlrkmnLE5S4zv9yxjP0gnANUiwrsYxzRwpM3IeeehxwJyBVhdK_g-bxG9Nj04Ju1C4yOSYL79UdgdgwBLbXIC3SZWEIQ2oj90lGuxzAmFW5RJc-MFva_FByAETvPBWM",
    category: "floral",
  },
];

export const demoTemplates = [
  { id: "demo-palace", name: "The Palace Heritage", imageUrl: templates[0].imageUrl },
  { id: "demo-modern", name: "Modern Minimalist", imageUrl: templates[1].imageUrl },
  { id: "demo-floral", name: "Floral Romance", imageUrl: templates[2].imageUrl },
];
