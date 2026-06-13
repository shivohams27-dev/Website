"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const navLinks = [
    { id: "hero", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "research", label: "Research" },
    { id: "team", label: "Team" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Simple active section tracking
      const sections = navLinks.map(link => document.getElementById(link.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled ? "bg-background/70 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between min-h-[5rem]">
          <button 
            onClick={() => scrollTo("hero")}
            className="flex flex-col items-start gap-2 hover:opacity-80 transition-opacity text-left"
          >
            <img src="/s.png" alt="Shivoham Lab Logo" className="h-12 w-12 object-contain" />
            <div className="hidden sm:flex flex-col">
              <span className="font-syne text-[1.1rem] font-bold text-text-primary leading-none">Shivoham Labs</span>
              <span className="font-jetbrains text-[10px] text-text-muted leading-tight mt-1">Indie Research Lab</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`font-jetbrains text-sm transition-all px-5 py-2 rounded-full border ${
                    isActive 
                      ? "text-text-primary border-accent/50 bg-accent/5" 
                      : "text-text-muted border-transparent hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-text-primary p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-background pt-24 px-6 md:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`font-syne text-3xl text-left border-b border-border pb-4 transition-colors ${
                  activeSection === link.id ? "text-accent" : "text-text-primary"
                }`}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
