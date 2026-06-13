"use client";

import { StageColor } from "@/lib/types";

export function StageBadge({ stage, stageColors }: { stage: number, stageColors: StageColor[] }) {
  const colorData = stageColors.find(c => c.stage === stage) || { color: '#6B7280', label: 'Unknown' };
  
  return (
    <div className="flex items-center gap-2 border border-[#222] rounded-md px-2 py-1 bg-[#111] w-fit">
      <div 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: colorData.color, boxShadow: `0 0 8px ${colorData.color}80` }}
      />
      <span className="font-jetbrains text-xs text-text-muted">
        0{stage} {colorData.label}
      </span>
    </div>
  );
}
