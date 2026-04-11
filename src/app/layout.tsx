import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Giovanni Sizino — Digital Products",
  description:
    "Portfolio of digital products built by Giovanni Sizino. Scenario intelligence, job preparation, event planning, and more.",
  openGraph: {
    title: "Giovanni Sizino — Digital Products",
    description:
      "Portfolio of digital products built by Giovanni Sizino.",
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
      </head>
      <body className="min-h-screen bg-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
