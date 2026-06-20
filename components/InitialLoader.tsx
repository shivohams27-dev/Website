"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LoadingCtx = createContext(true);
export const useLoading = () => useContext(LoadingCtx);

export function InitialLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"dots" | "title">("dots");

  useEffect(() => {
    window.scrollTo(0, 0);
    const t1 = setTimeout(() => setPhase("title"), 1500);
    const t2 = setTimeout(() => setLoading(false), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <LoadingCtx.Provider value={loading}>
      <div className={loading ? "h-screen overflow-hidden" : ""}>
        {children}
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            exit={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none fixed inset-0 z-50"
          >
            <motion.div
              className="absolute inset-0 bg-[#050608]"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            <div className="relative flex h-full items-center justify-center">
              <div className="absolute h-20 w-52">
                {[0, 1, 2].map((index) => {
                  const convergeX =
                    index === 0 ? 62 : index === 2 ? -62 : 0;
                  return (
                    <motion.span
                      key={index}
                      initial={{ y: -48, scaleX: 1, scaleY: 1 }}
                      animate={
                        phase === "dots"
                          ? {
                              y: [-48, 22, -48],
                              scaleX: [1, 1.35, 1],
                              scaleY: [1, 0.65, 1],
                            }
                          : {
                              x: convergeX,
                              y: 0,
                              scale: 0,
                              opacity: 0,
                            }
                      }
                      transition={
                        phase === "dots"
                          ? {
                              duration: 0.55,
                              repeat: 2,
                              delay: index * 0.14,
                              ease: "easeInOut",
                            }
                          : { duration: 0.35, ease: "easeIn" }
                      }
                      className={`absolute top-1 h-5 w-5 rounded-full ${
                        index === 0
                          ? "left-8 bg-white"
                          : index === 1
                            ? "left-[calc(50%_-_0.625rem)] bg-accent"
                            : "right-8 bg-white"
                      }`}
                      style={{ transformOrigin: "bottom" }}
                    />
                  );
                })}
                <motion.div
                  className="absolute inset-x-5 bottom-2 h-px bg-blue-300/10"
                  animate={phase === "dots" ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <motion.div
                layoutId="site-title"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  phase === "title"
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute"
              >
                <span className="tracking-tight text-[clamp(3rem,8vw,6rem)] font-semibold text-white font-syne">
                  Shivoham Lab
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingCtx.Provider>
  );
}
