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
import { MobileSpecCards } from "@/components/MobileSpecCards";

/**
 * Page composition — show-then-tell flow.
 *
 * Earlier versions led with the Manifesto right after the hero. For a
 * cold prospect (Instagram-bio click, no prior trust) that meant
 * 3+ screens of declarative philosophy before any product. Drop-off
 * risk. Standard premium-portfolio pattern is: hook, prove, then tell
 * — show the work first, earn the right to philosophy second.
 *
 * 1. Hero — hook (who, what, CTA)
 * 2. TechMarquee — quick credibility strip
 * 3. The Work — products + highlights + testimonials (the proof)
 * 4. The Workshop — what's next + process (forward motion)
 * 5. The Person — Manifesto → About → Contact (close the loop)
 *
 * Manifesto now lives in section 3 *before* About so the philosophy
 * lands as the visitor's invested-enough-to-care moment, not the
 * gate they have to pass through.
 */
export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <TechMarquee />

        <SectionDivider label="01 · The Work" />
        <HorizontalShowcase />
        <MobileCarousel />
        <BrandMarquee />
        <ProjectGrid />
        <Highlights />
        <DragStack />
        <MobileSpecCards />
        <Testimonials />

        <SectionDivider label="02 · The Workshop" />
        <Workshop />
        <Process />
        <AvailabilityStrip />

        <SectionDivider label="03 · The Person" />
        <Manifesto />
        <ManifestoMobile />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
