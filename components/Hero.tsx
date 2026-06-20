"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { SiteConfig } from "@/lib/types";
import { LabArtifact } from "./LabArtifact";

export function Hero({ config }: { config: SiteConfig }) {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden px-4 pb-14 pt-28 md:px-8 md:pt-32">
      <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_.98fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <h1 className="max-w-3xl font-syne text-[clamp(4.2rem,10vw,8.5rem)] font-semibold leading-[0.8] tracking-[-0.075em] text-text-primary">
            Shivoham
            <span className="block pl-[.58em] text-accent">Lab.</span>
          </h1>

          <div className="mt-10 grid max-w-2xl gap-6 border-t border-white/10 pt-7 sm:grid-cols-[1fr_1.35fr]">
            <div>
              <span className="font-jetbrains text-[10px] uppercase tracking-[0.14em] text-accent-soft">Research focus</span>
              <p className="mt-3 font-dm text-sm leading-7 text-text-muted">
                The lab works across applied artificial intelligence, internet infrastructure, developer tooling, and self-hosted software.
              </p>
            </div>
            <div>
              <p className="font-dm text-xl leading-snug text-text-primary md:text-2xl">
                {config?.hero_tagline || "Building at the edge of AI, systems and real world problems"}
              </p>
              <p className="mt-4 max-w-xl font-dm text-sm leading-7 text-text-muted md:text-base">
                {config?.hero_about || "We are an independent research lab focusing on building protocols, infrastructure, and AI tools for the future of the web."}
              </p>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={scrollToProjects}
              className="group inline-flex items-center gap-4 rounded-full bg-accent px-6 py-3.5 font-dm text-sm font-semibold text-[#02070d] shadow-[0_12px_40px_rgba(77,163,255,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-soft"
            >
              Explore the work
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </button>
            <a
              href={config?.join_lab_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3.5 font-dm text-sm text-text-primary transition-colors hover:border-accent/60 hover:bg-accent/5"
            >
              Work with the lab
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: 3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.15, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-2xl"
        >
          <LabArtifact />
        </motion.div>
      </div>

    </section>
  );
}
