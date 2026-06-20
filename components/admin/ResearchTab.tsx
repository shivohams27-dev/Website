"use client";

import { useState, useEffect } from "react";
import { ResearchPaper } from "@/lib/types";
import { useToast } from "../Toast";
import { Edit2, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

export function ResearchTab() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPaper, setEditingPaper] = useState<Partial<ResearchPaper> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const res = await fetch("/api/research");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPapers(data);
      } else {
        toast(data.error || "Failed to load research papers", "error");
        setPapers([]);
      }
    } catch (e) {
      toast("Failed to load research papers", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPaper?.title || !editingPaper?.description || !editingPaper?.stage) {
      toast("Please fill all required fields", "error");
      return;
    }

    const isNew = !editingPaper.id;
    const url = isNew ? "/api/research" : `/api/research/${editingPaper.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPaper),
      });

      if (res.ok) {
        toast(isNew ? "Paper added" : "Paper updated", "success");
        setEditingPaper(null);
        fetchPapers();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast(errData.error || "Failed to save paper", "error");
      }
    } catch (e) {
      toast("Error saving paper", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this paper?")) return;
    try {
      const res = await fetch(`/api/research/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Paper deleted", "success");
        fetchPapers();
      } else {
        toast("Failed to delete paper", "error");
      }
    } catch (e) {
      toast("Error deleting paper", "error");
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === papers.length - 1) return;

    const newPapers = [...papers];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order_index
    const tempOrder = newPapers[index].order_index;
    newPapers[index].order_index = newPapers[swapIndex].order_index;
    newPapers[swapIndex].order_index = tempOrder;

    // Swap positions
    [newPapers[index], newPapers[swapIndex]] = [newPapers[swapIndex], newPapers[index]];
    setPapers(newPapers);

    try {
      await fetch("/api/research", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          { id: newPapers[index].id, order_index: newPapers[index].order_index },
          { id: newPapers[swapIndex].id, order_index: newPapers[swapIndex].order_index }
        ]),
      });
    } catch (e) {
      toast("Failed to reorder", "error");
      fetchPapers(); 
    }
  };

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div></div>;

  if (editingPaper) {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <h3 className="font-syne text-xl text-text-primary mb-4">{editingPaper.id ? 'Edit Paper' : 'Add Paper'}</h3>
        
        <div>
          <label className="block font-jetbrains text-xs text-text-muted mb-2">Title *</label>
          <input type="text" required value={editingPaper.title || ""} onChange={e => setEditingPaper({...editingPaper, title: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
        </div>
        
        <div>
          <label className="block font-jetbrains text-xs text-text-muted mb-2">Abstract/Description *</label>
          <textarea required rows={4} value={editingPaper.description || ""} onChange={e => setEditingPaper({...editingPaper, description: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">Stage (1-5) *</label>
            <input type="number" min="1" max="5" required value={editingPaper.stage || ""} onChange={e => setEditingPaper({...editingPaper, stage: parseInt(e.target.value)})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
          </div>
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">Venue (optional)</label>
            <input type="text" value={editingPaper.venue || ""} onChange={e => setEditingPaper({...editingPaper, venue: e.target.value})} placeholder="e.g. NeurIPS" className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
          </div>
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">Year (optional)</label>
            <input type="number" value={editingPaper.year || ""} onChange={e => setEditingPaper({...editingPaper, year: parseInt(e.target.value)})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
          </div>
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">Publication Date</label>
            <input type="date" value={editingPaper.launch_date || ""} onChange={e => setEditingPaper({...editingPaper, launch_date: e.target.value || null})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none [color-scheme:dark]" />
          </div>
        </div>

        <div>
          <label className="block font-jetbrains text-xs text-text-muted mb-2">Explore URL (if stage 5)</label>
          <input type="text" value={editingPaper.explore_url || ""} onChange={e => setEditingPaper({...editingPaper, explore_url: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="bg-accent text-black font-semibold py-3 px-6 rounded-lg hover:bg-white transition-colors flex-grow">
            Save Paper
          </button>
          <button type="button" onClick={() => setEditingPaper(null)} className="bg-transparent border border-border text-text-primary py-3 px-6 rounded-lg hover:bg-[#222] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-syne text-xl text-text-primary">Manage Research Papers</h3>
        <button 
          onClick={() => setEditingPaper({ order_index: papers.length })}
          className="bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg font-dm text-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Paper
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {papers.map((p, i) => (
          <div key={p.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between group">
            <div>
              <div className="font-syne text-text-primary">{p.title}</div>
              <div className="font-jetbrains text-xs text-text-muted mt-1">
                Stage {p.stage}{p.launch_date ? ` · Publication ${p.launch_date}` : p.year ? ` · ${p.year}` : " · Publication date not set"}
              </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => moveItem(i, 'up')} disabled={i === 0} className="p-2 hover:text-accent disabled:opacity-30 disabled:hover:text-current transition-colors">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button onClick={() => moveItem(i, 'down')} disabled={i === papers.length - 1} className="p-2 hover:text-accent disabled:opacity-30 disabled:hover:text-current transition-colors">
                <ArrowDown className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-border mx-2" />
              <button onClick={() => setEditingPaper(p)} className="p-2 text-blue-400 hover:text-blue-300 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:text-red-300 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {papers.length === 0 && (
          <div className="text-center py-8 text-text-muted font-dm border border-dashed border-border rounded-lg">
            No research papers found.
          </div>
        )}
      </div>
    </div>
  );
}
