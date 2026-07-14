"use client";
import { useEffect, useRef } from "react";
import RevealOnScroll from "./RevealOnScroll";

function StatCell({ target, prefix, suffix, label, delayClass }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function animate() {
      const start = performance.now();
      const dur = 1800;
      function step(ts) {
        const p = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const cur = Math.round(ease * target);
        el.innerHTML = (prefix ? `<em>${prefix}</em>` : "") + cur + (suffix ? `<em>${suffix}</em>` : "");
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    el.addEventListener("hydra-animate-count", animate, { once: true });
    return () => el.removeEventListener("hydra-animate-count", animate);
  }, [target, prefix, suffix]);

  return (
    <RevealOnScroll as="div" className="stat-cell" delayClass={delayClass}>
      <span className="stat-num" data-target={target} ref={ref}>
        {prefix ? <em>{prefix}</em> : null}
        0
        {suffix ? <em>{suffix}</em> : null}
      </span>
      <span className="stat-lbl">{label}</span>
    </RevealOnScroll>
  );
}

export default function StatsBar() {
  return (
    <div id="stats-bar">
      <div className="stats-grid sec-inner" style={{ maxWidth: "100%" }}>
        <StatCell target={300} prefix="+" label="Projects Completed" />
        <StatCell target={50} prefix="+" label="Clients Served" delayClass="d1" />
        <StatCell target={10} suffix="M+" label="Total Views" delayClass="d2" />
        <StatCell target={98} suffix="%" label="Client Satisfaction" delayClass="d3" />
      </div>
    </div>
  );
}
