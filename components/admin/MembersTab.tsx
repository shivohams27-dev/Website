"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, X, ArrowUp, ArrowDown, Pencil, Trash2, Upload } from "lucide-react";
import { Member } from "@/lib/types";
import { useToast } from "../Toast";

const emptyMember: Omit<Member, "id" | "created_at" | "order_index"> = {
  name: "",
  username: "",
  profile_pic: "",
  role: "",
  description: "",
  linkedin_url: "",
  github_url: "",
  instagram_url: "",
  custom_link_url: "",
};

const MAX_DIMENSION = 300;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > MAX_DIMENSION) { height = (height / width) * MAX_DIMENSION; width = MAX_DIMENSION; }
        } else {
          if (height > MAX_DIMENSION) { width = (width / height) * MAX_DIMENSION; height = MAX_DIMENSION; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function MembersTab() {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyMember);
  const [editId, setEditId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/members");
      setMembers(await res.json());
    } catch {
      toast("Failed to load members", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return toast("Only image files allowed", "error");
    if (file.size > 5 * 1024 * 1024) return toast("Max 5MB file size", "error");
    try {
      const dataUrl = await compressImage(file);
      setForm(prev => ({ ...prev, profile_pic: dataUrl }));
    } catch {
      toast("Failed to process image", "error");
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragging(false), []);

  const handleSave = async () => {
    if (!form.name.trim()) return toast("Name is required", "error");
    if (!form.username.trim()) return toast("Username is required", "error");
    if (!form.role.trim()) return toast("Role is required", "error");

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `/api/members/${editId}` : "/api/members";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order_index: members.length }),
      });
      if (res.ok) {
        toast(editId ? "Member updated" : "Member added", "success");
        setEditing(false);
        setEditId(null);
        setForm(emptyMember);
        fetchMembers();
      } else {
        toast("Failed to save", "error");
      }
    } catch {
      toast("Error saving", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (res.ok) { toast("Member deleted", "success"); fetchMembers(); }
    } catch {
      toast("Error deleting", "error");
    }
  };

  const moveItem = async (index: number, direction: -1 | 1) => {
    const newMembers = [...members];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newMembers.length) return;
    [newMembers[index], newMembers[swapIndex]] = [newMembers[swapIndex], newMembers[index]];
    setMembers(newMembers);
    try {
      await fetch("/api/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMembers.map((m, i) => ({ id: m.id, order_index: i }))),
      });
    } catch {
      toast("Failed to reorder", "error");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent" /></div>;
  }

  if (editing) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-syne text-xl font-semibold text-text-primary">
            {editId ? "Edit Member" : "Add Member"}
          </h3>
          <button onClick={() => { setEditing(false); setEditId(null); setForm(emptyMember); }} className="text-text-muted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {/* Profile Picture Drop Zone */}
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">Profile Picture</label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all ${
                dragging
                  ? "border-accent bg-accent/5"
                  : "border-border bg-[#111] hover:border-white/20 hover:bg-white/[0.02]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                  e.target.value = "";
                }}
              />
              {form.profile_pic ? (
                <>
                  <img src={form.profile_pic} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-accent/40" />
                  <span className="font-dm text-xs text-text-muted">Drop a new image or click to replace</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setForm(prev => ({ ...prev, profile_pic: "" })); }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-[#222] text-text-muted hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                    <Upload className="w-5 h-5 text-text-muted" />
                  </div>
                  <div className="text-center">
                    <span className="font-dm text-sm text-text-muted">Drop image here or </span>
                    <span className="font-dm text-sm text-accent">browse</span>
                  </div>
                  <span className="font-jetbrains text-[10px] text-text-muted/60">PNG, JPG, WebP — max 5MB</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-jetbrains text-xs text-text-muted mb-2">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#111] border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
            </div>
            <div>
              <label className="block font-jetbrains text-xs text-text-muted mb-2">Username *</label>
              <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full bg-[#111] border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
            </div>
          </div>
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">Role *</label>
            <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. Lead Developer" className="w-full bg-[#111] border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
          </div>
          <div>
            <label className="block font-jetbrains text-xs text-text-muted mb-2">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-[#111] border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-jetbrains text-xs text-text-muted mb-2">LinkedIn URL</label>
              <input type="text" value={form.linkedin_url || ""} onChange={e => setForm({...form, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/..." className="w-full bg-[#111] border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
            </div>
            <div>
              <label className="block font-jetbrains text-xs text-text-muted mb-2">GitHub URL</label>
              <input type="text" value={form.github_url || ""} onChange={e => setForm({...form, github_url: e.target.value})} placeholder="https://github.com/..." className="w-full bg-[#111] border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-jetbrains text-xs text-text-muted mb-2">Instagram URL</label>
              <input type="text" value={form.instagram_url || ""} onChange={e => setForm({...form, instagram_url: e.target.value})} placeholder="https://instagram.com/..." className="w-full bg-[#111] border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
            </div>
            <div>
              <label className="block font-jetbrains text-xs text-text-muted mb-2">Custom Link URL</label>
              <input type="text" value={form.custom_link_url || ""} onChange={e => setForm({...form, custom_link_url: e.target.value})} placeholder="https://..." className="w-full bg-[#111] border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <button onClick={handleSave} className="bg-accent text-black font-semibold py-3 px-6 rounded-lg hover:bg-white transition-colors">
              {editId ? "Update" : "Add"} Member
            </button>
            <button onClick={() => { setEditing(false); setEditId(null); setForm(emptyMember); }} className="border border-border text-text-muted py-3 px-6 rounded-lg hover:text-white hover:border-white/20 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-syne text-xl font-semibold text-text-primary">Members ({members.length})</h3>
        <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-sm text-accent hover:text-white transition-colors bg-[#111] px-4 py-2 rounded-lg border border-border">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {members.map((member, index) => (
          <div key={member.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-[#111] hover:border-white/20 transition-colors">
            <div className="flex flex-col gap-1">
              <button disabled={index === 0} onClick={() => moveItem(index, -1)} className={`p-1 rounded transition-colors ${index === 0 ? "opacity-30 cursor-not-allowed" : "hover:text-accent"}`}>
                <ArrowUp className="w-4 h-4" />
              </button>
              <button disabled={index === members.length - 1} onClick={() => moveItem(index, 1)} className={`p-1 rounded transition-colors ${index === members.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:text-accent"}`}>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
            {member.profile_pic ? (
              <img src={member.profile_pic} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#212328] border border-white/10 flex items-center justify-center">
                <span className="font-syne text-sm font-semibold text-white">{member.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-syne font-semibold text-text-primary">{member.name}</span>
                <span className="font-jetbrains text-xs text-text-muted">@{member.username}</span>
              </div>
              <span className="font-dm text-sm text-accent">{member.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setForm({ name: member.name, username: member.username, profile_pic: member.profile_pic, role: member.role, description: member.description, linkedin_url: member.linkedin_url, github_url: member.github_url, instagram_url: member.instagram_url, custom_link_url: member.custom_link_url }); setEditId(member.id); setEditing(true); }} className="p-2 text-text-muted hover:text-accent transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(member.id)} className="p-2 text-text-muted hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <div className="text-center text-text-muted py-12 border border-dashed border-border rounded-lg">
            No members yet. Click "Add Member" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
