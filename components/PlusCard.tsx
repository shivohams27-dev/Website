"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";

export function PlusCard({ label, url }: { label: string; url: string }) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -5 }}
      className="group flex min-h-0 items-center justify-between gap-6 rounded-xl border border-dashed border-blue-300/20 bg-white/[0.012] p-6 transition-colors hover:border-accent/50 hover:bg-accent/[0.03] md:p-8"
    >
      <div className="flex items-center gap-5">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/15 text-text-muted transition-all duration-300 group-hover:border-accent/50 group-hover:text-accent-soft">
          <Plus className="h-5 w-5" />
        </div>
        <div>
        <span className="font-jetbrains text-[9px] uppercase tracking-[0.16em] text-text-muted">Open invitation</span>
          <h3 className="mt-2 font-syne text-xl font-semibold leading-tight md:text-2xl">{label}</h3>
          <p className="mt-2 max-w-2xl font-dm text-sm leading-6 text-text-muted">
            Share a relevant project or research proposal with the lab for review and possible collaboration.
          </p>
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-accent-soft transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
    </motion.a>
  );
}
