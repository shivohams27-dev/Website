"use client";

import { useState, useEffect } from "react";
import { TeamMember } from "@/lib/types";
import { useToast } from "../Toast";
import { Edit2, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

export function TeamTab() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        toast(data.error || "Failed to load team members", "error");
        setMembers([]);
      }
    } catch (e) {
      toast("Failed to load team members", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember?.type === 'member' && !editingMember.name) {
      toast("Name is required", "error");
      return;
    }
    if (editingMember?.type === 'placeholder' && !editingMember.placeholder_text) {
      toast("Placeholder text is required", "error");
      return;
    }

    const isNew = !editingMember?.id;
    const url = isNew ? "/api/team" : `/api/team/${editingMember?.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMember),
      });

      if (res.ok) {
        toast(isNew ? "Member added" : "Member updated", "success");
        setEditingMember(null);
        fetchMembers();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast(errData.error || "Failed to save member", "error");
      }
    } catch (e) {
      toast("Error saving member", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Member deleted", "success");
        fetchMembers();
      } else {
        toast("Failed to delete member", "error");
      }
    } catch (e) {
      toast("Error deleting member", "error");
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === members.length - 1) return;

    const newMembers = [...members];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order_index
    const tempOrder = newMembers[index].order_index;
    newMembers[index].order_index = newMembers[swapIndex].order_index;
    newMembers[swapIndex].order_index = tempOrder;

    // Swap positions
    [newMembers[index], newMembers[swapIndex]] = [newMembers[swapIndex], newMembers[index]];
    setMembers(newMembers);

    try {
      await fetch("/api/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          { id: newMembers[index].id, order_index: newMembers[index].order_index },
          { id: newMembers[swapIndex].id, order_index: newMembers[swapIndex].order_index }
        ]),
      });
    } catch (e) {
      toast("Failed to reorder", "error");
      fetchMembers();
    }
  };

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div></div>;

  if (editingMember) {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <h3 className="font-syne text-xl text-text-primary mb-4">
          {editingMember.id ? 'Edit' : 'Add'} {editingMember.type === 'member' ? 'Member' : 'Placeholder'}
        </h3>
        
        {editingMember.type === 'member' ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-jetbrains text-xs text-text-muted mb-2">Name *</label>
                <input type="text" required value={editingMember.name || ""} onChange={e => setEditingMember({...editingMember, name: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block font-jetbrains text-xs text-text-muted mb-2">Role Label</label>
                <input type="text" value={editingMember.role_label || ""} onChange={e => setEditingMember({...editingMember, role_label: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-jetbrains text-xs text-text-muted mb-2">Username</label>
                <input type="text" value={editingMember.username || ""} onChange={e => setEditingMember({...editingMember, username: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block font-jetbrains text-xs text-text-muted mb-2">Avatar Initials</label>
                <input type="text" value={editingMember.avatar_initials || ""} onChange={e => setEditingMember({...editingMember, avatar_initials: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
              </div>
            </div>

            <div>
              <label className="block font-jetbrains text-xs text-text-muted mb-2">Bio</label>
              <textarea rows={3} value={editingMember.bio || ""} onChange={e => setEditingMember({...editingMember, bio: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
            </div>

            <div>
              <label className="block font-jetbrains text-xs text-text-muted mb-2">Avatar URL (optional image)</label>
              <input type="text" value={editingMember.avatar_url || ""} onChange={e => setEditingMember({...editingMember, avatar_url: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-jetbrains text-xs text-text-muted mb-2">LinkedIn URL</label>
                <input type="text" value={editingMember.linkedin_url || ""} onChange={e => setEditingMember({...editingMember, linkedin_url: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block font-jetbrains text-xs text-text-muted mb-2">Instagram URL</label>
                <input type="text" value={editingMember.instagram_url || ""} onChange={e => setEditingMember({...editingMember, instagram_url: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block font-jetbrains text-xs text-text-muted mb-2">GitHub URL</label>
                <input type="text" value={editingMember.github_url || ""} onChange={e => setEditingMember({...editingMember, github_url: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">Placeholder Text *</label>
            <input type="text" required value={editingMember.placeholder_text || ""} onChange={e => setEditingMember({...editingMember, placeholder_text: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button type="submit" className="bg-accent text-black font-semibold py-3 px-6 rounded-lg hover:bg-white transition-colors flex-grow">
            Save
          </button>
          <button type="button" onClick={() => setEditingMember(null)} className="bg-transparent border border-border text-text-primary py-3 px-6 rounded-lg hover:bg-[#222] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-syne text-xl text-text-primary">Manage Team</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setEditingMember({ type: 'member', order_index: members.length })}
            className="bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg font-dm text-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Member
          </button>
          <button 
            onClick={() => setEditingMember({ type: 'placeholder', order_index: members.length })}
            className="bg-transparent border border-border text-text-muted hover:text-white px-4 py-2 rounded-lg font-dm text-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Placeholder
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {members.map((m, i) => (
          <div key={m.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between group">
            <div>
              <div className="font-syne text-text-primary flex items-center gap-2">
                {m.type === 'member' ? m.name : m.placeholder_text}
                <span className="font-jetbrains text-[10px] bg-[#222] px-2 py-0.5 rounded text-text-muted uppercase">
                  {m.type}
                </span>
              </div>
              {m.type === 'member' && m.role_label && (
                <div className="font-jetbrains text-xs text-accent/80 mt-1">{m.role_label}</div>
              )}
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => moveItem(i, 'up')} disabled={i === 0} className="p-2 hover:text-accent disabled:opacity-30 disabled:hover:text-current transition-colors">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button onClick={() => moveItem(i, 'down')} disabled={i === members.length - 1} className="p-2 hover:text-accent disabled:opacity-30 disabled:hover:text-current transition-colors">
                <ArrowDown className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-border mx-2" />
              <button onClick={() => setEditingMember(m)} className="p-2 text-blue-400 hover:text-blue-300 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(m.id)} className="p-2 text-red-400 hover:text-red-300 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <div className="text-center py-8 text-text-muted font-dm border border-dashed border-border rounded-lg">
            No team members found.
          </div>
        )}
      </div>
    </div>
  );
}
