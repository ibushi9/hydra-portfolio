"use client";
import { useEffect, useRef, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const SW_D = 320, SW_M = 280, GAP = 20, SPEED = 0.45;

function extractTkId(url) {
  const m = url.match(/\/video\/(\d+)/);
  return m ? m[1] : null;
}
function TiltCard({ item }) {
  const cardRef = useRef(null);
  const id = extractTkId(item.url);
  if (!id) return null;

  function onMouseMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-10px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
  }
  function onMouseLeave() {
    const el = cardRef.current;
    if (el) el.style.transform = "";
  }

  return (
    <div className="c-slide">
      <div className="v-card" ref={cardRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <div className="v-badge">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.84-.1z" />
          </svg>
          TIKTOK
        </div>
        <a className="v-open" href={item.url} target="_blank" rel="noopener noreferrer">
          OPEN
          <svg viewBox="0 0 24 24">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </a>
        <iframe
          src={`https://www.tiktok.com/embed/v2/${id}?lang=ja`}
          allow="encrypted-media"
          allowFullScreen
          scrolling="no"
          loading="lazy"
        />
        {item.title ? <div className="v-label">{item.title}</div> : null}
      </div>
    </div>
  );
}

export default function VideoCarousel() {
  const [videos, setVideos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const trackRef = useRef(null);
  const vpRef = useRef(null);
  const [flowing, setFlowing] = useState(true);
  const stateRef = useRef({ setWidth: 0, autoPos: 0, dragOffset: 0, dragging: false, paused: false, resumeTimer: null });

  useEffect(() => {
    fetch("videos.json?v=" + Date.now() + "-" + Math.random(), { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { videos: [] }))
      .then((data) => setVideos(Array.isArray(data.videos) ? data.videos : []))
      .catch(() => setVideos([]))
      .finally(() => setLoaded(true));
  }, []);

  const valid = videos.filter((v) => extractTkId(v.url));
  const reps = valid.length < 3 ? 3 : 2;
  const repeated = Array.from({ length: reps }).flatMap(() => valid);

  useEffect(() => {
    const slideW = (typeof window !== "undefined" && window.innerWidth <= 640 ? SW_M : SW_D) + GAP;
    stateRef.current.setWidth = slideW * valid.length;
    stateRef.current.autoPos = 0;
    stateRef.current.dragOffset = 0;
  }, [valid.length]);

  useEffect(() => {
    let raf;
    function tick() {
      const s = stateRef.current;
      if (!s.dragging && !s.paused && s.setWidth > 0) s.autoPos -= SPEED;
      if (s.setWidth > 0) {
        while (s.autoPos <= -s.setWidth) s.autoPos += s.setWidth;
        while (s.autoPos > 0) s.autoPos -= s.setWidth;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${s.autoPos + s.dragOffset}px,0,0)`;
      }
      setFlowing(!(s.paused || s.dragging));
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function togglePause() {
    stateRef.current.paused = !stateRef.current.paused;
  }
  function seek(dir) {
    const slideW = (window.innerWidth <= 640 ? SW_M : SW_D) + GAP;
    const s = stateRef.current;
    s.autoPos -= dir * slideW;
    s.paused = true;
    clearTimeout(s.resumeTimer);
    s.resumeTimer = setTimeout(() => (s.paused = false), 2500);
  }

  function ds(x) {
    const s = stateRef.current;
    if (!s.setWidth) return;
    s.dragging = true;
    s.startX = x;
    s.dragOffset = 0;
    vpRef.current?.classList.add("drag");
  }
  function dm(x) {
    const s = stateRef.current;
    if (!s.dragging) return;
    s.dragOffset = x - s.startX;
  }
  function de() {
    const s = stateRef.current;
    if (!s.dragging) return;
    s.dragging = false;
    vpRef.current?.classList.remove("drag");
    s.autoPos += s.dragOffset;
    s.dragOffset = 0;
    s.paused = true;
    clearTimeout(s.resumeTimer);
    s.resumeTimer = setTimeout(() => (s.paused = false), 1800);
  }

  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const onMouseDown = (e) => { e.preventDefault(); ds(e.clientX); };
    const onMouseMove = (e) => dm(e.clientX);
    const onMouseUp = () => de();
    const onTouchStart = (e) => ds(e.touches[0].clientX);
    const onTouchMove = (e) => dm(e.touches[0].clientX);
    const onTouchEnd = () => de();
    const onMouseEnter = () => { stateRef.current.paused = true; };
    const onMouseLeave = () => {
      if (!stateRef.current.dragging) {
        clearTimeout(stateRef.current.resumeTimer);
        stateRef.current.resumeTimer = setTimeout(() => (stateRef.current.paused = false), 400);
      }
    };
    vp.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    vp.addEventListener("touchstart", onTouchStart, { passive: true });
    vp.addEventListener("touchmove", onTouchMove, { passive: true });
    vp.addEventListener("touchend", onTouchEnd);
    vp.addEventListener("touchcancel", onTouchEnd);
    vp.addEventListener("mouseenter", onMouseEnter);
    vp.addEventListener("mouseleave", onMouseLeave);
    return () => {
      vp.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      vp.removeEventListener("touchstart", onTouchStart);
      vp.removeEventListener("touchmove", onTouchMove);
      vp.removeEventListener("touchend", onTouchEnd);
      vp.removeEventListener("touchcancel", onTouchEnd);
      vp.removeEventListener("mouseenter", onMouseEnter);
      vp.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <section id="video-sec" className="sec">
      <div className="sec-divider" />
      <div className="sec-inner">
        <RevealOnScroll as="div" className="s-head">
          <div>
            <div className="sec-lbl">Selected Work</div>
            <h2 className="sec-h">
              制作<em>実績</em>
            </h2>
            <p className="sec-d">新潟から全国へ。TikTok・Instagramで結果を出した制作実績の一部をご紹介します。</p>
          </div>
          <div className="s-num-big">01</div>
        </RevealOnScroll>
        <RevealOnScroll as="div" className="c-meta-row" delayClass="d1">
          <span className="work-count-badge">{valid.length ? String(valid.length).padStart(2, "0") + " WORKS" : ""}</span>
          <div className="c-speed-ctrl">
            <span className="c-speed-dot" style={{ background: flowing ? "var(--gneon)" : "var(--g400)", boxShadow: flowing ? "0 0 8px var(--gneon)" : "none" }} />
            <span>{flowing ? "FLOWING" : "PAUSED"}</span>
            <button id="pauseBtn" onClick={togglePause}>
              {flowing ? "PAUSE" : "RESUME"}
            </button>
          </div>
        </RevealOnScroll>
      </div>
      <RevealOnScroll as="div" className="c-wrap">
        <div className="c-edge c-edge-l" />
        <div className="c-edge c-edge-r" />
        <div className="c-vp" ref={vpRef}>
          <div className="c-track" ref={trackRef}>
            {!loaded ? (
              <div className="c-loading">
                <div className="c-loading-spin" />
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "11px", letterSpacing: "2px", color: "var(--g400)" }}>LOADING...</p>
              </div>
            ) : !videos.length ? (
              <div className="c-empty">
                <div className="c-ei">🎬</div>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "11px", letterSpacing: "2px" }}>NO CONTENT YET</p>
              </div>
            ) : !valid.length ? (
              <div className="c-empty">
                <div className="c-ei">⚠</div>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "11px", letterSpacing: "2px" }}>INVALID URLS</p>
              </div>
            ) : (
              repeated.map((item, i) => <TiltCard item={item} key={i} />)
            )}
          </div>
        </div>
      </RevealOnScroll>
      <div className="sec-inner">
        {valid.length ? (
          <>
            <div className="c-ctrl">
              <button className="c-btn" onClick={() => seek(-1)}>
                <svg viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button className="c-btn" onClick={() => seek(1)}>
                <svg viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
            <p className="c-hint">SWIPE / DRAG TO NAVIGATE</p>
          </>
        ) : null}
      </div>
    </section>
  );
}
