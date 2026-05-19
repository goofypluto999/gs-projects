import type { MetadataRoute } from "next";

/**
 * Sitemap — single-page portfolio, but each anchor (#projects, #process,
 * #about, #contact) is a meaningful section so we surface them. Google
 * uses this to understand site structure even when everything lives at /.
 *
 * Next.js auto-generates the XML at /sitemap.xml from this export.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gs-projects.vercel.app";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#process`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
