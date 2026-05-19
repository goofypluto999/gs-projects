import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";
import { HorizontalShowcase } from "@/components/HorizontalShowcase";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Highlights } from "@/components/Highlights";
import { Testimonials } from "@/components/Testimonials";
import { Workshop } from "@/components/Workshop";
import { Process } from "@/components/Process";
import { AvailabilityStrip } from "@/components/AvailabilityStrip";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";
import { BrandMarquee } from "@/components/BrandMarquee";
import { Manifesto, ManifestoMobile } from "@/components/Manifesto";
import { DragStack } from "@/components/DragStack";
import { MobileCarousel } from "@/components/MobileCarousel";

/**
 * Page composition — tightened. Two SectionDividers max, redundant
 * sections cut (ActivityFeed merged into Workshop intent). Order
 * follows a prospect's mental model:
 *
 * 1. Hero — who and what
 * 2. TechMarquee — quick credibility strip
 * 3. The Work (cinema + catalog + highlights + testimonials)
 * 4. The Workshop (what's next, with built-in activity signal)
 * 5. The Process — how a build actually runs
 * 6. AvailabilityStrip — open slots indicator
 * 7. About — who is Giovanni
 * 8. Contact — close the loop
 */
export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Manifesto />
        <ManifestoMobile />
        <TechMarquee />

        <SectionDivider label="01 · The Work" />
        <HorizontalShowcase />
        <MobileCarousel />
        <BrandMarquee />
        <ProjectGrid />
        <Highlights />
        <DragStack />
        <Testimonials />

        <SectionDivider label="02 · The Workshop" />
        <Workshop />
        <Process />
        <AvailabilityStrip />

        <SectionDivider label="03 · The Person" />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
