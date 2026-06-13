"use client";

import { useState, useEffect } from "react";
import { LogOut, Home } from "lucide-react";
import Link from "next/link";
import { useToast } from "./Toast";
import { SiteConfig } from "@/lib/types";
import { ProjectsTab } from "./admin/ProjectsTab";
import { ResearchTab } from "./admin/ResearchTab";
import { TeamTab } from "./admin/TeamTab";
import { StagesTab } from "./admin/StagesTab";

export function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("General");
  const { toast } = useToast();
  
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    if (activeTab === "General") {
      setLoading(true);
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        setConfig(data);
      } catch (e) {
        toast("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConfigSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) toast("Saved ✓", "success");
      else toast("Failed to save", "error");
    } catch (err) {
      toast("Error saving", "error");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border bg-card">
        <div className="flex items-center gap-6">
          <h2 className="font-syne text-2xl font-bold text-text-primary">Towerhall Control Panel</h2>
          <Link href="/" className="text-text-muted hover:text-accent transition-colors flex items-center gap-2 font-dm text-sm">
            <Home className="w-4 h-4" /> View Site
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="text-text-muted hover:text-red-500 transition-colors flex items-center gap-2 font-dm text-sm bg-[#111] px-4 py-2 rounded-lg border border-border">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-border px-6 bg-card">
        {["General", "Projects", "Research", "Team", "Stages"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-jetbrains text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab ? "border-accent text-accent" : "border-transparent text-text-muted hover:text-white hover:border-border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-grow p-6 md:p-12 max-w-5xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div></div>
        ) : (
          <>
            {activeTab === "General" && config && (
              <form onSubmit={handleConfigSave} className="flex flex-col gap-6 max-w-2xl">
                <div>
                  <label className="block font-jetbrains text-xs text-text-muted mb-2">Hero Tagline</label>
                  <input type="text" value={config.hero_tagline || ""} onChange={e => setConfig({...config, hero_tagline: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block font-jetbrains text-xs text-text-muted mb-2">Hero About</label>
                  <textarea rows={4} value={config.hero_about || ""} onChange={e => setConfig({...config, hero_about: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block font-jetbrains text-xs text-text-muted mb-2">Join Lab URL</label>
                  <input type="text" value={config.join_lab_url || ""} onChange={e => setConfig({...config, join_lab_url: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block font-jetbrains text-xs text-text-muted mb-2">Community Description</label>
                  <textarea rows={3} value={config.community_description || ""} onChange={e => setConfig({...config, community_description: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block font-jetbrains text-xs text-text-muted mb-2">Discord URL</label>
                  <input type="text" value={config.discord_url || ""} onChange={e => setConfig({...config, discord_url: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block font-jetbrains text-xs text-text-muted mb-2">WhatsApp Group URL</label>
                  <input type="text" value={config.whatsapp_url || ""} onChange={e => setConfig({...config, whatsapp_url: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block font-jetbrains text-xs text-text-muted mb-2">Joining Form URL</label>
                  <input type="text" value={config.form_url || ""} onChange={e => setConfig({...config, form_url: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
                </div>
                <button type="submit" className="bg-accent text-black font-semibold py-3 rounded-lg hover:bg-white transition-colors mt-4">
                  Save General Settings
                </button>
              </form>
            )}

            {activeTab === "Projects" && <ProjectsTab />}
            {activeTab === "Research" && <ResearchTab />}
            {activeTab === "Team" && <TeamTab />}
            {activeTab === "Stages" && <StagesTab />}
          </>
        )}
      </div>
    </div>
  );
}
