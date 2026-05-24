import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Sans_Devanagari } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AppToaster } from "@/components/providers/AppToaster";
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
      className={`${playfairDisplay.variable} ${inter.variable} ${notoDevanagari.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
