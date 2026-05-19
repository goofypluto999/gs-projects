"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Socials } from "./Socials";
import { LiveClock } from "./LiveClock";
import { Monogram } from "./Monogram";

const navLinks = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);

      const sections = navLinks.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top < 200) {
          setActive(sections[i]);
          return;
        }
      }
      setActive("");
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-bg/85 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1280px] px-6 h-14 flex items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-2.5 cursor-pointer group"
            aria-label="Home"
          >
            <span className="relative transition-transform duration-200 group-hover:scale-105">
              <Monogram size={28} />
            </span>
            <span className="font-heading text-[13px] font-600 text-text-primary tracking-tight hidden sm:inline">
              Sizino Ennes
            </span>
          </a>

          {/* Center: nav links with elegant underline */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative group px-3 py-1.5 text-[13px] font-body transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                  {/* hover underline — slides in from left */}
                  <span
                    className={`absolute left-3 right-3 bottom-1 h-px transition-transform duration-300 origin-left ${
                      isActive ? "bg-accent scale-x-100" : "bg-text-primary scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <LiveClock />
            <Socials size="sm" />
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center min-w-11 min-h-11 -mr-2 text-text-secondary hover:text-text-primary active:text-text-primary transition-colors duration-150 cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-bg/98 pt-20">
          <div className="flex flex-col items-start px-6 gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-heading text-4xl font-800 text-text-primary cursor-pointer tracking-tight"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-6">
              <Socials />
            </div>
            <div className="absolute bottom-12 left-6 right-6 pt-6 border-t border-border">
              <p className="text-xs text-text-tertiary leading-relaxed">
                Reach out anytime —
              </p>
              <a
                href="mailto:giovanni.sizino.ennes@hotmail.co.uk"
                className="block mt-1 text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
              >
                giovanni.sizino.ennes@hotmail.co.uk
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
