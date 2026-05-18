import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";
import { ProjectGrid } from "@/components/ProjectGrid";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <TechMarquee />
        <ProjectGrid />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
