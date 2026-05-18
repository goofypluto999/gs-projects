import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Workshop } from "@/components/Workshop";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";
import { AvailabilityStrip } from "@/components/AvailabilityStrip";
import { Process } from "@/components/Process";
import { Highlights } from "@/components/Highlights";
import { ActivityFeed } from "@/components/ActivityFeed";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <TechMarquee />
        <SectionDivider label="01 · The Work" />
        <ProjectGrid />
        <Highlights />
        <Testimonials />
        <SectionDivider label="02 · What's next" />
        <Workshop />
        <ActivityFeed />
        <AvailabilityStrip />
        <SectionDivider label="03 · The process" />
        <Process />
        <SectionDivider label="04 · Who" />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
