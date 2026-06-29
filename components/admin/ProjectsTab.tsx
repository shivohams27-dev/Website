"use client";

import { useState, useEffect, useRef } from "react";
import { Project, Member } from "@/lib/types";
import { useToast } from "../Toast";
import { Edit2, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

export function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [orderDirty, setOrderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const originalOrderRef = useRef<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then(r => r.json()),
      fetch("/api/members").then(r => r.json()),
    ]).then(([projData, memData]) => {
      if (Array.isArray(projData)) {
        setProjects(projData);
        originalOrderRef.current = projData.map((p: Project) => p.id);
      }
      else toast(projData.error || "Failed to load projects", "error");
      if (Array.isArray(memData)) setMembers(memData);
    }).catch(() => toast("Failed to load data", "error")).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.description || !editingProject?.stage) {
      toast("Please fill all required fields", "error");
      return;
    }

    const isNew = !editingProject.id;
    const url = isNew ? "/api/projects" : `/api/projects/${editingProject.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });

      if (res.ok) {
        toast(isNew ? "Project created" : "Project updated", "success");
        setEditingProject(null);
        fetchProjects();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast(errData.error || "Failed to save project", "error");
      }
    } catch (e) {
      toast("Error saving project", "error");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
        originalOrderRef.current = data.map((p: Project) => p.id);
        setOrderDirty(false);
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Project deleted", "success");
        fetchProjects();
      }
    } catch {
      toast("Error deleting project", "error");
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const newProjects = [...projects];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const tempOrder = newProjects[index].order_index;
    newProjects[index].order_index = newProjects[swapIndex].order_index;
    newProjects[swapIndex].order_index = tempOrder;
    [newProjects[index], newProjects[swapIndex]] = [newProjects[swapIndex], newProjects[index]];
    setProjects(newProjects);
    setOrderDirty(true);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      const payload = projects.map(p => ({ id: p.id, order_index: p.order_index }));
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        originalOrderRef.current = projects.map(p => p.id);
        setOrderDirty(false);
        toast("Order saved", "success");
      } else {
        toast("Failed to save order", "error");
      }
    } catch {
      toast("Failed to save order", "error");
    } finally {
      setSavingOrder(false);
    }
  };

  const resetOrder = () => {
    fetchProjects();
  };

  const toggleContributor = (memberId: string) => {
    if (!editingProject) return;
    const current = editingProject.contributor_ids || [];
    const next = current.includes(memberId)
      ? current.filter(id => id !== memberId)
      : [...current, memberId];
    setEditingProject({ ...editingProject, contributor_ids: next });
  };

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto" /></div>;

  if (editingProject) {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <h3 className="font-syne text-xl text-text-primary mb-4">{editingProject.id ? 'Edit Project' : 'New Project'}</h3>

        <div>
          <label className="block font-jetbrains text-xs text-text-muted mb-2">Title *</label>
          <input type="text" required value={editingProject.title || ""} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
        </div>

        <div>
          <label className="block font-jetbrains text-xs text-text-muted mb-2">Description *</label>
          <textarea required rows={3} value={editingProject.description || ""} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">Stage (1-5) *</label>
            <input type="number" min="1" max="5" required value={editingProject.stage || ""} onChange={e => setEditingProject({...editingProject, stage: parseInt(e.target.value)})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
          </div>
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">Launch Date</label>
            <input type="date" value={editingProject.launch_date || ""} onChange={e => setEditingProject({...editingProject, launch_date: e.target.value || null})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none [color-scheme:dark]" />
          </div>
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">Tags (comma separated)</label>
            <input type="text" value={editingProject.tags?.join(", ") || ""} onChange={e => setEditingProject({...editingProject, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">GitHub URL</label>
            <input type="text" value={editingProject.github_url || ""} onChange={e => setEditingProject({...editingProject, github_url: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
          </div>
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">Explore URL (if stage 5)</label>
            <input type="text" value={editingProject.explore_url || ""} onChange={e => setEditingProject({...editingProject, explore_url: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
          </div>
        </div>

        {members.length > 0 && (
          <div className="border-t border-border pt-4 mt-2">
            <label className="block font-jetbrains text-xs text-text-muted mb-3">Contributors (from Members)</label>
            <div className="flex flex-wrap gap-2">
              {members.map(member => {
                const selected = (editingProject.contributor_ids || []).includes(member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleContributor(member.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-dm transition-colors ${
                      selected
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-[#111] text-text-muted hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${selected ? "bg-accent" : "bg-text-muted/30"}`} />
                    {member.name}
                    <span className="font-jetbrains text-[10px] opacity-60">@{member.username}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button type="submit" className="bg-accent text-black font-semibold py-3 px-6 rounded-lg hover:bg-white transition-colors flex-grow">
            Save Project
          </button>
          <button type="button" onClick={() => setEditingProject(null)} className="bg-transparent border border-border text-text-primary py-3 px-6 rounded-lg hover:bg-[#222] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-syne text-xl text-text-primary">Manage Projects</h3>
        <div className="flex items-center gap-3">
          {orderDirty && (
            <>
              <button
                onClick={resetOrder}
                disabled={savingOrder}
                className="border border-border text-text-muted hover:text-white px-4 py-2 rounded-lg font-dm text-sm transition-colors"
              >
                Reset
              </button>
              <button
                onClick={saveOrder}
                disabled={savingOrder}
                className="bg-accent text-black font-semibold px-4 py-2 rounded-lg hover:bg-white transition-colors text-sm flex items-center gap-2"
              >
                {savingOrder ? "Saving..." : "Save Order"}
              </button>
            </>
          )}
          <button
            onClick={() => setEditingProject({ order_index: projects.length, tags: [], contributor_ids: [] })}
            className="bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg font-dm text-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {projects.map((p, i) => (
          <div key={p.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between group">
            <div>
              <div className="font-syne text-text-primary">{p.title}</div>
              <div className="font-jetbrains text-xs text-text-muted mt-1">
                Stage {p.stage}{p.launch_date ? ` · Launch ${p.launch_date}` : " · Launch date not set"}
                {p.contributor_ids && p.contributor_ids.length > 0 ? ` · ${p.contributor_ids.length} contributors` : ""}
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => moveItem(i, 'up')} disabled={i === 0} className="p-2 hover:text-accent disabled:opacity-30 disabled:hover:text-current transition-colors">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button onClick={() => moveItem(i, 'down')} disabled={i === projects.length - 1} className="p-2 hover:text-accent disabled:opacity-30 disabled:hover:text-current transition-colors">
                <ArrowDown className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-border mx-2" />
              <button onClick={() => setEditingProject(p)} className="p-2 text-blue-400 hover:text-blue-300 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:text-red-300 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-8 text-text-muted font-dm border border-dashed border-border rounded-lg">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
}
