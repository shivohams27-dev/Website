"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function InitialLoader({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"bouncing" | "splash" | "text" | "exit" | "done">("bouncing");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
    
    // Total bounce time = 1.5s + stagger = ~1.8s
    const t1 = setTimeout(() => setPhase("splash"), 1800);
    const t2 = setTimeout(() => setPhase("text"), 2100);
    const t3 = setTimeout(() => setPhase("exit"), 3200);
    const t4 = setTimeout(() => setPhase("done"), 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (!mounted) return <div className="fixed inset-0 z-50 bg-[#0a0a0a]" />; // Prevent SSR flash

  return (
    <>
      <AnimatePresence>
        {phase !== "exit" && phase !== "done" && (
          <motion.div
            key="loader-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
          >
            {phase === "bouncing" && (
              <div className="relative w-[200px] h-[80px]">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -60, scaleX: 1, scaleY: 1, borderRadius: "50%" }}
                    animate={{ 
                      y: [-60, 20, -60], 
                      scaleX: [1, 1.4, 1],
                      scaleY: [1, 0.6, 1],
                      borderRadius: ["50%", "50% 50% 25% 25%", "50%"]
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: 2, 
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                    className={`absolute w-6 h-6 bg-white ${i === 0 ? "left-[10%]" : i === 1 ? "left-[45%]" : "right-[10%]"}`}
                    style={{ transformOrigin: "bottom" }}
                  />
                ))}
              </div>
            )}

            {phase === "splash" && (
              <motion.div
                initial={{ scale: 0, opacity: 1, borderRadius: "50%" }}
                animate={{ scale: [0, 8, 20], opacity: [1, 0.8, 0] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute w-12 h-12 bg-white/20 rounded-full blur-sm"
              />
            )}

            {(phase === "splash" || phase === "text") && (
              <motion.h1
                layoutId="hero-title"
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-syne text-5xl md:text-7xl font-bold text-text-primary absolute z-10 tracking-tight"
              >
                Shivoham Lab
              </motion.h1>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div 
        className="w-full h-full"
        style={{ 
          opacity: (phase === "exit" || phase === "done") ? 1 : 0, 
          transition: "opacity 0.8s ease",
          pointerEvents: (phase === "exit" || phase === "done") ? "auto" : "none"
        }}
      >
        {(phase === "exit" || phase === "done") && children}
      </div>
    </>
  );
}
