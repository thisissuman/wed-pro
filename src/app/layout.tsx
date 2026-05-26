import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Sans_Devanagari, Geist } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AppToaster } from "@/components/providers/AppToaster";
import { GlobalLovePointer } from "@/components/magic-ui/global-love-pointer";
import { ChromeBodyClass } from "@/components/layout/ChromeBodyClass";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
  metadataBase: new URL(getSiteUrl()),
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
      className={cn(playfairDisplay.variable, inter.variable, notoDevanagari.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          <AuthProvider>
            <ChromeBodyClass />
            <GlobalLovePointer />
            {children}
            <AppToaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
