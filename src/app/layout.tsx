import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Indic fallback so Hindi / Marathi / Sanskrit text inside templates renders
// with a polished script instead of the browser's default system serif.
const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-indic",
  subsets: ["devanagari"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vivaha Studio — Premium Digital Wedding Invitations",
  description:
    "Craft cinematic digital wedding invitations for your royal celebration. Browse premium templates, customize with live editing, and share instantly via WhatsApp.",
  keywords: [
    "wedding invitation",
    "digital invitation",
    "Indian wedding",
    "wedding card",
    "vivaha",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfairDisplay.variable} ${inter.variable} ${notoDevanagari.variable} dark`}
    >
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
