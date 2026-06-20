"use client";

import { motion } from "framer-motion";

export function PlaceholderCard({ text }: { text: string }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="flex min-h-[13rem] items-center rounded-xl border border-dashed border-blue-300/20 bg-white/[0.012] p-8">
      <div>
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-text-muted">Additional team profile</span>
        <p className="mt-3 font-syne text-3xl font-semibold text-text-primary/75">{text}</p>
        <p className="mt-3 max-w-2xl font-dm text-sm leading-7 text-text-muted">
          Details for this position will be published when the profile is ready.
        </p>
      </div>
    </motion.div>
  );
}
