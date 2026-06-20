"use client";

import { StageColor } from "@/lib/types";

export function StageBadge({ stage, stageColors }: { stage: number; stageColors: StageColor[] }) {
  const colorData = stageColors.find((color) => color.stage === stage) || { color: "#8b8b83", label: "Unknown" };

  return (
    <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/15 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-accent" />
      <span className="font-jetbrains text-[10px] uppercase tracking-[0.12em] text-text-muted">
        Stage {stage}: {colorData.label}
      </span>
    </div>
  );
}
