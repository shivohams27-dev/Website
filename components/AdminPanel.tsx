"use client";

import { useState, useEffect } from "react";
import { LogOut, Home, Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { useToast } from "./Toast";
import { SiteConfig } from "@/lib/types";
import { ProjectsTab } from "./admin/ProjectsTab";
import { ResearchTab } from "./admin/ResearchTab";
import { TeamTab } from "./admin/TeamTab";
import { StagesTab } from "./admin/StagesTab";
import { MembersTab } from "./admin/MembersTab";

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
        {["General", "Projects", "Research", "Team", "Members", "Stages"].map(tab => (
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
                <div>
                  <label className="block font-jetbrains text-xs text-text-muted mb-2">Telegram Channel URL</label>
                  <input type="text" value={config.telegram_url || ""} onChange={e => setConfig({...config, telegram_url: e.target.value})} className="w-full bg-card border border-border rounded-lg p-3 text-text-primary focus:border-accent outline-none" />
                </div>

                <div className="pt-4 border-t border-border mt-2">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block font-jetbrains text-xs text-text-muted">Custom Community Links</label>
                    <button 
                      type="button" 
                      onClick={() => {
                        const newLinks = [...(config.custom_links || []), { label: "", url: "" }];
                        setConfig({...config, custom_links: newLinks});
                      }}
                      className="text-xs flex items-center gap-1 text-accent hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add Link
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {config.custom_links?.map((link, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text" 
                            placeholder="Link Label (e.g. YouTube)" 
                            value={link.label} 
                            onChange={e => {
                              const newLinks = [...config.custom_links!];
                              newLinks[idx].label = e.target.value;
                              setConfig({...config, custom_links: newLinks});
                            }} 
                            className="w-full bg-[#111] border border-border rounded-lg p-2 text-sm text-text-primary focus:border-accent outline-none" 
                          />
                          <input 
                            type="text" 
                            placeholder="URL (e.g. https://youtube.com/...)" 
                            value={link.url} 
                            onChange={e => {
                              const newLinks = [...config.custom_links!];
                              newLinks[idx].url = e.target.value;
                              setConfig({...config, custom_links: newLinks});
                            }} 
                            className="w-full bg-[#111] border border-border rounded-lg p-2 text-sm text-text-primary focus:border-accent outline-none" 
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => {
                            const newLinks = config.custom_links!.filter((_, i) => i !== idx);
                            setConfig({...config, custom_links: newLinks});
                          }}
                          className="p-2 text-text-muted hover:text-red-500 transition-colors bg-[#111] border border-border rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!config.custom_links || config.custom_links.length === 0) && (
                      <div className="text-sm text-text-muted text-center p-4 border border-dashed border-border rounded-lg">
                        No custom links added. Click "Add Link" to add one.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border mt-2">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block font-jetbrains text-xs text-text-muted">Find Us Online Links (Socials)</label>
                    <button 
                      type="button" 
                      onClick={() => {
                        const newLinks = [...(config.social_links || []), { label: "", url: "" }];
                        setConfig({...config, social_links: newLinks});
                      }}
                      className="text-xs flex items-center gap-1 text-accent hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add Link
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {config.social_links?.map((link, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const newLinks = [...config.social_links!];
                              [newLinks[idx - 1], newLinks[idx]] = [newLinks[idx], newLinks[idx - 1]];
                              setConfig({...config, social_links: newLinks});
                            }}
                            className={`p-1.5 rounded-lg border border-border transition-colors ${idx === 0 ? "opacity-50 cursor-not-allowed bg-transparent" : "bg-[#111] hover:text-accent"}`}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === config.social_links!.length - 1}
                            onClick={() => {
                              const newLinks = [...config.social_links!];
                              [newLinks[idx], newLinks[idx + 1]] = [newLinks[idx + 1], newLinks[idx]];
                              setConfig({...config, social_links: newLinks});
                            }}
                            className={`p-1.5 rounded-lg border border-border transition-colors ${idx === config.social_links!.length - 1 ? "opacity-50 cursor-not-allowed bg-transparent" : "bg-[#111] hover:text-accent"}`}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text" 
                            placeholder="Link Label (e.g. YouTube)" 
                            value={link.label} 
                            onChange={e => {
                              const newLinks = [...config.social_links!];
                              newLinks[idx].label = e.target.value;
                              setConfig({...config, social_links: newLinks});
                            }} 
                            className="w-full bg-[#111] border border-border rounded-lg p-2 text-sm text-text-primary focus:border-accent outline-none" 
                          />
                          <input 
                            type="text" 
                            placeholder="URL (e.g. https://youtube.com/...)" 
                            value={link.url} 
                            onChange={e => {
                              const newLinks = [...config.social_links!];
                              newLinks[idx].url = e.target.value;
                              setConfig({...config, social_links: newLinks});
                            }} 
                            className="w-full bg-[#111] border border-border rounded-lg p-2 text-sm text-text-primary focus:border-accent outline-none" 
                          />
                          <select
                            value={(link as any).position || "auto"}
                            onChange={e => {
                              const newLinks = [...config.social_links!];
                              (newLinks[idx] as any).position = e.target.value === "auto" ? undefined : e.target.value;
                              setConfig({...config, social_links: newLinks});
                            }}
                            className="w-full bg-[#111] border border-border rounded-lg p-2 text-sm text-text-primary focus:border-accent outline-none"
                          >
                            <option value="auto">Auto (Balanced Layout)</option>
                            <option value="top-left">Top Left</option>
                            <option value="top-mid">Top Middle</option>
                            <option value="top-right">Top Right</option>
                            <option value="mid-right">Middle Right</option>
                            <option value="bot-right">Bottom Right</option>
                            <option value="bot-mid">Bottom Middle</option>
                            <option value="bot-left">Bottom Left</option>
                            <option value="mid-left">Middle Left</option>
                          </select>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => {
                            const newLinks = config.social_links!.filter((_, i) => i !== idx);
                            setConfig({...config, social_links: newLinks});
                          }}
                          className="p-2 text-text-muted hover:text-red-500 transition-colors bg-[#111] border border-border rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!config.social_links || config.social_links.length === 0) && (
                      <div className="text-sm text-text-muted text-center p-4 border border-dashed border-border rounded-lg">
                        No social links added. Click "Add Link" to add one.
                      </div>
                    )}
                  </div>
                </div>
                <button type="submit" className="bg-accent text-black font-semibold py-3 rounded-lg hover:bg-white transition-colors mt-4">
                  Save General Settings
                </button>
              </form>
            )}

            {activeTab === "Projects" && <ProjectsTab />}
            {activeTab === "Research" && <ResearchTab />}
            {activeTab === "Team" && <TeamTab />}
            {activeTab === "Members" && <MembersTab />}
            {activeTab === "Stages" && <StagesTab />}
          </>
        )}
      </div>
    </div>
  );
}
