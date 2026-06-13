"use client";

import { useState, useEffect } from "react";
import { StageColor } from "@/lib/types";
import { useToast } from "../Toast";

export function StagesTab() {
  const [stages, setStages] = useState<StageColor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      const res = await fetch("/api/stage-colors");
      const data = await res.json();
      if (Array.isArray(data)) {
        setStages(data);
      } else {
        toast(data.error || "Failed to load stage colors", "error");
        setStages([]);
      }
    } catch (e) {
      toast("Failed to load stage colors", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/stage-colors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stages),
      });

      if (res.ok) {
        toast("Stage colors saved ✓", "success");
      } else {
        toast("Failed to save stage colors", "error");
      }
    } catch (e) {
      toast("Error saving stage colors", "error");
    }
  };

  const updateStage = (index: number, field: keyof StageColor, value: string) => {
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], [field]: value };
    setStages(newStages);
  };

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div></div>;

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-syne text-xl text-text-primary">Stage Colors</h3>
        <button type="submit" className="bg-accent text-black font-semibold py-2 px-6 rounded-lg hover:bg-white transition-colors text-sm">
          Save All Changes
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {stages.map((stage, i) => (
          <div key={stage.stage} className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            
            <div className="flex items-center gap-4 min-w-[120px]">
              <div 
                className="w-8 h-8 rounded-full border-2 border-[#222] shrink-0" 
                style={{ backgroundColor: stage.color, boxShadow: `0 0 10px ${stage.color}80` }}
              />
              <span className="font-jetbrains text-sm text-text-muted">Stage 0{stage.stage}</span>
            </div>

            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-jetbrains text-[10px] text-text-muted uppercase mb-1">Label</label>
                <input 
                  type="text" 
                  value={stage.label} 
                  onChange={e => updateStage(i, 'label', e.target.value)} 
                  className="w-full bg-[#111] border border-border rounded-md p-2 text-text-primary focus:border-accent outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block font-jetbrains text-[10px] text-text-muted uppercase mb-1">Color (Hex)</label>
                <input 
                  type="text" 
                  value={stage.color} 
                  onChange={e => updateStage(i, 'color', e.target.value)} 
                  className="w-full bg-[#111] border border-border rounded-md p-2 text-text-primary focus:border-accent outline-none font-jetbrains text-sm" 
                />
              </div>
            </div>

          </div>
        ))}
      </div>
    </form>
  );
}
