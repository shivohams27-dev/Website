"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SiteConfig } from "@/lib/types";

export function Hero({ config }: { config: SiteConfig }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background radial gradient & texture */}
      <div className="absolute inset-0 bg-grid-texture opacity-[0.15] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-accent/10 rounded-full blur-[120px] z-0 pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center max-w-4xl"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="font-jetbrains text-xs tracking-[0.2em] text-accent uppercase bg-accent/10 border border-accent/20 px-4 py-2 rounded-full">
            Independent Research Lab
          </span>
        </motion.div>

        <motion.h1 layoutId="hero-title" variants={itemVariants} className="font-syne text-6xl md:text-8xl font-bold text-text-primary mb-6 tracking-tight">
          Shivoham Lab
        </motion.h1>

        <motion.p variants={itemVariants} className="font-dm text-xl md:text-2xl text-text-primary/90 mb-8 max-w-2xl font-light">
          {config?.hero_tagline || "Building at the edge of AI, systems, and real-world problems."}
        </motion.p>

        <motion.p variants={itemVariants} className="font-dm text-base md:text-lg text-text-muted mb-12 max-w-3xl leading-relaxed">
          {config?.hero_about || "We are an independent research lab focusing on building protocols, infrastructure, and AI tools for the future of the web."}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={scrollToProjects}
            className="w-full sm:w-auto bg-accent text-[#0a0a0a] font-dm font-semibold px-8 py-4 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            View Projects 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a 
            href={config?.join_lab_url || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-transparent border border-accent/30 text-accent font-dm font-semibold px-8 py-4 rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-300 flex items-center justify-center"
          >
            Join the Lab
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
