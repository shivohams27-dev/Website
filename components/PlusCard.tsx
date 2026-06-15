"use client";

import { motion } from "framer-motion";
import { ExplodingPlusButton } from "./ui/ExplodingPlusButton";

export function PlusCard({ label, url }: { label: string, url: string }) {
  return (
    <div className="group flex flex-col items-center justify-center h-full min-h-[250px] bg-card border border-border rounded-xl p-6 transition-all duration-300">
      <ExplodingPlusButton url={url} />
    </div>
  );
}
