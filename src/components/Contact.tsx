"use client";

import { SectionReveal } from "./SectionReveal";

export function Contact() {
  return (
    <section id="contact" className="px-6 py-24 scroll-mt-16">
      <div className="mx-auto max-w-[1200px]">
        <SectionReveal>
          <h2 className="font-heading text-2xl font-700 text-text-primary mb-4">
            Let&apos;s talk
          </h2>
          <p className="text-[15px] text-text-secondary leading-relaxed max-w-[480px] mb-6">
            Interested in working together, exploring a partnership, or want
            to learn more about any of these projects? I am always open to
            the right conversation.
          </p>
          <a
            href="mailto:giovanni.sizino.ennes@hotmail.co.uk"
            className="inline-block text-[15px] text-accent hover:text-accent-hover transition-colors duration-150 underline underline-offset-4 decoration-accent/30 hover:decoration-accent cursor-pointer"
          >
            giovanni.sizino.ennes@hotmail.co.uk
          </a>
        </SectionReveal>
      </div>
    </section>
  );
}
