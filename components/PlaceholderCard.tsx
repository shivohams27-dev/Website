"use client";

import { motion } from "framer-motion";

export function PlaceholderCard({ text }: { text: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#161616] border-l-[3px] border-l-accent/50 border-y border-y-[#222] border-r border-r-[#222] rounded-xl p-6 flex items-center justify-center min-h-[250px] transition-all duration-300"
    >
      <span className="font-syne text-xl italic text-accent/60 tracking-wide">
        {text}
      </span>
    </motion.div>
  );
}
