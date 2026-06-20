"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  { id: "hero", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "team", label: "People" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      const position = window.scrollY + window.innerHeight * 0.35;

      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const section = document.getElementById(NAV_LINKS[i].id);
        if (section && section.offsetTop <= position) {
          setActiveSection(NAV_LINKS[i].id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-6">
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 md:px-5 ${
            scrolled
              ? "border border-blue-300/10 bg-[#07090d]/85 shadow-2xl shadow-black/30 backdrop-blur-xl"
              : "border border-transparent bg-transparent"
          }`}
        >
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3 text-left">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
              <Image src="/s.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
            </span>
            <span>
              <strong className="block font-syne text-sm font-semibold leading-none">Shivoham Lab</strong>
              <span className="mt-1 block font-jetbrains text-[8px] uppercase tracking-[0.18em] text-text-muted">
                Independent R&amp;D
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/10 p-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`relative rounded-full px-4 py-2 font-jetbrains text-[11px] transition-colors ${
                    active ? "text-[#02070d]" : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="active-navigation"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-0 z-30 flex flex-col justify-end bg-[#050608]/95 px-5 pb-12 pt-28 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1">
              {NAV_LINKS.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="flex w-full items-center justify-between border-b border-white/10 py-5 text-left font-syne text-4xl"
                >
                  {link.label}
                  <span className="font-jetbrains text-xs text-text-muted">0{index + 1}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
