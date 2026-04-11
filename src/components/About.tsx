"use client";

import { SectionReveal } from "./SectionReveal";

export function About() {
  return (
    <section id="about" className="px-6 py-24 scroll-mt-16">
      <div className="mx-auto max-w-[1200px]">
        <SectionReveal>
          <h2 className="font-heading text-2xl font-700 text-text-primary mb-8">
            About
          </h2>
        </SectionReveal>
        <SectionReveal>
          <div className="max-w-[600px] space-y-5 text-[15px] leading-relaxed text-text-secondary">
            <p>
              I build digital products — from first idea to live deployment.
              Each project here started with a real problem and ended with
              working software that people actually use.
            </p>
            <p>
              My work sits at the intersection of product thinking and
              engineering. I care about the details that make software feel
              considered: clear interfaces, fast performance, and architecture
              that holds up as things scale.
            </p>
            <p>
              Everything on this page is live, built, and maintained. If
              something here catches your attention — whether as a user, a
              collaborator, or someone with a similar problem to solve — I am
              always open to a conversation.
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
