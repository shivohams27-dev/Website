"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight, ExternalLink, MessageSquare, MessageCircle, ClipboardList, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, YoutubeIcon, XIcon } from "./Icons";
import { SiteConfig } from "@/lib/types";

export function Contact({ config }: { config: SiteConfig }) {
  const getSocialIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("github")) return GithubIcon;
    if (l.includes("linkedin")) return LinkedinIcon;
    if (l.includes("instagram") || l.includes("insta")) return InstagramIcon;
    if (l.includes("youtube")) return YoutubeIcon;
    if (l.includes("twitter") || l.includes("x.com") || l.match(/^x$/i)) return XIcon;
    if (l.includes("mail") || l.includes("email")) return Mail;
    return ExternalLink;
  };

  const socialLinks = config?.social_links || [
    { label: "GitHub", url: "https://github.com/Shivoham-Lab" },
    { label: "LinkedIn", url: "https://linkedin.com/company/shivoham-lab" },
    { label: "Email", url: "mailto:shivoham.s27@gmail.com" },
  ];

  return (
    <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-border/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-jetbrains text-text-muted text-sm tracking-widest uppercase mb-4 block">
          05 / Contact
        </span>
        <h2 className="font-syne text-4xl md:text-5xl text-text-primary mb-12">Connect with us.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1 - Socials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-8 flex flex-col h-full"
          >
            <h3 className="font-syne text-2xl text-text-primary mb-8">Find us online</h3>
            <div className="flex flex-col gap-4">
              {socialLinks.map((link, i) => {
                const Icon = getSocialIcon(link.label);
                return (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 rounded-lg bg-[#111] border border-border hover:bg-[#222] transition-colors"
                  >
                    <div className="flex items-center gap-4 text-text-muted group-hover:text-accent transition-colors">
                      <Icon className="w-5 h-5" />
                      <span className="font-dm font-medium">{link.label}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Card 2 - Community */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-8 flex flex-col h-full relative overflow-hidden"
          >
            {/* Subtle glow background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <h3 className="font-syne text-2xl text-text-primary mb-4 relative z-10">Join the Community</h3>
            <p className="font-dm text-text-muted leading-relaxed mb-8 flex-grow relative z-10">
              {config?.community_description || "Join our community to get updates, discuss research, and collaborate with us."}
            </p>
            
            <div className="flex flex-col gap-3 relative z-10 w-full">
              {config?.discord_url && (
                <a
                  href={config.discord_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#5865F2] text-white font-dm font-semibold px-6 py-3 rounded-lg hover:bg-[#4752C4] transition-colors w-full"
                >
                  <MessageSquare className="w-5 h-5" /> Join Discord
                </a>
              )}
              {config?.whatsapp_url && (
                <a
                  href={config.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-dm font-semibold px-6 py-3 rounded-lg hover:bg-[#20bd5a] transition-colors w-full"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Group
                </a>
              )}
              {config?.form_url && (
                <a
                  href={config.form_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-accent text-[#0a0a0a] font-dm font-semibold px-6 py-3 rounded-lg hover:bg-white transition-colors w-full"
                >
                  <ClipboardList className="w-5 h-5" /> Application Form
                </a>
              )}
              {config?.telegram_url && (
                <a
                  href={config.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#229ED9] text-white font-dm font-semibold px-6 py-3 rounded-lg hover:bg-[#1f8ec4] transition-colors w-full"
                >
                  <Send className="w-5 h-5" /> Telegram Channel
                </a>
              )}
              {config?.custom_links?.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#111] text-white border border-border font-dm font-semibold px-6 py-3 rounded-lg hover:bg-[#222] transition-colors w-full"
                >
                  <ExternalLink className="w-5 h-5" /> {link.label}
                </a>
              ))}
              {!config?.discord_url && !config?.whatsapp_url && !config?.form_url && !config?.telegram_url && (!config?.custom_links || config.custom_links.length === 0) && config?.community_url && (
                <a
                  href={config.community_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-accent text-[#0a0a0a] font-dm font-semibold px-6 py-3 rounded-lg hover:bg-white transition-colors w-full relative z-10"
                >
                  Join Now <ArrowRight className="w-5 h-5" />
                </a>
              )}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
