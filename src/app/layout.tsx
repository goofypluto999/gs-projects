import type { Metadata } from "next";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Grain } from "@/components/Grain";
import { BackToTop } from "@/components/BackToTop";
import { KeyboardHint } from "@/components/KeyboardHint";
import { SectionRail } from "@/components/SectionRail";
import "./globals.css";

export const metadata: Metadata = {
  title: "Giovanni Sizino Ennes — Digital Products & Tools",
  description:
    "Portfolio of Giovanni Sizino Ennes. Five live digital products — scenario intelligence, ATS-grade CV tooling, AI job preparation, game discovery, and agent journalism.",
  openGraph: {
    title: "Giovanni Sizino Ennes — Digital Products & Tools",
    description:
      "Five live digital products, end-to-end built. Open to strategic partnerships.",
    type: "website",
    locale: "en_GB",
  },
  metadataBase: new URL("https://gs-projects.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://image.thum.io" crossOrigin="anonymous" />
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
      </body>
    </html>
  );
}
