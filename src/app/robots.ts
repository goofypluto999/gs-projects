import type { MetadataRoute } from "next";

/**
 * robots.txt — fully open to crawlers (this is a personal portfolio
 * meant to be found), with sitemap pointer so search engines pick up
 * the section anchors. Next.js auto-routes this to /robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://gs-projects.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Vercel preview deployments shouldn't be indexed — they share the
        // same code but live at *.vercel.app subdomains. Block their crawl
        // paths defensively. The canonical URL above stays open.
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
