"use client";

import { StageColor } from "@/lib/types";

export function StageBadge({ stage, stageColors }: { stage: number; stageColors: StageColor[] }) {
  const colorData = stageColors.find((color) => color.stage === stage) || { color: "#8b8b83", label: "Unknown" };

  return (
    <div
      className="flex items-center gap-2 rounded-md border px-3 py-2"
      style={{ borderColor: `${colorData.color}44`, backgroundColor: `${colorData.color}12` }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colorData.color }} />
      <span className="font-jetbrains text-[10px] uppercase tracking-[0.12em]" style={{ color: colorData.color }}>
        Stage {stage}: {colorData.label}
      </span>
    </div>
  );
}
