import type { MetadataRoute } from "next";

/**
 * Web app manifest — makes the site installable as a PWA on iOS / Android
 * home screens. Tap "Add to Home Screen" and it opens in standalone mode
 * with the dark theme applied, no browser chrome. Gives the portfolio
 * an app-like feel for prospects who bookmark it.
 *
 * Theme color matches the bg token (--color-bg = #0A0A0B) so the iOS
 * status bar tints to match the page rather than going white.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Giovanni Sizino Ennes — Digital Products & Tools",
    short_name: "Sizino Ennes",
    description:
      "Five live digital products built end-to-end by one operator.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0B",
    theme_color: "#0A0A0B",
    orientation: "portrait-primary",
    categories: ["portfolio", "productivity", "design"],
    lang: "en-GB",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
