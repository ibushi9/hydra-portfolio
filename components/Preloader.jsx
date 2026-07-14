"use client";
import { useEffect, useRef, useState } from "react";

export default function Preloader() {
  const barRef = useRef(null);
  const pctRef = useRef(null);
  const [hide, setHide] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    let p = 0;
    let start = null;
    let done = false;
    let raf;

    function step(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      p = elapsed < 1200 ? (elapsed / 1200) * 70 : 70 + ((elapsed - 1200) / 1800) * 28;
      p = Math.min(p, 98);
      if (barRef.current) barRef.current.style.width = p + "%";
      if (pctRef.current) pctRef.current.textContent = Math.floor(p) + "%";
      if (!done) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    function onLoad() {
      done = true;
      if (barRef.current) barRef.current.style.width = "100%";
      if (pctRef.current) pctRef.current.textContent = "100%";
      setTimeout(() => {
        document.getElementById("curtain")?.classList.add("run");
        setTimeout(() => {
          setHide(true);
          document.body.classList.remove("lock");
          document.body.classList.add("loaded");
          setTimeout(() => setRemoved(true), 900);
          document.querySelectorAll("[data-target]").forEach((el) => {
            el.dispatchEvent(new Event("hydra-animate-count"));
          });
        }, 550);
      }, 500);
    }

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (removed) return <div className="ld-curtain" id="curtain" />;

  return (
    <>
      <div id="loader" className={hide ? "hide" : ""}>
        <div className="ld-box">
          <div className="ld-logo-wrap">
            <div className="ld-logo">HYDRA</div>
          </div>
          <div className="ld-line" />
          <div className="ld-sub">Creative Company — Niigata, Japan</div>
          <div className="ld-pct" ref={pctRef}>
            0%
          </div>
          <div className="ld-bar-wrap">
            <div className="ld-bar" ref={barRef} />
          </div>
        </div>
      </div>
      <div className="ld-curtain" id="curtain" />
    </>
  );
}
