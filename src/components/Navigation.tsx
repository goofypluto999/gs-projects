"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Socials } from "./Socials";

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
            ? "bg-bg/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1280px] px-6 h-14 flex items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-2.5 cursor-pointer group"
            aria-label="Home"
          >
            <span className="relative w-7 h-7 rounded-md bg-accent flex items-center justify-center">
              <span className="font-heading text-[11px] font-800 text-white">
                GS
              </span>
            </span>
            <span className="font-heading text-[13px] font-600 text-text-primary tracking-tight hidden sm:inline">
              Sizino Ennes
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-[13px] font-body transition-colors duration-150 cursor-pointer ${
                  active === link.href.slice(1)
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
                {active === link.href.slice(1) && (
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-accent" />
                )}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <Socials size="sm" />
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-text-secondary hover:text-text-primary transition-colors duration-150 cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
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
                className="font-heading text-3xl font-700 text-text-primary cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-6">
              <Socials />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
