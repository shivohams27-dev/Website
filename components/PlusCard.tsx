"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export function PlusCard({ label, url }: { label: string, url: string }) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -5 }}
      className="group flex flex-col items-center justify-center h-full min-h-[250px] bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:border-accent cursor-pointer"
    >
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
        <Plus className="w-8 h-8 text-accent" />
      </div>
      <span className="font-jetbrains text-sm text-accent uppercase tracking-wider">{label}</span>
    </motion.a>
  );
}
