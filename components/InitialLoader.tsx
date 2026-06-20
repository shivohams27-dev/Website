"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function InitialLoader({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = window.setTimeout(() => setVisible(false), 1750);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#050608]"
          >
            <div className="relative h-20 w-52">
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  initial={{ y: -48, scaleX: 1, scaleY: 1 }}
                  animate={{
                    y: [-48, 22, -48],
                    scaleX: [1, 1.35, 1],
                    scaleY: [1, 0.65, 1],
                  }}
                  transition={{
                    duration: 0.55,
                    repeat: 2,
                    delay: index * 0.14,
                    ease: "easeInOut",
                  }}
                  className={`absolute top-1 h-5 w-5 rounded-full ${
                    index === 0 ? "left-8 bg-white" : index === 1 ? "left-[calc(50%_-_0.625rem)] bg-accent" : "right-8 bg-white"
                  }`}
                  style={{ transformOrigin: "bottom" }}
                />
              ))}
              <div className="absolute inset-x-5 bottom-2 h-px bg-blue-300/10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={visible ? "h-screen overflow-hidden" : ""}>{children}</div>
    </>
  );
}
