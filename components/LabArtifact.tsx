"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const systemLayers = [
  { number: "01", title: "Research", detail: "Investigate the problem and document constraints." },
  { number: "02", title: "Prototype", detail: "Build, test, and measure a working system." },
  { number: "03", title: "Deploy", detail: "Release useful tools and maintain them in public." },
];

export function LabArtifact() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="system-model" aria-label="Shivoham Lab research and development process">
      <div className="system-model-grid" aria-hidden="true" />
      <motion.div
        className="system-stack"
        animate={reduceMotion ? undefined : { y: [0, -7, 0], rotateY: [-7, -4, -7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {systemLayers.map((layer, index) => (
          <div key={layer.number} className={`system-layer system-layer-${index + 1}`}>
            <div className="system-layer-index">{layer.number}</div>
            <div>
              <strong>{layer.title}</strong>
              <p>{layer.detail}</p>
            </div>
            <span className="system-layer-state">ACTIVE</span>
          </div>
        ))}

        <div className="system-console">
          <div className="system-console-header">
            <div className="flex items-center gap-3">
              <Image src="/s.png" alt="" width={34} height={34} />
              <div>
                <strong>Shivoham Lab</strong>
                <span>Research system / Bengaluru</span>
              </div>
            </div>
            <span className="system-live">LIVE</span>
          </div>

          <div className="system-console-body">
            <div className="system-console-copy">
              <span>Current focus</span>
              <strong>AI infrastructure and practical software systems.</strong>
            </div>
            <div className="system-metrics">
              <div><span>Projects</span><strong>03</strong></div>
              <div><span>Research</span><strong>OPEN</strong></div>
              <div><span>Mode</span><strong>BUILD</strong></div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="system-model-caption">
        <span>Research → prototype → deployment</span>
        <span>SL / SYSTEM 01</span>
      </div>
    </div>
  );
}
