import { projects } from "@/data/projects";

/**
 * JSON-LD structured data — Person + WebSite + ItemList of products.
 *
 * Google reads this and is more likely to rank the site for searches
 * like "Giovanni Sizino Ennes", "Foresay Labs builder", "Wadda Play
 * creator". Also makes the site eligible for rich-result cards in
 * search results (sitelinks, knowledge panel, etc).
 *
 * Server component — renders at build time, no client JS cost.
 */
export function StructuredData() {
  const baseUrl = "https://gs-projects.vercel.app";

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Giovanni Sizino Ennes",
    alternateName: "Giovanni Sizino",
    jobTitle: "Independent Builder · Digital Products",
    description:
      "Solo builder of five live digital products — scenario intelligence (Foresay Labs), ATS-grade CV tooling (CV Mirror), AI job preparation (AimVantage), game discovery (Wadda Play), and AI-agent editorial (AdsForge). Three-year solo span, no outside capital.",
    url: baseUrl,
    image: `${baseUrl}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
      addressLocality: "London",
    },
    knowsAbout: [
      "Next.js",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "GSAP animation",
      "Behavioural economics simulation",
      "AI agents",
      "MCP servers",
      "Prospect Theory",
      "ATS resume parsing",
    ],
    sameAs: [
      "https://www.linkedin.com/in/giovannisizino/",
      "https://github.com/goofypluto999",
      "https://www.instagram.com/g.sizinoennes/",
    ],
    email: "mailto:giovanni.sizino.ennes@hotmail.co.uk",
    worksFor: {
      "@type": "Organization",
      name: "Foresay Labs",
      url: "https://foresaylabs.com/",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Giovanni Sizino Ennes — Digital Products & Tools",
    url: baseUrl,
    description:
      "Personal portfolio: five live digital products built end-to-end by one operator.",
    author: { "@id": baseUrl },
    inLanguage: "en-GB",
  };

  const productList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Live products by Giovanni Sizino Ennes",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: p.name,
        description: p.tagline,
        url: p.url,
        applicationCategory: "WebApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
        },
        creator: { "@id": baseUrl },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productList) }}
      />
    </>
  );
}
