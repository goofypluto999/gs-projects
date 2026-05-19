import type { Metadata, Viewport } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Grain } from "@/components/Grain";
import { BackToTop } from "@/components/BackToTop";
import { KeyboardHint } from "@/components/KeyboardHint";
import { SectionRail } from "@/components/SectionRail";
import { CursorTrail } from "@/components/CursorTrail";
import { RevealFailsafe } from "@/components/RevealFailsafe";
import { StickyContactCTA } from "@/components/StickyContactCTA";
import { StructuredData } from "@/components/StructuredData";
import "./globals.css";

// next/font self-hosts the fonts and inlines the critical CSS — no FOUT,
// no third-party round-trip on first paint.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Giovanni Sizino Ennes — Digital Products & Tools",
  description:
    "Five live digital products. Scenario intelligence, ATS-grade CV tooling, AI job preparation, game discovery, and agent journalism. Built end-to-end by one operator.",
  openGraph: {
    title: "Giovanni Sizino Ennes — Five live products",
    description:
      "Specialist tools that ship. Five live products, two open-source, all built solo — end-to-end. Open for strategic builds and acquisition conversations.",
    type: "website",
    locale: "en_GB",
    siteName: "Giovanni Sizino Ennes",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giovanni Sizino Ennes — Five live products",
    description:
      "Scenario intelligence, ATS CV tooling, AI job prep, game discovery, agent journalism.",
  },
  metadataBase: new URL("https://gs-projects.vercel.app"),
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    title: "Sizino Ennes",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

/**
 * Viewport export — Next.js 13+ moved themeColor / colorScheme out of
 * the Metadata object and into a separate Viewport export. Putting them
 * in metadata silently no-ops in newer versions and triggers a build
 * warning. iOS Safari status bar tints to this colour at load so the
 * page never shows a white slice at the top.
 */
export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${archivo.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <StructuredData />
      </head>
      <body className="min-h-screen bg-bg text-text-primary antialiased">
        <Preloader />
        <SmoothScroll />
        <ScrollProgress />
        <Grain />
        {children}
        <SectionRail />
        <BackToTop />
        <KeyboardHint />
        <CursorTrail />
        <StickyContactCTA />
        <RevealFailsafe />
      </body>
    </html>
  );
}
