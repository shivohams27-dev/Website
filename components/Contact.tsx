"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Mail, MessageCircle, Send, Users } from "lucide-react";
import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon } from "./Icons";
import { SiteConfig } from "@/lib/types";

export function Contact({ config }: { config: SiteConfig }) {
  const getSocialIcon = (label: string) => {
    const value = label.toLowerCase();
    if (value.includes("github")) return GithubIcon;
    if (value.includes("linkedin")) return LinkedinIcon;
    if (value.includes("instagram")) return InstagramIcon;
    if (value.includes("youtube")) return YoutubeIcon;
    if (value.includes("twitter") || value === "x") return XIcon;
    if (value.includes("mail") || value.includes("email")) return Mail;
    return ExternalLink;
  };

  const socialLinks = config?.social_links || [
    { label: "GitHub", url: "https://github.com/Shivoham-Lab" },
    { label: "LinkedIn", url: "https://linkedin.com/company/shivoham-lab" },
    { label: "Email", url: "mailto:shivoham.s27@gmail.com" },
    { label: "YouTube", url: "https://youtube.com/@ShivohamLab" },
  ];

  const communityLinks = [
    config?.discord_url && { label: "Discord", url: config.discord_url, icon: Users },
    config?.telegram_url && { label: "Telegram", url: config.telegram_url, icon: Send },
    config?.whatsapp_url && { label: "WhatsApp", url: config.whatsapp_url, icon: MessageCircle },
    config?.form_url && { label: "Application form", url: config.form_url, icon: ExternalLink },
    ...(config?.custom_links || []).map((link) => ({ ...link, icon: ExternalLink })),
  ].filter(Boolean) as { label: string; url: string; icon: typeof ExternalLink }[];

  if (!communityLinks.length && config?.community_url) {
    communityLinks.push({ label: "Join the community", url: config.community_url, icon: Users });
  }

  return (
    <section id="contact" className="relative overflow-hidden border-t border-blue-400/15 bg-[#07090d] text-text-primary">
      <div className="section-shell">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
          <div className="section-kicker">05 / Contact</div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
            <h2 className="font-syne text-[clamp(3.5rem,8vw,7.5rem)] font-semibold leading-[0.84] tracking-[-0.07em]">
              Talk to <span className="text-accent">the lab.</span>
            </h2>
            <p className="max-w-sm font-dm text-sm leading-7 text-text-muted lg:pb-2">
              {config?.community_description || "Join our community to get updates, discuss research, and collaborate with us."}
            </p>
          </div>

          <div className="mt-16 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[1.25rem] border border-blue-300/10 bg-[#0a0d12] p-6 md:p-8">
              <span className="font-jetbrains text-[9px] uppercase tracking-[0.16em] text-text-muted">Find the lab</span>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.label);
                  return (
                    <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-xl border border-white/10 bg-[#0e1219] p-4 transition-all hover:-translate-y-0.5 hover:border-blue-400/40 hover:bg-[#111722]">
                      <span className="flex items-center gap-3 font-dm text-sm font-medium">
                        <Icon className="h-4 w-4 text-accent-soft" />
                        {link.label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-blue-400/25 bg-[#0b1018] p-6 text-white shadow-2xl shadow-black/20 md:p-8">
              <div className="flex items-center justify-between">
                <span className="font-jetbrains text-[9px] uppercase tracking-[0.16em] text-text-muted">Work and community</span>
                <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_14px_var(--accent)]" />
              </div>
              <div className="mt-6 space-y-2">
                {communityLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-xl border border-white/10 px-4 py-4 transition-colors hover:border-accent/50 hover:bg-white/[0.04]">
                      <span className="flex items-center gap-3 font-dm text-sm">
                        <Icon className="h-4 w-4 text-accent-soft" />
                        {link.label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <footer className="mt-24 flex flex-col items-center gap-3 pb-10 pt-10 text-center font-jetbrains text-[10px] uppercase tracking-[0.14em] text-text-muted/60 sm:flex-row sm:justify-between">
            <span>&copy; {new Date().getFullYear()} Shivoham Lab</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>Built openly. Maintained independently.</span>
          </footer>
        </motion.div>
      </div>
    </section>
  );
}
