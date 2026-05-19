"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Socials } from "./Socials";
import { Monogram } from "./Monogram";
import { ScrambleLetters } from "./ScrambleLetters";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const sitemap = [
  { label: "Work", href: "#projects" },
  { label: "Workshop", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const productLinks = [
  { label: "Foresay Labs", href: "https://foresaylabs.com/" },
  { label: "AimVantage", href: "https://aimvantage.uk/" },
  { label: "Wadda Play", href: "https://waddaplay.vercel.app/" },
  { label: "CV Mirror", href: "https://cv-mirror-web.vercel.app/" },
  { label: "AdsForge", href: "https://www.adsforge.store/" },
];

export function Footer() {
  const wrapRef = useRef<HTMLElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Giant outro wordmark parallaxes upward as user reaches the bottom
      gsap.fromTo(
        giantRef.current,
        { y: 60 },
        {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.8,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer
      ref={wrapRef}
      className="relative px-6 pt-24 pb-10 border-t border-border overflow-hidden"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Top row: sitemap + products + credits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary mb-2">
              Sitemap
            </div>
            <ul>
              {sitemap.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="footer-link"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary mb-2">
              Products
            </div>
            <ul>
              {productLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary mb-2">
              Reach
            </div>
            <ul>
              <li>
                <a
                  href="mailto:giovanni.sizino.ennes@hotmail.co.uk"
                  className="footer-link"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/goofypluto999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/giovannisizino/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/g.sizinoennes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary mb-4">
              Colophon
            </div>
            <ul className="space-y-2.5 text-[12.5px] text-text-secondary leading-relaxed">
              <li>Next.js 16 · TypeScript · Tailwind v4</li>
              <li>GSAP · Lenis · Framer Motion</li>
              <li>Type: Archivo + Space Grotesk</li>
              <li>Hosted on Vercel · v1.0</li>
            </ul>
          </div>
        </div>

        {/* Giant outro wordmark */}
        <div
          ref={giantRef}
          className="flex items-end justify-between gap-6 will-change-transform"
        >
          <h2 className="font-heading text-[clamp(3rem,15vw,14rem)] font-800 leading-[0.85] tracking-tighter text-text-primary">
            <ScrambleLetters
              text="Sizino"
              className="inline-block"
              scrambleColor="#2563EB"
              radius={70}
            />
            <span className="italic font-300 text-text-secondary">
              <ScrambleLetters
                text="Ennes"
                className="inline-block"
                scrambleColor="#A855F7"
                radius={70}
              />
            </span>
            <span className="text-accent">.</span>
          </h2>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-text-tertiary">
          <div className="flex items-center gap-3">
            <Monogram size={20} />
            <span>&copy; {year}</span>
            <span>·</span>
            <span>Giovanni Sizino Ennes</span>
            <span>·</span>
            <span className="hidden md:inline">UK / Brazil</span>
          </div>
          <Socials size="sm" />
        </div>
      </div>
    </footer>
  );
}
