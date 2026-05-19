import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Grain } from "@/components/Grain";
import { BackToTop } from "@/components/BackToTop";
import { KeyboardHint } from "@/components/KeyboardHint";
import { SectionRail } from "@/components/SectionRail";
import { CursorTrail } from "@/components/CursorTrail";
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
      "Built end-to-end. Open for strategic partnerships and acquisitions.",
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
      </body>
    </html>
  );
}
