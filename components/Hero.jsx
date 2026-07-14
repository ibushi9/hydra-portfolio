"use client";
import { useEffect, useRef } from "react";
import { scrollToSection } from "@/lib/scroll";
import { useMagnetic } from "@/lib/useMagnetic";

function StatNum({ target, prefix, suffix }) {
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
    <span className="stat-num" data-target={target} ref={ref}>
      {prefix ? <em>{prefix}</em> : null}
      0
      {suffix ? <em>{suffix}</em> : null}
    </span>
  );
}

export default function Hero() {
  const canvasRef = useRef(null);
  const magneticP = useMagnetic(0.35, 60);
  const magneticO = useMagnetic(0.35, 60);

  useEffect(() => {
    const cv = canvasRef.current;
    const cx = cv.getContext("2d");
    let W, H, pts = [];
    const mouse = { x: -1000, y: -1000 };
    const N = 240, MD = 160, MOUSE_R = 180, MOUSE_FORCE = 0.012;
    let raf;

    function rsz() {
      W = cv.width = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
    }

    class P {
      constructor() {
        this.rnd();
      }
      rnd() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.ox = this.x;
        this.oy = this.y;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r = Math.random() * 1.4 + 0.3;
        this.baseA = Math.random() * 0.35 + 0.05;
        this.a = this.baseA;
        this.hue = Math.random() < 0.85 ? 145 : Math.random() < 0.5 ? 175 : 120;
        this.sat = Math.random() < 0.7 ? 100 : 60;
      }
      tick() {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_R) {
          const f = MOUSE_FORCE * (1 - d / MOUSE_R);
          this.vx += (dx / d) * f * 3;
          this.vy += (dy / d) * f * 3;
          this.a = Math.min(this.baseA * 3, 0.9);
        } else {
          this.a += (this.baseA - this.a) * 0.05;
        }
        this.vx *= 0.985;
        this.vy *= 0.985;
        this.vx += (this.ox - this.x) * 0.0008;
        this.vy += (this.oy - this.y) * 0.0008;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) { this.x = 0; this.vx *= -0.8; }
        if (this.x > W) { this.x = W; this.vx *= -0.8; }
        if (this.y < 0) { this.y = 0; this.vy *= -0.8; }
        if (this.y > H) { this.y = H; this.vy *= -0.8; }
      }
      draw() {
        cx.beginPath();
        cx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        cx.fillStyle = `hsla(${this.hue},${this.sat}%,60%,${this.a})`;
        cx.fill();
      }
    }

    function init() {
      rsz();
      pts = Array.from({ length: N }, () => new P());
    }

    function loop() {
      cx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MD) {
            const alpha = 0.14 * (1 - d / MD);
            const mi = Math.sqrt((pts[i].x - mouse.x) ** 2 + (pts[i].y - mouse.y) ** 2);
            const boost = mi < MOUSE_R ? Math.min(1, (1 - mi / MOUSE_R) * 2.5) : 1;
            cx.beginPath();
            cx.moveTo(pts[i].x, pts[i].y);
            cx.lineTo(pts[j].x, pts[j].y);
            cx.strokeStyle = `rgba(0,255,136,${alpha * boost})`;
            cx.lineWidth = 0.6;
            cx.stroke();
          }
        }
      }
      if (mouse.x > 0 && mouse.x < W) {
        const gr = cx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_R * 0.8);
        gr.addColorStop(0, "rgba(0,255,136,.04)");
        gr.addColorStop(1, "rgba(0,255,136,0)");
        cx.fillStyle = gr;
        cx.fillRect(0, 0, W, H);
      }
      pts.forEach((p) => { p.tick(); p.draw(); });
      raf = requestAnimationFrame(loop);
    }

    const hero = document.getElementById("hero");
    function onMouseMove(e) {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onMouseLeave() {
      mouse.x = -1000;
      mouse.y = -1000;
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    hero.addEventListener("mouseleave", onMouseLeave);
    const ro = new ResizeObserver(() => {
      rsz();
      pts.forEach((p) => p.rnd());
    });
    ro.observe(hero);
    init();
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      hero.removeEventListener("mouseleave", onMouseLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <section id="hero">
      <canvas id="bgCanvas" ref={canvasRef} />
      <div className="hero-noise" />
      <div className="hero-scan" />
      <div className="hero-corner hc-tl" />
      <div className="hero-corner hc-tr" />
      <div className="hero-corner hc-bl" />
      <div className="hero-corner hc-br" />
      <div className="hero-side-label">Hydra Creative Studio — 2025</div>
      <div className="hero-inner">
        <div className="hero-eyebrow au d1">
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            Now Active
          </div>
          <span className="hero-slash">/</span>
          <span className="hero-loc">Niigata → World</span>
        </div>
        <div className="hero-head au d2">
          <span className="hero-line hero-line1">魅せる技術。</span>
          <span className="hero-line hero-line2" data-text="広める戦略。">
            広める戦略。
          </span>
          <span className="hero-en">Creative Company from Niigata</span>
        </div>
        <p className="hero-sub au d3">
          動画制作・SNSマーケティング・ブランディングを通じて、
          <br />
          お客様の価値を<em>最大限</em>に引き出します。
        </p>
        <div className="hero-stats au d4">
          <div className="stat-item">
            <StatNum target={300} prefix="+" />
            <span className="stat-lbl">Projects</span>
          </div>
          <div className="stat-item">
            <StatNum target={98} suffix="%" />
            <span className="stat-lbl">Satisfaction</span>
          </div>
          <div className="stat-item">
            <StatNum target={5} suffix="+" />
            <span className="stat-lbl">Years Exp.</span>
          </div>
        </div>
        <div className="hero-ctas au d5">
          <a className="btn-p" ref={magneticP} onClick={() => scrollToSection("video-sec")}>
            制作実績を見る
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a className="btn-o" ref={magneticO} onClick={() => scrollToSection("contact")}>
            お問い合わせ
          </a>
        </div>
      </div>
      <div className="hero-watermark" aria-hidden="true">
        HYDRA
      </div>
      <div className="hero-scroll au d6" onClick={() => scrollToSection("video-sec")}>
        <div className="hero-scroll-line" />
        <span className="hero-scroll-txt">Scroll</span>
      </div>
    </section>
  );
}
