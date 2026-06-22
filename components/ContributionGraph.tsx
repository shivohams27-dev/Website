"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "./Icons";
import { Member } from "@/lib/types";
import Matter from "matter-js";

const { Engine, Runner, Bodies, Composite, Events, Body, Query } = Matter;

const BUBBLE_COLORS = ["#f43f5e", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#0ea5e9"];
const BG_COLOR = "#080b11";

interface ContributionGraphProps {
  contributors: Member[];
}

export function ContributionGraph({ contributors }: ContributionGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bubblesRef = useRef<Matter.Body[]>([]);
  const animFrameRef = useRef<number>(0);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const hoveredRef = useRef<number>(-1);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 500 });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getCachedImage = useCallback((src: string): HTMLImageElement => {
    const cache = imageCacheRef.current;
    if (cache.has(src)) return cache.get(src)!;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    cache.set(src, img);
    return img;
  }, []);

  const cleanup = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (runnerRef.current) {
      try { Runner.stop(runnerRef.current); } catch {}
    }
    if (engineRef.current) {
      try { Engine.clear(engineRef.current); } catch {}
    }
    engineRef.current = null;
    runnerRef.current = null;
    bubblesRef.current = [];
  }, []);

  useEffect(() => {
    if (!canvasRef.current || contributors.length === 0) return;

    cleanup();

    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const w = container ? container.clientWidth : 600;
    const h = Math.min(w * 0.82, 520);
    setCanvasSize({ w, h });

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const engine = Engine.create();
    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;
    engineRef.current = engine;

    const boundaryRadius = Math.min(140 + contributors.length * 8, Math.min(w, h) * 0.44);
    const cx = w / 2;
    const cy = h / 2;
    const segments = 64;
    const thickness = 10;
    const angleStep = (Math.PI * 2) / segments;

    for (let i = 0; i < segments; i++) {
      const midAngle = angleStep * i + angleStep / 2;
      const segLen = Math.sin(angleStep / 2) * boundaryRadius * 2 + thickness;
      const bx = cx + Math.cos(midAngle) * boundaryRadius;
      const by = cy + Math.sin(midAngle) * boundaryRadius;
      Composite.add(
        engine.world,
        Bodies.rectangle(bx, by, segLen, thickness, {
          isStatic: true,
          angle: midAngle + Math.PI / 2,
          friction: 0,
          restitution: 1,
          render: { visible: false },
        })
      );
    }

    const bubbleBodies: Matter.Body[] = [];
    const maxBubbleR = Math.max(32, boundaryRadius * 0.16);
    const minBubbleR = Math.max(24, maxBubbleR * 0.7);

    contributors.forEach((member, i) => {
      const radius = minBubbleR + Math.random() * (maxBubbleR - minBubbleR);
      const angle = (Math.PI * 2 * i) / contributors.length + (Math.random() - 0.5) * 0.4;
      const dist = Math.random() * boundaryRadius * 0.4;
      const startX = cx + Math.cos(angle) * dist;
      const startY = cy + Math.sin(angle) * dist;

      const bubble = Bodies.circle(startX, startY, radius, {
        restitution: 1,
        friction: 0,
        frictionAir: 0,
        render: { visible: false },
      });
      (bubble as any).customData = { member, radius, color: BUBBLE_COLORS[i % BUBBLE_COLORS.length] };

      const force = 0.006 * bubble.mass;
      Body.applyForce(bubble, bubble.position, {
        x: (Math.random() - 0.5) * force,
        y: (Math.random() - 0.5) * force,
      });

      bubbleBodies.push(bubble);
    });
    bubblesRef.current = bubbleBodies;
    Composite.add(engine.world, bubbleBodies);

    Events.on(engine, "beforeUpdate", () => {
      bubbleBodies.forEach((b) => {
        if (b.speed < 0.5) {
          Body.applyForce(b, b.position, {
            x: (Math.random() - 0.5) * 0.0002 * b.mass,
            y: (Math.random() - 0.5) * 0.0002 * b.mass,
          });
        }
        const maxSpeed = 1.5;
        if (b.speed > maxSpeed) {
          const scale = maxSpeed / b.speed;
          Body.setVelocity(b, { x: b.velocity.x * scale, y: b.velocity.y * scale });
        }
      });
    });

    const draw = () => {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, w, h);

      const time = Date.now() * 0.001;
      const pulse = 0.25 + Math.sin(time * 0.8) * 0.08;

      ctx.beginPath();
      ctx.arc(cx, cy, boundaryRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(77, 163, 255, ${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, boundaryRadius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(77, 163, 255, ${pulse * 0.3})`;
      ctx.lineWidth = 6;
      ctx.filter = "blur(4px)";
      ctx.stroke();
      ctx.filter = "none";

      ctx.beginPath();
      ctx.arc(cx, cy, boundaryRadius - 1, 0, Math.PI * 2);
      const innerGrad = ctx.createRadialGradient(cx, cy, boundaryRadius * 0.2, cx, cy, boundaryRadius);
      innerGrad.addColorStop(0, "rgba(77, 163, 255, 0.02)");
      innerGrad.addColorStop(1, "rgba(77, 163, 255, 0.06)");
      ctx.fillStyle = innerGrad;
      ctx.fill();

      bubbleBodies.forEach((b, idx) => {
        const data = (b as any).customData;
        if (!data) return;
        const { member, radius, color } = data;
        const { x, y } = b.position;
        const isHovered = hoveredRef.current === idx;

        ctx.save();

        if (isHovered) {
          for (let g = 0; g < 3; g++) {
            ctx.beginPath();
            ctx.arc(x, y, radius + 3 + g * 3, 0, Math.PI * 2);
            ctx.strokeStyle = `${color}${Math.round((0.35 - g * 0.1) * 255)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          ctx.shadowColor = color;
          ctx.shadowBlur = 20;
        } else {
          ctx.shadowColor = "rgba(0,0,0,0.4)";
          ctx.shadowBlur = 8;
          ctx.shadowOffsetY = 3;
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        const grad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
        if (isHovered) {
          grad.addColorStop(0, lightenColor(color, 30));
          grad.addColorStop(1, color);
        } else {
          grad.addColorStop(0, lightenColor(color, 15));
          grad.addColorStop(1, darkenColor(color, 15));
        }
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        ctx.beginPath();
        ctx.arc(x, y, radius - 1, 0, Math.PI * 2);
        const highlight = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.35, 0, x, y, radius);
        highlight.addColorStop(0, "rgba(255,255,255,0.18)");
        highlight.addColorStop(0.5, "rgba(255,255,255,0.04)");
        highlight.addColorStop(1, "rgba(0,0,0,0.12)");
        ctx.fillStyle = highlight;
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius - 2, 0, Math.PI * 2);
        ctx.clip();

        const initials = getInitials(member.name);
        const fontSize = Math.max(10, radius * 0.5);
        ctx.font = `600 ${fontSize}px "DM Sans", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (member.profile_pic) {
          const img = getCachedImage(member.profile_pic);
          if (img.complete && img.naturalWidth > 0) {
            const size = (radius - 2) * 2;
            ctx.drawImage(img, x - radius + 2, y - radius + 2, size, size);
            ctx.fillStyle = "rgba(8, 11, 17, 0.4)";
            ctx.fillRect(x - radius + 2, y - radius + 2, size, size);
            ctx.fillStyle = "#f7f9fc";
            ctx.fillText(initials, x, y);
          } else {
            ctx.fillStyle = darkenColor(color, 30);
            ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
            ctx.fillStyle = "#f7f9fc";
            ctx.fillText(initials, x, y);
          }
        } else {
          ctx.fillStyle = "#f7f9fc";
          ctx.fillText(initials, x, y);
        }

        ctx.restore();

        ctx.beginPath();
        ctx.arc(x, y, radius - 1, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)";
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        ctx.restore();
      });

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    const runner = Runner.create();
    Runner.run(runner, engine);
    runnerRef.current = runner;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * w;
      const my = ((e.clientY - rect.top) / rect.height) * h;
      const hits = Query.point(bubbleBodies, { x: mx, y: my });
      hoveredRef.current = hits.length > 0 ? bubbleBodies.indexOf(hits[0]) : -1;
      canvas.style.cursor = hits.length > 0 ? "pointer" : "default";
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * w;
      const my = ((e.clientY - rect.top) / rect.height) * h;
      const hits = Query.point(bubbleBodies, { x: mx, y: my });
      if (hits.length > 0) {
        const data = (hits[0] as any).customData;
        if (data) {
          Runner.stop(runner);
          cancelAnimationFrame(animFrameRef.current);
          setSelectedMember(data.member);
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleClick);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleClick);
      cleanup();
    };
  }, [contributors, cleanup, getCachedImage]);

  const closeModal = () => {
    setSelectedMember(null);
    if (runnerRef.current && engineRef.current) {
      Runner.run(runnerRef.current, engineRef.current);
      const canvas = canvasRef.current;
      if (canvas) {
        const container = canvas.parentElement;
        const w = container ? container.clientWidth : 600;
        const h = Math.min(w * 0.82, 520);
        const dpr = window.devicePixelRatio || 1;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const draw = () => {
            ctx.save();
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = BG_COLOR;
            ctx.fillRect(0, 0, w, h);
            ctx.restore();

            const bubbles = bubblesRef.current;
            ctx.save();
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const time = Date.now() * 0.001;
            const pulse = 0.25 + Math.sin(time * 0.8) * 0.08;
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, Math.min(140 + bubbles.length * 8, Math.min(w, h) * 0.44), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(77, 163, 255, ${pulse})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            bubbles.forEach((b, idx) => {
              const data = (b as any).customData;
              if (!data) return;
              const { member, radius, color } = data;
              const { x, y } = b.position;

              ctx.save();
              ctx.shadowColor = "rgba(0,0,0,0.4)";
              ctx.shadowBlur = 8;
              ctx.shadowOffsetY = 3;

              ctx.beginPath();
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              const grad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
              grad.addColorStop(0, lightenColor(color, 15));
              grad.addColorStop(1, darkenColor(color, 15));
              ctx.fillStyle = grad;
              ctx.fill();

              ctx.shadowColor = "transparent";
              ctx.shadowBlur = 0;
              ctx.shadowOffsetY = 0;

              ctx.beginPath();
              ctx.arc(x, y, radius - 1, 0, Math.PI * 2);
              const highlight = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.35, 0, x, y, radius);
              highlight.addColorStop(0, "rgba(255,255,255,0.18)");
              highlight.addColorStop(0.5, "rgba(255,255,255,0.04)");
              highlight.addColorStop(1, "rgba(0,0,0,0.12)");
              ctx.fillStyle = highlight;
              ctx.fill();

              ctx.save();
              ctx.beginPath();
              ctx.arc(x, y, radius - 2, 0, Math.PI * 2);
              ctx.clip();

              const initials = getInitials(member.name);
              const fontSize = Math.max(10, radius * 0.5);
              ctx.font = `600 ${fontSize}px "DM Sans", sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";

              if (member.profile_pic) {
                const img = getCachedImage(member.profile_pic);
                if (img.complete && img.naturalWidth > 0) {
                  const size = (radius - 2) * 2;
                  ctx.drawImage(img, x - radius + 2, y - radius + 2, size, size);
                  ctx.fillStyle = "rgba(8, 11, 17, 0.4)";
                  ctx.fillRect(x - radius + 2, y - radius + 2, size, size);
                  ctx.fillStyle = "#f7f9fc";
                  ctx.fillText(initials, x, y);
                } else {
                  ctx.fillStyle = darkenColor(color, 30);
                  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
                  ctx.fillStyle = "#f7f9fc";
                  ctx.fillText(initials, x, y);
                }
              } else {
                ctx.fillStyle = "#f7f9fc";
                ctx.fillText(initials, x, y);
              }
              ctx.restore();

              ctx.beginPath();
              ctx.arc(x, y, radius - 1, 0, Math.PI * 2);
              ctx.strokeStyle = "rgba(255,255,255,0.08)";
              ctx.lineWidth = 1;
              ctx.stroke();

              ctx.restore();
            });

            ctx.restore();
            animFrameRef.current = requestAnimationFrame(draw);
          };
          animFrameRef.current = requestAnimationFrame(draw);
        }
      }
    }
  };

  if (contributors.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-white/8" />
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-accent-soft">
          Contributors
        </span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      <div className="relative flex justify-center">
        <div className="relative" style={{ width: "100%", maxWidth: canvasSize.w }}>
          <canvas
            ref={canvasRef}
            style={{ width: canvasSize.w, height: canvasSize.h, borderRadius: "1rem" }}
          />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-[#0a0e15]/80 backdrop-blur-sm border border-white/8 px-4 py-2">
            <span className="font-jetbrains text-[10px] uppercase tracking-[0.12em] text-text-muted">
              Click a bubble for profile
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              className="fixed inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            </motion.div>

            <motion.div
              className="fixed z-50 top-1/2 left-1/2 w-[min(90vw,36rem)] rounded-3xl border border-[#e69f58]/20 bg-[#16181b] shadow-[0_0_60px_rgba(230,159,88,0.08)]"
              style={{ x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-muted transition-colors hover:border-white/20 hover:text-white z-10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="p-8">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center gap-3 w-28 shrink-0">
                    {selectedMember.profile_pic ? (
                      <img
                        src={selectedMember.profile_pic}
                        alt={selectedMember.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-[#e69f58]"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-2 border-[#e69f58] bg-[#212328] flex items-center justify-center">
                        <span className="font-syne text-2xl font-semibold text-white">
                          {getInitials(selectedMember.name)}
                        </span>
                      </div>
                    )}
                    <span className="font-jetbrains text-[10px] uppercase tracking-[0.12em] text-text-muted text-center">
                      @{selectedMember.username}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <div className="rounded-xl bg-[#212328] px-4 py-3 text-center">
                      <span className="font-dm text-sm text-[#e69f58] font-medium">{selectedMember.role}</span>
                    </div>
                    <div className="rounded-xl bg-[#212328] px-4 py-3 text-center">
                      <span className="font-syne text-lg font-semibold text-white">{selectedMember.name}</span>
                    </div>
                    {selectedMember.description && (
                      <div className="rounded-xl bg-[#212328] px-4 py-3 text-left">
                        <p className="font-dm text-sm leading-6 text-text-muted">{selectedMember.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  {selectedMember.linkedin_url && (
                    <a href={selectedMember.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0077B5] text-white transition-transform hover:scale-110">
                      <LinkedinIcon className="h-5 w-5" />
                    </a>
                  )}
                  {selectedMember.instagram_url && (
                    <a href={selectedMember.instagram_url} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white transition-transform hover:scale-110">
                      <InstagramIcon className="h-5 w-5" />
                    </a>
                  )}
                  {selectedMember.github_url && (
                    <a href={selectedMember.github_url} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-black transition-transform hover:scale-110">
                      <GithubIcon className="h-5 w-5" />
                    </a>
                  )}
                  {selectedMember.custom_link_url && (
                    <a href={selectedMember.custom_link_url} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-white border border-white/10 transition-transform hover:scale-110">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function lightenColor(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `rgb(${r},${g},${b})`;
}

function darkenColor(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `rgb(${r},${g},${b})`;
}
